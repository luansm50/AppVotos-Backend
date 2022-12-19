import ProposicaoSiglaTipoController from '../../../../modules/dadosAbertos/referencias/proposicoesSiglaTipo/ProposicaoSiglaTipoController';
import RotasDadosAbertosReferencias from '../../../../modules/dadosAbertos/referencias/RotasDadosAbertosReferencias';


export default class RotasDadosAbertosReferenciasFactory {
    static create(): RotasDadosAbertosReferencias {
        const proposicaoSiglaTipoController             = new ProposicaoSiglaTipoController();

        return new RotasDadosAbertosReferencias(
            proposicaoSiglaTipoController
        );
    }
}