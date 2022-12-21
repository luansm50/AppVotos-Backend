import fs from 'fs';
import { C } from 'pattern-matching-js';
import AnaliseDeVotosUseCase from './exec/AnaliseDeVotosUseCase';
import Queue from '../../app/lib/Queue';
const env = process.env;

const analisador = new AnaliseDeVotosUseCase();

// queue.process(async (nomeArquivo, done) => {
//   const folderPath = env.NOVAS;
//   const folderTrabalho = env.TRABALHO;
//   const folderGerado = env.GERADO;
//   console.log(nomeArquivo);

//   if (!folderPath || !folderTrabalho || !folderGerado)
//     return;
//   const data = fs.readFileSync(folderPath + "/" + nomeArquivo, 'utf-8');
//   // fs.mkdirSync(folderTrabalho, { recursive: true });
//   // fs.renameSync(folderPath + "/" + nomeArquivo, folderTrabalho + "/" + nomeArquivo);

//   // const map = await analisador.execute(JSON.parse(data));
//   // var obj = Object.fromEntries(map);
//   // const response = JSON.stringify(obj);

//   // fs.unlinkSync(folderTrabalho + "/" + nomeArquivo);
//   // fs.mkdirSync(folderGerado, { recursive: true });
//   // fs.writeFileSync(folderGerado + "/" + nomeArquivo,  response, {});
// })


export class PendingManager {
  public analises: String[];
  public blockToInsert: boolean;
  public analisador: AnaliseDeVotosUseCase;
  constructor() {
    this.analises = [];
    this.blockToInsert = false;
    this.analisador = new AnaliseDeVotosUseCase();
  }

  async pending() {
    const folderPath = env.NOVAS;
    if (!folderPath)
      return;

    let listaDeArquivos = fs.readdirSync(folderPath);
    for (var arquivo of listaDeArquivos) {
      const folderPath = env.NOVAS;
      const folderTrabalho = env.TRABALHO;

      if (!folderPath || !folderTrabalho)
        continue;

      const data = fs.readFileSync(folderPath + "/" + arquivo, 'utf-8');
      fs.mkdirSync(folderTrabalho, { recursive: true });
      fs.renameSync(folderPath + "/" + arquivo, folderTrabalho + "/" + arquivo);
      await Queue.add({ arquivo, dados: data });
    }
  }
}

export default new PendingManager();