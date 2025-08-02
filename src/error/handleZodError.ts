import { ZodError } from "zod";
import { ErrorSources, HandlerResponse } from "./error.interface";

const handleZodError = (error: ZodError): HandlerResponse => {
  const errorSources: ErrorSources[] = [];

  error.issues?.forEach((issue) => {
    const path = issue?.path[issue.path.length - 1];
    const message = issue?.message;
    errorSources.push({
      path: path.toString(),
      message,
    });
  });
  return {
    statusCode: 400,
    message: "Zod Error Occured",
    errorSources,
  };
};

export default handleZodError;
