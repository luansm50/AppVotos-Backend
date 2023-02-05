import { Request, Response } from "express";
import Controller from "./Controller";
import { prismaClient } from "../../database/prismaClient";

export default class GetAnalisesController extends Controller {

    async processRequest(request: Request, res: Response): Promise<any> {
        const analises: any[] = await prismaClient.analise.findMany({
            orderBy: {
                id: 'desc'
            }
        });

        return res.status(200).json({ status: "OK", analises });

    }
}