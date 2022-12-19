import { Request, Response } from "express";

export default abstract class Controller {
  constructor() {
    
  }

  abstract processRequest(req: Request, res: Response): Promise<any>;
}