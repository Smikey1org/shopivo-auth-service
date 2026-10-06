import express from "express";
import { prisma } from "./config/database.js";
import { env } from "./config/env.js";
import { UserRepository } from "./repositories/user.repository.js";
import { AuthService } from "./services/auth.service.js";
import { UserService } from "./services/user.service.js";
import { AuthController } from "./controllers/auth.controller.js";
import { UserController } from "./controllers/user.controller.js";
import { createAuthRoutes } from "./routes/auth.routes.js";
import { createUserRoutes } from "./routes/user.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());

const repository = new UserRepository(prisma);

const authService = new AuthService(
  repository,
  env
);

const userService = new UserService(
  repository
);

const authController = new AuthController(
  authService
);

const userController = new UserController(
  userService
);

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "Welcome to Auth API",
    service: "auth",
    database: "Postgres SQL",
    language: "TypeScript",
    framework: "Express",
  });
});

app.get("/health", (_req, res) => {
  res.json({
    service: "auth-service",
    status: "ok",
  });
});

app.use(
  "/auth",
  createAuthRoutes(authController)
);

app.use(
  "/user",
  createUserRoutes(userController)
);

app.use(errorMiddleware);

export { app };
