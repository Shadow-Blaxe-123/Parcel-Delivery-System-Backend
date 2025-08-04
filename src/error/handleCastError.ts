import { StatusCodes } from "http-status-codes";
import { HandlerResponse } from "./error.interface";

const handleCastError = (): HandlerResponse => {
  return {
    statusCode: StatusCodes.BAD_REQUEST,
    message: "Invalid MongoDB ID. Please provide a valid ID",
  };
};
export default handleCastError;
