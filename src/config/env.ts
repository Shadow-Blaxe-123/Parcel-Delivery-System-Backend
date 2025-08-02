import dotenv from "dotenv";

dotenv.config();

interface Env {
  PORT: number;
  DB_URL: string;
  NODE_ENV: "development" | "production";
  HASH_SALT: number;
}

function loadEnv(): Env {
  const requiredVariables: string[] = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    "HASH_SALT",
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
  };
}

export const env = loadEnv();
