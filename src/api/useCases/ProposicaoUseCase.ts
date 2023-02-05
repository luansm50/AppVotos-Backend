import { ProposicaoRequest } from "../models/types";
import DadosAbertos from "./DadosAbertos";

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

    async executeById(id: String) {
        const dados = await this.get({
            endpoint: `proposicoes/${id}`
        });

        return dados;
    }

    async consultarTema(id: String) {
        const dados = await this.get({
            endpoint: `proposicoes/${id}/temas`
        });

        return dados;
    }
}