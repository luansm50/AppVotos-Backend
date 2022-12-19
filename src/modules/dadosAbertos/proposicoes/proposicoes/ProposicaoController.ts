import { Request, Response } from "express";
import Controller from "../../../definitions/Controller";
import ProposicaoUseCase from "./ProposicaoUseCase";


export default class ProposicaoController extends Controller {
   
    async processRequest(request: Request, res: Response): Promise<any> {
        console.log(request.ip, request.headers)
        const proposicaoUseCase = new ProposicaoUseCase();
        // var valores = await proposicaoSiglaTipoUseCase.execute();

        // return res.status(200).json(valores.dados);

    }
}