import { Router } from "express";
import type { UserController } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

export function createUserRoutes(controller: UserController): Router {
  const router = Router();

  router.get("/profile", authenticate, controller.profile);

  router.patch("/profile", authenticate, controller.update);

  return router;
}
