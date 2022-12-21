import GenerateRelatorio from "../../report/GenerateRelatorio";
import { AnaliseRequest, OrientacaoVotosResponse, ProposicaoResponse, VotacoesResponse, VotosResponse } from "../../../model/types";
import ProposicaoUseCase from "../../../modules/dadosAbertos/proposicoes/proposicoes/ProposicaoUseCase";
import VotacoesUseCase from "../../../modules/dadosAbertos/proposicoes/votacoes/VotacoesUseCase";
import OrientacoesUseCase from "../../../modules/dadosAbertos/votacoes/orientacoes/OrientacoesUseCase";
import VotosUseCase from "../../../modules/dadosAbertos/votacoes/votos/VotosUseCase";

const axios = require('axios');
const proposicaoUseCase = new ProposicaoUseCase();
const votacoesUseCase = new VotacoesUseCase();
const votosUseCase = new VotosUseCase();
const orientacoesUseCase = new OrientacoesUseCase();

export default class AnaliseDeVotosUseCase {

    static async execute({ anos, tiposProposicoes }: AnaliseRequest) {
        var map: Map<String, ProposicaoResponse[]> = new Map<String, any[]>();
        for (var tipoProposicao of tiposProposicoes) {
            for (var ano of anos) {
                var vals: any[] = await this.buscarProposicoes({ ano, tipoProposicao });
                map.set(`${tipoProposicao}-${ano}`, vals);
            }
        }
        return map;

        // for (let [key, value] of map) {
        //     console.log(key, value.length);
        //     var aux: ProposicaoResponse[] = await this.buscarVotacoes(value);
        //     console.log(key, aux.length);
        //     map.set(key, aux);
        // }

        // for (let [key, value] of map) {
        //     console.log(key, value.length);
        //     var aux: ProposicaoResponse[] = await this.buscarVotos(value);
        //     aux = await this.buscarOrientacoes(aux);
        //     map.set(key, aux);
        // }
        
        // return map;
    }

    static async buscarProposicoes({ ano, tipoProposicao }: any) {
        var valores: any[] = [];
        var i: number = 1;
        do {
            var fields: Map<String, String> = new Map<String, String>();
            fields.set("ano", ano);
            fields.set("siglaTipo", tipoProposicao);
            fields.set("pagina", i.toString());
            var data = await proposicaoUseCase.execute(fields);
            var dados: ProposicaoResponse[] = data.dados;
            if (dados.length == 0)
                break;
            i++;
            valores.push(...dados);
        } while (false);

        return valores;
    }

    static async buscarVotacoes(proposicoes: ProposicaoResponse[]) {
        var proposicoesAtualizadas: ProposicaoResponse[] = [];
        for (var proposicao of proposicoes) {
            var data = await votacoesUseCase.execute(proposicao.id);
            var dados: VotacoesResponse[] = data.dados;
            dados.forEach(d => {
                const cloneProposicao: ProposicaoResponse = Object.assign({}, proposicao);
                cloneProposicao.votacao = d;
                proposicoesAtualizadas.push(cloneProposicao);
            });
        }

        return proposicoesAtualizadas;
    }

    static async buscarVotos(proposicoes: ProposicaoResponse[]) {
        var proposicoesAtualizadas: ProposicaoResponse[] = [];
        for (var proposicao of proposicoes) {
            var votacao: VotacoesResponse = proposicao.votacao;
            var data = await votosUseCase.execute(votacao.id);
            var dados: VotosResponse[] = data.dados;
            if (dados.length > 0) {
                votacao.votos = dados;
                proposicao.votacao = votacao;
                proposicoesAtualizadas.push(proposicao);
            }
        }

        return proposicoesAtualizadas;
    }

    static async buscarOrientacoes(proposicoes: ProposicaoResponse[]) {
        var proposicoesAtualizadas: ProposicaoResponse[] = [];
        for (var proposicao of proposicoes) {
            var votacao: VotacoesResponse = proposicao.votacao;
            var data = await orientacoesUseCase.execute(votacao.id);
            var dados: OrientacaoVotosResponse[] = data.dados;
            if (dados.length > 0) {
                votacao.orientacoes = dados;
                proposicao.votacao = votacao;
                proposicoesAtualizadas.push(proposicao);
            }
        }

        return proposicoesAtualizadas;
    }
}