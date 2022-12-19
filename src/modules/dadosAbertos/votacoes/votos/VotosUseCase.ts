import DadosAbertos from "../../../definitions/DadosAbertos";

export default class VotosUseCase extends DadosAbertos {

    async execute(id : String) {
        const dados = await this.get({
            endpoint: `votacoes/${id}/votos`
        });

        return dados;

    }

    async buscarEmDadosAbertos(){
       
    }

    async buscarEmCache(){

    }
}