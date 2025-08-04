import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError";
import User from "../user/user.model";
import { compare } from "bcryptjs";
import { UserTokensUtility } from "../../utils/userTokens";
import { JwtPayload, verify } from "jsonwebtoken";
import { env } from "../../config/env";

const login = async (email: string, password: string) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User does not exist");
  }
  if (user.isBlocked || user.isDeleted) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "User has been blocked or deleted"
    );
  }

  const isPasswordMatched = await compare(password, user.password);
  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid password");
  }
  const tokens = UserTokensUtility.createUserTokens(user);
  return tokens;
};
const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  email: string
) => {
  const user = await User.findOne({ email: email });
  const isPasswordMatched = await compare(oldPassword, user!.password);
  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.FORBIDDEN, "Wrong old password");
  }
  user!.password = newPassword; // will be hashed by pre("save") hook.
  await user!.save();
};
const newAccessToken = async (refreshToken: string) => {
  const verifiedToken = verify(
    refreshToken,
    env.REFRESH_TOKEN_SECRET
  ) as JwtPayload;
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

  const token = UserTokensUtility.newAccessToken(user);
  return token;
};

export const AuthServices = {
  login,
  resetPassword,
  newAccessToken,
};
