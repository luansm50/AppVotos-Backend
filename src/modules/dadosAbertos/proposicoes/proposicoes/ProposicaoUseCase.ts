import { ProposicaoRequest } from "../../../../model/types";
import DadosAbertos from "../../../definitions/DadosAbertos";

export default class ProposicaoUseCase extends DadosAbertos {

    async execute(fields: Map<String, String>) {
        fields.set("ordem", "ASC");
        fields.set("ordenarPor", "id");
        fields.set("itens", "20");

        const dados = await this.get({
            endpoint: "proposicoes",
            fields
        });

        return dados;

    }

    async buscarEmDadosAbertos(){
       
    }

    async buscarEmCache(){

    }
}