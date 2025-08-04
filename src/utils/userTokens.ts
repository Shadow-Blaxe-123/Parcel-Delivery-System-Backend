import { sign, SignOptions } from "jsonwebtoken";
import { IUser } from "../modules/user/user.interface";
import { env } from "../config/env";

const createUserTokens = (user: Partial<IUser>) => {
  const jwtPauload = {
    userId: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    address: user.address,
  };
  const accessToken = sign(jwtPauload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  } as SignOptions);
  const refreshToken = sign(jwtPauload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  } as SignOptions);
  return { accessToken, refreshToken };
};

const newAccessToken = (user: Partial<IUser>) => {
  const jwtPauload = {
    userId: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    address: user.address,
  };
  const accessToken = sign(jwtPauload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  } as SignOptions);
  return accessToken;
};

export const UserTokensUtility = { createUserTokens, newAccessToken };
