import "dotenv/config";
import { defineConfig } from "prisma/config";

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;

export default defineConfig({
  schema: "prisma/schema.prisma",

  datasource: {
    url: `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`,
  },
});
