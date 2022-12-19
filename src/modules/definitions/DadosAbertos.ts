import { Request, Response } from "express";
const axios = require('axios');

export interface Req {
    endpoint: String;
    fields?: Map<String, String>;
}

export default class DadosAbertos {
    base: String;

    constructor(){
       this.base = "https://dadosabertos.camara.leg.br/api/v2";
    }

    async get({endpoint, fields}: Req){
        var url =  `${this.base}/${endpoint}`;
        if(fields && fields.size > 0){
            url = url + "?";
            for (let [key, value] of fields) {
                url = url + key + "=" + value + "&";
            }
            url = url.substring(0, url.length -1);
        }

        console.log(url);
        return await this.go(url);
    }

    async go(url: String){
        try {
            const param = {
                url: url,
                method: 'GET',
                json: true
            };

            const res: any = await axios(param);
            return res.data;
        }catch(e : any) {
            return null;
        }
    }
}