import "dotenv/config";
import type { SignOptions } from "jsonwebtoken";

const requiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
};

const jwtExpiresIn: SignOptions["expiresIn"] =
  (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) || "1h";

export const env = {
  port: Number(process.env.PORT || 5001),

  database: {
    host: requiredEnv("DB_HOST"),
    port: requiredEnv("DB_PORT"),
    name: requiredEnv("DB_NAME"),
    user: requiredEnv("DB_USER"),
    password: requiredEnv("DB_PASSWORD"),
  },

  jwtSecret: process.env.JWT_SECRET || "123",

  jwtExpiresIn,
};
