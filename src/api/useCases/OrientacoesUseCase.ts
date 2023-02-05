import DadosAbertos from "./DadosAbertos";

export default class OrientacoesUseCase extends DadosAbertos {

    async execute(id : String) {
        const dados = await this.get({
            endpoint: `votacoes/${id}/orientacoes`
        });

        return dados;

    }

    async buscarEmDadosAbertos(){
       
    }

    async buscarEmCache(){

    }
}