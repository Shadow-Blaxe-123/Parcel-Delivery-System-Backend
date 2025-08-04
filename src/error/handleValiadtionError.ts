import mongoose from "mongoose";
import { ErrorSources, HandlerResponse } from "./error.interface";
import { StatusCodes } from "http-status-codes";

export const handleValidationError = (
  err: mongoose.Error.ValidationError
): HandlerResponse => {
  const errors = Object.values(err.errors);
  const errorSources: ErrorSources[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors.forEach((errorObject: any) =>
    errorSources.push({
      path: errorObject.path,
      message: errorObject.message,
    })
  );
  return {
    statusCode: StatusCodes.BAD_REQUEST,
    message: "Validation Error Occurred",
    errorSources,
  };
};
