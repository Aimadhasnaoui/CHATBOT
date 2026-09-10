import { Request, Response } from "express";

export const ResponseLogic = (req: Request, res: Response) => {
  res.send("Hello World");
};
