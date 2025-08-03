import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { env } from "../config/env";
import AppError from "./AppError";
import { StatusCodes } from "http-status-codes";
import User from "../modules/user/user.model";

const checkAuth =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(
          StatusCodes.EXPECTATION_FAILED,
          "No Access Token found"
        );
      }
      const verifiedToken = verify(
        accessToken,
        env.ACCESS_TOKEN_SECRET
      ) as JwtPayload;
      if (!roles.includes(verifiedToken.role)) {
        throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized");
      }
      const user = await User.findOne({ email: verifiedToken.email });
      if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
      }
      if (user.isBlocked || user.isDeleted) {
        throw new AppError(
          StatusCodes.FORBIDDEN,
          "User has been blocked or deleted"
        );
      }
      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
export default checkAuth;
