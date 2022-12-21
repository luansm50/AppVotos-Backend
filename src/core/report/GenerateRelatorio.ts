import fs from 'fs';
import path from 'path';
import { f } from 'pattern-matching-js';
import { zip } from 'zip-a-folder';
import { ProposicaoResponse } from '../../model/types';
import GenerateIndentifier from '../../modules/provider/GenereateIdentificador';
import XlsReportGenerator from './XLSReportGeneretor';
const moment = require('moment-timezone');

export default class GenerateRelatorio {

    static async execute(analises: Map<String, ProposicaoResponse[]>) {
        var reportId = GenerateIndentifier.getIdItem();
        var reportPath = `/opt/proposicao/service/shared/report/${reportId}/relatorio`;
        fs.mkdirSync(reportPath, { recursive: true });

        analises.forEach((value, key) => {
            this.gerarRelatorio(value, key, reportId, reportPath);
        });

        return await this.retorno({ reportId, reportPath });
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