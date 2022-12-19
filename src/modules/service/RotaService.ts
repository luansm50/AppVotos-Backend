import { Router } from "express";
import Controller from "../definitions/Controller";

class RotaService {
    router: Router;

    constructor(
        private analiseDeVotosController: Controller
    ){
        this.router = Router();
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router.post('/service/analise-votos', (req, res) => this.analiseDeVotosController.processRequest(req, res));
    }

    public getRouter(): Router {
        return this.router;
    }
}

export default RotaService;