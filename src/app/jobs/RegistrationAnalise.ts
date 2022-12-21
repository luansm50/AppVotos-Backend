import AnaliseDeVotosUseCase from "../../core/entites/exec/AnaliseDeVotosUseCase"
import fs from 'fs';
const env = process.env;

export default {
    key: 'RegistrationAnalise',
    async handle({ data }: any) {
        const folderTrabalho = env.TRABALHO;
        const folderGerado = env.GERADO;
  
        if (!folderTrabalho || !folderGerado)
          return;

        const { arquivo, dados } = data;
        const map = await AnaliseDeVotosUseCase.execute(JSON.parse(dados));
        var obj = Object.fromEntries(map);
        const response = JSON.stringify(obj);

        fs.unlinkSync(folderTrabalho + "/" + arquivo);
        fs.mkdirSync(folderGerado, { recursive: true });
        fs.writeFileSync(folderGerado + "/" + arquivo, response, {});
    }
}