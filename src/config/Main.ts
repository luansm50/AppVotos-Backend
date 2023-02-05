import mongoose from "mongoose";
import ExpressApp from "../ExpressApp";
import pending from "../jobs/ExecutionManager";
import * as dotenv from 'dotenv'
import Scheduler from "../jobs/Scheduler";
import RotaService from "../rotas/RotaService";
dotenv.config()

export default function main() {
    
    const scheduler = new Scheduler(pending);
    scheduler.execute();

    var rotas: any[] = [];
    rotas.push(new RotaService());

    const expressApp = new ExpressApp(rotas);
    expressApp.boot();
}