import mongoose from "mongoose";
import ExpressApp from "../ExpressApp";
import DadosAbertos from "../modules/definitions/DadosAbertos";
import DadosAbertosFactories from "./factories/dadosAbertos/DadosAbertosFactories";
import RotaServiceFactory from "./factories/dadosAbertos/RotaServiceFactory";

export default function main() {
    const env = process.env.NODE_ENV;

    if (env != "prod" && env != "dev")
        return;

    var rotas: any[] = [];
    rotas.push(...DadosAbertosFactories.create())
    rotas.push(RotaServiceFactory.create());

    const expressApp = new ExpressApp(rotas);
    expressApp.boot();
}