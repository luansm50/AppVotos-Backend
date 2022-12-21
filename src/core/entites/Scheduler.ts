import cron from "node-cron";
import { PendingManager } from "./ExecutionManager";

export default class Scheduler {
  constructor(private running: PendingManager) {}

  execute() {
    //Call each minute
    cron.schedule('*/5 * * * * *', async () => {
       this.running.pending();
    });

    // cron.schedule('*/30 * * * * *', async () => {
    //   log("Checking executions...")
    //   this.running.running();
    // });

    // cron.schedule('*/60 * * * * *', async () => {
    //   log("Checking executions...")
    //   this.running.timeout();
    // });

    // cron.schedule('*/30 * * * * *', async () => {
    //   // log("Checking executions...")
    //   this.running.report();
    // });
  }
}