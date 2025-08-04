/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import { env } from "../config/env";
import handleZodError from "../error/handleZodError";
import { ErrorSources } from "../error/error.interface";
import handleCastError from "../error/handleCastError";

function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statuscode = 500;
  let message = "Something went wrong";
  let errorSources: ErrorSources[] | undefined = [];

  if (env.NODE_ENV === "development") {
    console.log(err);
  }

  if (err.name === "ZodError") {
    const result = handleZodError(err);
    statuscode = result.statusCode;
    message = result.message;
    errorSources = result.errorSources;
  } else if (err.name === "CastError") {
    const result = handleCastError();
    statuscode = result.statusCode;
    message = result.message;
  } else if (err instanceof AppError) {
    statuscode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
    statuscode = 500;
  }

  res.status(statuscode).json({
    success: false,
    message,
    statuscode,
    errorSources,
    err: env.NODE_ENV === "development" ? err : null,
    stack: env.NODE_ENV === "development" ? err.stack : null,
  });
  next();
}

export default globalErrorHandler;
