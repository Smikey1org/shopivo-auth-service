import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env.js";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString =
  `postgresql://${encodeURIComponent(env.database.user)}:` +
  `${encodeURIComponent(env.database.password)}@` +
  `${env.database.host}:${env.database.port}/` +
  `${env.database.name}?schema=public`;

const adapter = new PrismaPg({
  connectionString,
});

export const prisma = new PrismaClient({
  adapter,
});
