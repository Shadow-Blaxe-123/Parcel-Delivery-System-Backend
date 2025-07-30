/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";

type Parameter = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const catchPromise =
  (fn: Parameter) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err: any) => {
      if (env.NODE_ENV === "development") {
        console.log(err);
      }
      next(err);
    });
  };

export default catchPromise;
