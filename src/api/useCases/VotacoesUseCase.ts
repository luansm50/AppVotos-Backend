import { ProposicaoRequest } from "../models/types";
import DadosAbertos from "./DadosAbertos";

export default class VotacoesUseCase extends DadosAbertos {

    async execute(id: String) {
        var fields: Map<String, String> = new Map<String, String>();
        fields.set("ordem", "DESC");
        fields.set("ordenarPor", "dataHoraRegistro");

        const dados = await this.get({
            endpoint: `proposicoes/${id}/votacoes`,
            fields
        });

        return dados;

    }

    async buscarEmDadosAbertos(){
       
    }

    async buscarEmCache(){

    }
}