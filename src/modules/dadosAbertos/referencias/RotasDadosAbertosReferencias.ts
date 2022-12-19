import { Router } from "express";
import Controller from "../../definitions/Controller";

class RotasDadosAbertosReferencias {
    router: Router;

    constructor(
        private proposicaoSiglaTipoController: Controller
    ){
        this.router = Router();
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router.get('/referencias/proposicoes/siglaTipo', (req, res) => this.proposicaoSiglaTipoController.processRequest(req, res));
    }

    public getRouter(): Router {
        return this.router;
    }
}

export default RotasDadosAbertosReferencias;