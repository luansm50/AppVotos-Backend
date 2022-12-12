import { Application, NextFunction, Request, Response } from "express";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from 'cookie-parser';
// import checkcredentials from "./modulos/middleware/checkcredentials";
import "express-async-errors"
// import logger from "./logs/logger";

export default class ExpressApp {
  app: Application
  private routerList: any[]

  constructor(routerList: any[]) {
    this.app = express();
    this.routerList = routerList;
  }

  private configApp() {

    this.app.use(helmet());
    this.app.use(cors({ credentials: true, origin: true, exposedHeaders: ['Content-Disposition'] }));
    this.app.use(express.json({ limit: "250mb" }));
    this.app.use(express.urlencoded({ limit: "250mb", extended: true }));
    this.app.use(cookieParser());
    this.app.use(express.urlencoded({ extended: true }));
    // this.app.use(checkcredentials);
    this.routerList.forEach(router => {
      this.app.use(router.getRouter());
    });

    this.app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
      return response.status(500).json({
        status: "Error",
        message: error.message
      })
    });
  }

  boot(): Application {
    if (!this.app) {
      this.app = express();
    }

    this.configApp();
    this.app.listen(8082, () => {
    //   logger.info('Server up and running on port 8081...');
      console.log('Server up and running on port 8082...');
    });

    return this.app;
  }
}