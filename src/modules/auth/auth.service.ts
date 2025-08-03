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
  const tokens = createUserTokens(user);
  // TODO: Set req.user = jwtPayload
  return tokens;
};

export const AuthServices = {
  credsentialsLogin,
};
