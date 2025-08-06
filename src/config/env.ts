import dotenv from "dotenv";

dotenv.config();

interface Env {
  // Server
  PORT: number;
  DB_URL: string;
  NODE_ENV: "development" | "production";
  // Security
  HASH_SALT: number;
  ACCESS_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRES_IN: string;
  REFRESH_TOKEN_SECRET: string;
  REFRESH_TOKEN_EXPIRES_IN: string;
  // ADMIN
  ADMIN_NAME: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  ADMIN_ADDRESS: string;
  ADMIN_PHONE: string;
}

function loadEnv(): Env {
  const requiredVariables: string[] = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    "HASH_SALT",
    "ACCESS_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_SECRET",
    "REFRESH_TOKEN_EXPIRES_IN",
    "ADMIN_NAME",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD",
    "ADMIN_ADDRESS",
    "ADMIN_PHONE",
  ];
  requiredVariables.forEach((variable) => {
    if (!process.env[variable]) {
      throw new Error(`Missing environment variable: ${variable}`);
    }
  });
  return {
    // Server
    PORT: Number(process.env.PORT),
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    // Security
    HASH_SALT: Number(process.env.HASH_SALT),
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
    //ADMIN
    ADMIN_NAME: process.env.ADMIN_NAME as string,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
    ADMIN_ADDRESS: process.env.ADMIN_ADDRESS as string,
    ADMIN_PHONE: process.env.ADMIN_PHONE as string,
  };
}

export const env = loadEnv();
