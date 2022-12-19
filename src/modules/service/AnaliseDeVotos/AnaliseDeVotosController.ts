import { Request, Response } from "express";
import Controller from "../../definitions/Controller";
import AnaliseDeVotosUseCase from "./AnaliseDeVotosUseCase";


export default class AnaliseDeVotosController extends Controller {
   
    async processRequest(request: Request, res: Response): Promise<any> {
        const body = request.body;
        
        const analiseDeVotosUseCase = new AnaliseDeVotosUseCase();
        var valores = await analiseDeVotosUseCase.execute(body);

        return res.status(200).json(valores);

    }
}