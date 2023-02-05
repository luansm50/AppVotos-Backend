import { Router } from "express";
import AnaliseDeVotosController from "../api/controllers/AnaliseDeVotosController";
import Controller from "../api/controllers/Controller";
import GerarXLSResultadoController from "../api/controllers/GerarXLSResultadoController";
import GetAnalisesController from "../api/controllers/GetAnalisesController";

class RotaService {
    router: Router;

    constructor(
    ) {
        this.router = Router();
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router.post('/service/analise-votos', (req, res) => new AnaliseDeVotosController().processRequest(req, res));
        this.router.get('/service/analise-votos/:id/report', (req, res) => new GerarXLSResultadoController().processRequest(req, res));
        this.router.get('/service/analise-votos', (req, res) => new GetAnalisesController().processRequest(req, res));
    }

    public getRouter(): Router {
        return this.router;
    }
}

export default RotaService;