import fs from 'fs';
import path from 'path';
import { f } from 'pattern-matching-js';
import { zip } from 'zip-a-folder';
import XlsReportGenerator from './XLSReportGeneretor';
const moment = require('moment-timezone');

export default class GenerateRelatorio {

    async criarOuRecuperarRelatorio({ ids, batchId, reportId, force, accountId, userId }: any) {
        var relatorio: any = await Relatorio.findOne(this.filtro({ batchId, reportId }));
        if (!relatorio)
            return this.solicitarGeracaoDeRelatorio(ids, accountId, userId, batchId);
        else if(force){
            await Relatorio.findOneAndUpdate({ reportId: relatorio.reportId }, { $set: { status: "PENDING"} }, { useFindAndModify: false });
            return {reportId: relatorio.reportId};
        }

        return await this.recuperarRelatorioGerado(relatorio);
    }

    async solicitarGeracaoDeRelatorio(ids: any[], userId: string, accountId: string, batchId?: string) {
        var reportId = GenerateIndentifier.getIdItem();
        const createdAt = moment.tz(Date.now(), "America/Sao_Paulo");
        await Relatorio.create({ itensId: ids, batchId: batchId, reportId, createdAt, userId, accountId });
        return {reportId};
    }


    async recuperarRelatorioGerado(relatorio: any) {
        var filename = relatorio.filename;
        var filePath = await DownloadFile.downloadFileZip(relatorio.reportId, filename);
        return {
            filePath,
            filename: filename
        };
    }

    filtro({ reportId, batchId }: any) {
        var filtro: any = { }
        if (reportId)
            filtro.reportId = reportId;
        if (batchId)
            filtro.batchId = batchId;

        if(!reportId && !batchId)
            throw new Error("È necessário enviar o batchId ou reportId");

        return filtro;
    }

    async gerarRelatorioPendente(relatorio: any) {
        var status: String = "FINISHED";
        var name: String = "";
        try {
            var items = relatorio.itensId;
            var execs: Exec[] = await Execution.find({ status: "FINISHED", itemId: { $in: items } });
            const { filePath, filename } = await this.execute(execs, true);
            await UploadFile.uploadReportZip(relatorio.reportId, filePath, filename);
            name = filename;
        } catch (e) {
            status = "ERROR";
        }

        await Relatorio.findOneAndUpdate({ reportId: relatorio.reportId }, { $set: { status, filename: name } }, { useFindAndModify: false });
    }

    async execute(execs: Exec[], merge: boolean, initFileNameWithProcess?: boolean, downloadSendFile?: boolean) {
        const responseRelatorio = await this.gerarRelatorio(execs, merge, initFileNameWithProcess, downloadSendFile);

        return this.retorno(responseRelatorio);
    }

    async gerarRelatorio(execs: Exec[], merge: boolean, initFileNameWithProcess?: boolean, downloadSendFile?: boolean) {
        var reportId = GenerateIndentifier.getIdItem();
        var reportPath = `/opt/oystr/service/shared/report/${reportId}/relatorio`;

        fs.mkdirSync(reportPath, { recursive: true });
        var itens: xls[] = [];
        for (var exec of execs) {
            const response: any = exec.response;
            if (response.payload)
                downloadSendFile = downloadSendFile && this.validaDownalodParaBot(exec);
            var pathSearch = `${reportPath}/${exec.itemId}`;
            fs.mkdirSync(pathSearch, { recursive: true });
            itens.push({
                exec,
                files: await this.recuperarArquivos({ archiveId: exec.archiveId, reportPath: pathSearch, payload: response.payload, reportId, merge, itemId: exec.itemId, exec, initFileNameWithProcess, downloadSendFile })
            });
        }

        await XlsReportGenerator.process(itens, merge, reportPath, reportId);

        return { reportId, reportPath };
    }

    async recuperarArquivos({ archiveId, reportPath, payload, reportId, merge, itemId, exec, initFileNameWithProcess, downloadSendFile }: any) {
        const filePath = `${reportPath}`;
        const files: any[] = await new RecuperaArquivo().process({
            payload,
            filePath,
            idReport: reportId,
            archiveId,
            merge,
            itemId,
            exec,
            initFileNameWithProcess,
            downloadSendFile
        });

        return files;
    }

    async retorno({ reportPath, reportId }: any) {
        const filename = "report-" + reportId + ".zip";

        // const location = `${reportPath}`;
        const filePath = path.join(reportPath, "..", filename + "jacir");

        if (!fs.existsSync(reportPath))
            throw new Error("Falha ao gerar relatorio");

        await zip(reportPath, filePath);

        return {
            filePath,
            filename
        };
    }

    validaDownalodParaBot(exec: Exec) {
        var botId = exec.botId;
        var extras = exec.extras;

        if (botId == "projudi-protocolo" && extras && extras.regiaoTribunal == "GO")
            return false;

        return true;
    }
}