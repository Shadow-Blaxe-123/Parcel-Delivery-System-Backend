import { StatusCodes } from "http-status-codes";
import AppError from "../../utils/AppError";
import User from "../user/user.model";
import { compare } from "bcryptjs";
import { createUserTokens } from "../../utils/userTokens";

const credsentialsLogin = async (email: string, password: string) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User does not exist");
  }

  const isPasswordMatched = await compare(password, user.password);
  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid password");
  }
  const tokens = createUserTokens(user);
  return tokens;
};

export const AuthServices = {
  credsentialsLogin,
};
