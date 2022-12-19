import RotasDadosAbertosReferenciasFactory from "./referencias/RotasDadosAbertosReferenciasFactory";

export default class DadosAbertosFactories {
    static create(): any[]{
        const rotasDadosAbertosReferenciasFactory = RotasDadosAbertosReferenciasFactory.create();

        return [rotasDadosAbertosReferenciasFactory];
    }
}