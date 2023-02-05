import fs from 'fs';
import { C } from 'pattern-matching-js';
import AnaliseDeVotosUseCase from '../api/useCases/AnaliseDeVotosUseCase';
import Queue from '../lib/Queue';
const env = process.env;

export class PendingManager {
  static async pending() {
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
      await Queue.add("RegistrationAnalise", { arquivo, dados: data });
    }
  }
}

export default new PendingManager();