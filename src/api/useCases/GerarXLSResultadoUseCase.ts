import fs from 'fs';
import path from 'path';
import { zip } from 'zip-a-folder';
import { ProposicaoResponse } from '../models/types';
import GenerateIndentifier from '../../lib/GenereateIdentificador';
import XlsReportGenerator from '../../lib/XLSReportGeneretor';
const env = process.env;
import { prismaClient } from "../../database/prismaClient";


export default class GerarXLSResultadoUseCase {

    static async execute(id: string) {
        const analise: any = await prismaClient.analise.findFirst({
            where: {
                id,
            }
        })

        if (!analise)
            throw new Error("Item não encontrado");

        if (analise.status != "FINISHED")
            throw new Error("Item não disponível para download");

        console.log(id, analise);

        var analises: Map<String, ProposicaoResponse[]> | undefined = this.buscarArquivo(id);
        if (!analises)
            throw new Error("");

        var reportId = GenerateIndentifier.getIdItem();
        var reportPath = `/opt/proposicao/service/shared/report/${reportId}/relatorio`;
        fs.mkdirSync(reportPath, { recursive: true });

        analises.forEach((value, key) => {
            this.gerarRelatorio(value, key, reportId, reportPath);
        });

        return await this.retorno({ reportId, reportPath });
    }

    static buscarArquivo(arquivo: String) {
        const folderPath = env.JOURNAL;
        console.log(folderPath);
        if (!folderPath)
            return;

        const data = fs.readFileSync(folderPath + "/" + arquivo + ".map", 'utf-8');

        const map: Map<String, ProposicaoResponse[]> = new Map(Object.entries(JSON.parse(data)));
        console.log(map);

        return map;
    }

    static gerarRelatorio(proposicoes: ProposicaoResponse[], analiseId: String, reportId: String, reportPath: String) {

        var report = `${reportId}-${analiseId}`;

        XlsReportGenerator.process(proposicoes, reportPath, report);

        return { reportId, reportPath };
    }

    static async retorno({ reportPath, reportId }: any) {
        const filename = "report-" + reportId + ".zip";

        const filePath = path.join(reportPath, "..", filename + "jacir");

        if (!fs.existsSync(reportPath))
            throw new Error("Falha ao gerar relatorio");

        await zip(reportPath, filePath);

        return {
            filePath,
            filename
        };
    }
}