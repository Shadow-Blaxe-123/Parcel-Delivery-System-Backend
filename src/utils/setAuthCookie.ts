import { Response } from "express";
import { env } from "../config/env";

type Tokens = {
  accessToken: string;
  refreshToken?: string;
};

const setAuthCookie = (res: Response, tokens: Tokens) => {
  const { accessToken, refreshToken } = tokens;
  if (accessToken) {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "none",
    });
  }
  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "none",
    });
  }
};
export default setAuthCookie;
