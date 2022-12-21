import { Request, Response } from "express";
import Controller from "../../definitions/Controller";
const env = process.env;

import fs from 'fs';
import GenerateIndentifier from "../../provider/GenereateIdentificador";

export default class AnaliseDeVotosController extends Controller {
   
    async processRequest(request: Request, res: Response): Promise<any> {
        const body = request.body;
        const id = GenerateIndentifier.getIdItem();
        body.id = id;
        const folderPath = env.NOVAS;
        if(!folderPath)
            throw new Error("Falha ao solicitar consulta");

        fs.mkdirSync(folderPath, { recursive: true });
        const filePath = `${folderPath}/${id}`;

        fs.writeFile(filePath, JSON.stringify(body), { }, function (err) {
            if (err) throw new Error(err.message);
        });

        return res.status(200).json({status: "OK", id});

    }
}