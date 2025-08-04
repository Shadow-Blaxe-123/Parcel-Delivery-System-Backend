import { StatusCodes } from "http-status-codes";
import { HandlerResponse } from "./error.interface";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleDuplicateError = (err: any): HandlerResponse => {
  const matchedArray = err.message.match(/"([^"]*)"/);
  return {
    statusCode: StatusCodes.CONFLICT,
    message: `${matchedArray?.[1]} already exists`,
  };
};
