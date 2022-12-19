import AnaliseDeVotosController from "../../../modules/service/AnaliseDeVotos/AnaliseDeVotosController";
import RotaService from "../../../modules/service/RotaService";

export default class RotaServiceFactory {
    static create(): RotaService {
        const analiseDeVotosController             = new AnaliseDeVotosController();

        return new RotaService(
            analiseDeVotosController
        );
    }
}