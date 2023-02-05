import moment from 'moment-timezone';
import randomstring from "randomstring";

export default class GenerateIndentifier{
    static getIdItem(){
        var day = moment.tz(Date.now(), "America/Sao_Paulo").format("yyyyMMDD-HHmmss");
        const random = randomstring.generate(6).toLowerCase();
        day = day + "-" + random;

        return day;
    }

    static parserIdItem(id: String){
        const ano = id.substring(0, 4);
        const mes = id.substring(4, 6);
        const dia = id.substring(6, 8);

        return {ano, mes, dia};
    }
}
