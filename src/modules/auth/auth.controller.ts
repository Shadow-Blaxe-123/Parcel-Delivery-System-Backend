import { Request, Response } from "express";
import catchPromise from "../../utils/Controller.Layer.Helper";
import { AuthServices } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import setAuthCookie from "../../utils/setAuthCookie";

const credsentialsLogin = catchPromise(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const tokens = await AuthServices.credsentialsLogin(email, password);
  setAuthCookie(res, tokens);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "User logged in successfully",
    data: tokens,
  });
});

export const AuthController = { credsentialsLogin };
