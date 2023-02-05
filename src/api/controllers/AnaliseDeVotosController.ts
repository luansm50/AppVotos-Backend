import { Request, Response } from "express";
import Controller from "./Controller";
import { prismaClient } from "../../database/prismaClient";
import GenerateIndentifier from "../../lib/GenereateIdentificador";
import Queue from "../../lib/Queue";

export default class AnaliseDeVotosController extends Controller {
   
    async processRequest(request: Request, res: Response): Promise<any> {
        const id = GenerateIndentifier.getIdItem();

        console.log(id);

        const {anos, tiposProposicao} = request.body;
        const analise = await prismaClient.analise.create({
            data: {
                id,
                anos,
                tiposProposicao
            }
        });

        await Queue.add("RegistrationAnalise", { dados: analise });
        
        return res.status(200).json({status: "OK", id});

    }
}