import { Request, Response } from "express";
import Controller from "../../../definitions/Controller";
import ProposicaoSiglaTipoUseCase from "./ProposicaoSiglaTipoUseCase";


export default class ProposicaoSiglaTipoController extends Controller {
   
    async processRequest(request: Request, res: Response): Promise<any> {
        console.log(request.ip, request.headers)
        const proposicaoSiglaTipoUseCase = new ProposicaoSiglaTipoUseCase();
        var valores = await proposicaoSiglaTipoUseCase.execute();

        return res.status(200).json(valores.dados);

    }
}