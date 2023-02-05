import AnaliseDeVotosUseCase from "../api/useCases/AnaliseDeVotosUseCase"
import { prismaClient } from "../database/prismaClient";
import fs from 'fs';
const env = process.env;

export default {
  key: 'RegistrationAnalise',
  async handle(queue: any, done: any) {

    const data = queue.data.dados;

    const x = await prismaClient.analise.update({
      data: {
        status: "RUNNING"
      }, 
      where: {
        id: data.id
      }
    });
    
    console.log(x);

    const analise = await AnaliseDeVotosUseCase.execute(data);
    const status = "FINISHED";
    const resultado = JSON.stringify(Object.fromEntries(analise));
    const folderPath = env.JOURNAL;
    fs.mkdirSync(folderPath + "", {recursive: true});
    fs.writeFileSync(folderPath + "/" + data.id + ".map", resultado);

    await prismaClient.analise.update({
      data: {
        status,
      }, 
      where: {
        id: data.id
      }
    });
    done();
  }
}