import { Request, Response } from "express";
import catchPromise from "../../utils/Controller.Layer.Helper";
import { AuthServices } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import setAuthCookie from "../../utils/setAuthCookie";
import AppError from "../../error/AppError";

const login = catchPromise(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const tokens = await AuthServices.login(email, password);
  setAuthCookie(res, tokens);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "User logged in successfully",
    data: tokens,
  });
});
const logout = catchPromise(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "User logged out successfully",
    data: null,
  });
});
const resetPassword = catchPromise(async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  await AuthServices.resetPassword(oldPassword, newPassword, req.user!.email);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Password changed successfully",
    data: null,
  });
});
const newAccessToken = catchPromise(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "No refresh token found");
  }
  const accessToken = await AuthServices.newAccessToken(refreshToken);
  setAuthCookie(res, { accessToken });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "New AccessToken retrieved successfully",
    data: accessToken,
  });
});

export const AuthController = { login, logout, resetPassword, newAccessToken };
