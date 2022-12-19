import { Request, Response } from "express";
import Controller from "../../../definitions/Controller";
import OrientacoesUseCase from "./OrientacoesUseCase";


export default class OrientacoesController extends Controller {
   
    async processRequest(request: Request, res: Response): Promise<any> {
        console.log(request.ip, request.headers)
        const orientacoesUseCase = new OrientacoesUseCase();
        // var valores = await orientacoesUseCase.execute();

        // return res.status(200).json(valores.dados);

    }
}