import GenerateRelatorio from "./GerarXLSResultadoUseCase";
import { AnaliseRequest, OrientacaoVotosResponse, ProposicaoResponse, TemaProposicao, VotacoesResponse, VotosResponse } from "../models/types";
import ProposicaoUseCase from "./ProposicaoUseCase";
import VotacoesUseCase from "./VotacoesUseCase";
import OrientacoesUseCase from "./OrientacoesUseCase";
import VotosUseCase from "./VotosUseCase";

const axios = require('axios');
const proposicaoUseCase = new ProposicaoUseCase();
const votacoesUseCase = new VotacoesUseCase();
const votosUseCase = new VotosUseCase();
const orientacoesUseCase = new OrientacoesUseCase();

export default class AnaliseDeVotosUseCase {

    static async execute({ anos, tiposProposicao }: AnaliseRequest) {
        var map: Map<String, ProposicaoResponse[]> = new Map<String, any[]>();
        for (var tipoProposicao of tiposProposicao) {
            for (var ano of anos) {
                var vals: any[] = await this.buscarProposicoes({ ano, tipoProposicao });
                map.set(`${tipoProposicao}-${ano}`, vals);
            }
        }

        for (var [key, value] of map.entries()) {
            var proposicaoNova: ProposicaoResponse[] = await this.buscarProposicoesDetalhada(value);
            map.set(key, proposicaoNova);
        }

        for (var [key, value] of map.entries()) {
            var proposicaoNova: ProposicaoResponse[] = await this.buscarTemas(value);
            map.set(key, proposicaoNova);
        }

        for (var [key, value] of map.entries()) {
            var proposicaoNova: ProposicaoResponse[] = await this.buscarVotacoes(value);
            map.set(key, proposicaoNova);
        }

        for (var [key, value] of map.entries()) {
            var proposicaoNova: ProposicaoResponse[] = await this.buscarVotos(value);
            map.set(key, proposicaoNova);
        }

        for (var [key, value] of map.entries()) {
            var proposicaoNova: ProposicaoResponse[] = await this.buscarOrientacoes(value);
            map.set(key, proposicaoNova);
        }

        return map;
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

    static async buscarProposicoesDetalhada(proposicoes: ProposicaoResponse[]) {
        var proposicoesAtualizadas: ProposicaoResponse[] = [];
        for (var proposicao of proposicoes) {
            var data = await proposicaoUseCase.executeById(proposicao.id);
            var dados: ProposicaoResponse = data.dados;
            proposicoesAtualizadas.push(dados);
        }

        return proposicoesAtualizadas;
    }

    static async buscarTemas(proposicoes: ProposicaoResponse[]) {
        var proposicoesAtualizadas: ProposicaoResponse[] = [];
        for (var proposicao of proposicoes) {
            var data = await proposicaoUseCase.consultarTema(proposicao.id);
            var dados: TemaProposicao[] = data.dados;
            if(dados && dados.length > 0)
                proposicao.tema = dados[0];

            proposicoesAtualizadas.push(proposicao);
        }

        return proposicoesAtualizadas;
    }
    
    static async buscarVotacoes(proposicoes: ProposicaoResponse[]) {
        var proposicoesAtualizadas: ProposicaoResponse[] = [];
        for (var proposicao of proposicoes) {
            var data = await votacoesUseCase.execute(proposicao.id);
            var dados: VotacoesResponse[] = data.dados;
            dados.forEach(d => {
                const cloneProposicao: ProposicaoResponse = Object.assign({}, proposicao);
                
                const dataVotacao = d.data;
                if(dataVotacao){
                    const val: String[] = dataVotacao.split("-");
                    const ano = val.length >= 3? val[2]: "";
                    const mes = val.length >= 2? val[1]: "";
                    d.ano = ano;
                    d.mes = mes;
                }
            
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