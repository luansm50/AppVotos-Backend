class ExecQueue {
  private arquivos: any[];
  private runningExtra: any[];
  private queue: any[];
  private queueExtra: any[];
  private create: any[];
  private initial: Boolean;

  constructor() {
    this.arquivos = [];
    this.runningExtra = [];
    this.queue = [];
    this.queueExtra = [];
    this.create = [];
    this.initial = true;
    this.init();
  }

  private async init() {
    if (this.initial) {
      console.log("INITIAL: ", this.initial);
      await Execution.updateMany({ status: "PROCESSANDO" }, { $set: { status: "PENDING", } }, { useFindAndModify: false });
      this.initial = false;
      console.log("INITIAL: ", this.initial);
    }
  }


//     while (this.queueExtra.length > 0)
//       await this.atualizarStatus(this.queueExtra.pop(), "PENDING");

//   }

//   private async criarExecucao(petition: any) {
//     if (await this.podeCriarExecucaoPJe(petition)) {
//       await this.createExecution(petition);
//     }
//     else
//       this.queueExtra.push(petition);
//   }

//   private async createExecution(petition: any) {
//     const exec = new Execs(petition);
//     try {
//       this.runningExtra.push(petition);
//       await this.atualizarStatus(petition, "RUNNING");
//       await exec.startAt();
//       await exec.createExecution();
//     } catch (e) {
//       petition.error = e.message;
//       petition.status = "ERROR";
//       await Execution.findOneAndUpdate({ itemId: petition.itemId }, { $set: petition }, { useFindAndModify: false });
//       this.runningExtra = this.runningExtra.filter(q => q.itemId != petition.itemId);
//       return;
//     }
//   }

//   public async verificaFila() {
//     // console.log("ITENS EM EXECUCAO:", this.running.length)
//     while (this.running.length > 0) {
//       var item = this.running.pop();
//       if (await new Execs(item).verifyExec())
//         this.runningExtra = this.runningExtra.filter(q => q.itemId != item.itemId);
//     }
//   }

//   async adicionaItemNaFila(petition: any) {
//     await this.atualizarStatus(petition, "PROCESSANDO");
//     if (this.podeAdicionar(petition, this.queue)) {
//       this.queue.push(petition);
//     }
//   }

//   async atualizarStatus(petition: any, status: string) {
//     const exec = new Execs(petition);
//     await exec.update({ status });
//   }

//   async adicionaItemNaVerificacao(petition: any) {
//     if (this.podeAdicionar(petition, this.runningExtra)) {
//       if (!petition.cached || petition.cached == "") {
//         this.atualizarStatus(petition, "MISSED");
//         return;
//       }
//       else
//         this.runningExtra.push(petition);
//     }

//     if (this.podeAdicionar(petition, this.running))
//       this.running.push(petition);
//   }

//   private podeAdicionar(petition: any, fila: any[]) {
//     return fila.filter(q => q.itemId == petition.itemId).length == 0;
//   }

//   private async podeCriarExecucaoPJe(petition: any) {
//     const botId: string = petition.botId;
//     if (!botId.startsWith("pje"))
//       return true;

//     var execs: Exec[] = await Execution.find({ botId, status: "RUNNING", process: petition.process });

//     if (execs.length == 0)
//       return true;

//     execs = execs.filter(exec => {
//       if (!exec.request || !exec.request.credentials || !exec.request.credentials.username)
//         return false;

//       const userPetition = petition.request.credentials.username;
//       const userExec = exec.request.credentials.username;

//       return userPetition == userExec;
//     })

//     return execs.length == 0;
//   }

//   printQueueStatus() {
//     console.log(`[Bot Queue] => Running: ${this.running.length}`);
//   }

//   public async runningTimeout(petition: any) {
//     await new Execs(petition).timeout();    
//   }

// }

// export default class Queue {
//   private static instance: ExecQueue;

//   constructor() {
//     throw new Error("Erro");
//   }

//   static getInstance() {
//     if (!Queue.instance) []
//     Queue.instance = new ExecQueue();

//     return Queue.instance;
//   }
}