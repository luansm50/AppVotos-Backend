import DadosAbertos from "../../../definitions/DadosAbertos";

export default class ProposicaoSiglaTipoUseCase extends DadosAbertos {

    async execute() {
        
        const dados = await this.get({
            endpoint: "referencias/proposicoes/siglaTipo"
        });

        return dados;

    }

    async buscarEmDadosAbertos(){
       
    }

    async buscarEmCache(){

    }
}