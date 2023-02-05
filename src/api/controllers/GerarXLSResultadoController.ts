import { Request, Response } from "express";
import fs from 'fs';
import Controller from "./Controller";

import GerarXLSResultadoUseCase from "../useCases/GerarXLSResultadoUseCase";

export default class GerarXLSResultadoController extends Controller {

    async processRequest(request: Request, res: Response): Promise<any> {
        const id = request.params.id;

        const { filePath, filename } = await GerarXLSResultadoUseCase.execute(id);

        if (!fs.existsSync(filePath))
            throw new Error("Falha ao gerar relatorio");
        try {
            res.writeHead(200, {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": "attachment; filename=" + filename
            });
            fs.createReadStream(filePath).pipe(res);
            return res;
        } catch (e) {
            return res.status(500).json({ status: "Error", message: "Falha ao gerar relatório" });
        }
    }
}