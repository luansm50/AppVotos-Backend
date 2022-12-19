import XLSReportBuilder from "./XLSReportBuilder";
import { OrientacaoVotosResponse, ProposicaoResponse, VotosResponse } from "../../model/types";

var excelbuilder = require('msexcel-builder');

export default class XlsReportGenerator {

    static idReport: string;
    static xlsBuilder: XLSReportBuilder;

    static async process(proposicoes: ProposicaoResponse[]) {
        // var location = `${filePath}/${idReport}.xls`;
        const fields: string[] = await this.fields();

        this.xlsBuilder = new XLSReportBuilder(fields);
        this.xlsBuilder.onStart();

        proposicoes.forEach(proposicao => {
            const votos: VotosResponse[] = proposicao.votacao.votos;
            votos.forEach(voto => {
                var values: String[] = this.getValues(fields, proposicao, voto);
                this.xlsBuilder.onEntry(values);
            })
        });

        this.xlsBuilder.onEnd();
        // await this.xlsBuilder.close(location);
    }

    static async fields() {
        var fields: string[] = [
            "ID_PROPOSICAO",
            "SIGLA_TIPO",
            "NUMERO",
            "ANO",
            "EMENTA",
            "ID_VOTACAO",
            "DATA_VOTACAO",
            "DATA_HORA_REGISTRO_VOTACAO",
            "SIGLA_ORGAO_VOTACAO",
            "PROPOSICAO_OBJETO",
            "DECRICAO",
            "APROVACAO",
            "NOME_DEPUTADO",
            "PARTIDO_DEPUTADO",
            "UF_DEPUTADO",
            "DATA_VOTO",
            "VOTO",
            "ORIENTACAO_GOVERNO",
            "FAVOR_GOVERNO",
            "ORIENTACAO_PARTIDO",
            "FAVOR_PARTIDO",
            "ORIENTACAO_MINORIA",
            "FAVOR_MINORIA",
            "ORIENTACAO_MAIORIA",
            "FAVOR_MAIORIA"
        ];


        return fields;
    }

    static getValues(columns: string[], item: ProposicaoResponse, voto: VotosResponse) {
        var values: String[] = [];
        columns.forEach(column => {
            const value = this.provideValueFor(item, voto, column);
            const v: String = value == undefined ? "" : value;
            values.push(v);
        })
        return values;
    }

    static provideValueFor(item: ProposicaoResponse, voto: VotosResponse, column: string) {

        switch (column) {
            case "ID_PROPOSICAO": return item.id;
            case "SIGLA_TIPO": return item.siglaTipo;
            case "NUMERO": return item.numero;
            case "ANO": return item.ano;
            case "EMENTA": return item.ementa;
            case "ID_VOTACAO": return item.votacao.id;
            case "DATA_VOTACAO": return item.votacao.data;
            case "DATA_HORA_REGISTRO_VOTACAO": return item.votacao.data;
            case "SIGLA_ORGAO_VOTACAO": return item.votacao.data;
            case "PROPOSICAO_OBJETO": return item.votacao.data;
            case "DECRICAO": return item.votacao.data;
            case "APROVACAO": return item.votacao.data;
            case "NOME_DEPUTADO": return voto ? voto.deputado.nome : "";
            case "PARTIDO_DEPUTADO": return voto ? voto.deputado.siglaPartido : "";
            case "UF_DEPUTADO": return voto ? voto.deputado.siglaUf : "";
            case "DATA_VOTO": return voto ? voto.dataRegistroVoto : "";
            case "VOTO": return voto ? voto.tipoVoto : "";
            case "ORIENTACAO_GOVERNO": return voto ? this.votoOrientacao(voto.deputado.siglaPartido, item.votacao.orientacoes) : "";
            case "FAVOR_GOVERNO": return voto ? this.votoAFavorOrientacao(voto.tipoVoto, voto.deputado.siglaPartido, item.votacao.orientacoes) : "";
            case "ORIENTACAO_PARTIDO": return voto ? this.votoOrientacao(voto.deputado.siglaPartido, item.votacao.orientacoes) : "";
            case "FAVOR_PARTIDO": return voto ? this.votoAFavorOrientacao(voto.tipoVoto, voto.deputado.siglaPartido, item.votacao.orientacoes) : "";
            case "ORIENTACAO_MAIORIA": return voto ? this.votoOrientacao(voto.deputado.siglaPartido, item.votacao.orientacoes) : "";
            case "FAVOR_MAIORIA": return voto ? this.votoAFavorOrientacao(voto.tipoVoto, voto.deputado.siglaPartido, item.votacao.orientacoes) : "";
            case "ORIENTACAO_MINORIA": return voto ? this.votoOrientacao(voto.deputado.siglaPartido, item.votacao.orientacoes) : "";
            case "FAVOR_MINORIA": return voto ? this.votoAFavorOrientacao(voto.tipoVoto, voto.deputado.siglaPartido, item.votacao.orientacoes) : "";
        }
    }

    static votoAFavorOrientacao(tipoVoto: String, partido: String, orientacoes: OrientacaoVotosResponse[]) {
        var orientacoesFiltros: OrientacaoVotosResponse[] = orientacoes.filter(orientacao => {
            return partido.toLowerCase() == orientacao.siglaPartidoBloco.toLowerCase();
        });

        if (orientacoesFiltros.length == 0)
            return "Não";

        const orientacaoVoto = orientacoesFiltros[0].orientacaoVoto;
        switch (tipoVoto.toLowerCase()) {
            default: return orientacaoVoto.toLowerCase() == tipoVoto.toLowerCase()? "Sim": "Não";
        }
    }

    static votoOrientacao(partido: String, orientacoes: OrientacaoVotosResponse[]) {
        var orientacoesFiltros: OrientacaoVotosResponse[] = orientacoes.filter(orientacao => {
            return partido.toLowerCase() == orientacao.siglaPartidoBloco.toLowerCase();
        });

        if (orientacoesFiltros.length == 0)
            return "-";

        return orientacoesFiltros[0].orientacaoVoto;
    }
}