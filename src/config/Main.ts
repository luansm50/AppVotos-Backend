import mongoose from "mongoose";
import ExpressApp from "../ExpressApp";
import pending from "../core/entites/ExecutionManager";

import DadosAbertos from "../modules/definitions/DadosAbertos";
import DadosAbertosFactories from "./factories/dadosAbertos/DadosAbertosFactories";
import RotaServiceFactory from "./factories/dadosAbertos/RotaServiceFactory";
import * as dotenv from 'dotenv'
import Scheduler from "../core/entites/Scheduler";
// dotenv.config({path: '/home/luan/dev/projects/my-projects/AppVotos-Backend/src/model/.env'})
dotenv.config()

export default function main() {
    
    const scheduler = new Scheduler(pending);
    scheduler.execute();

    var rotas: any[] = [];
    rotas.push(...DadosAbertosFactories.create())
    rotas.push(RotaServiceFactory.create());

    const expressApp = new ExpressApp(rotas);
    expressApp.boot();
}