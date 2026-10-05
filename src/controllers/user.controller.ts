import type { Request, Response, NextFunction } from "express";
import type { UserService } from "../services/user.service.js";

interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

export class UserController {
  constructor(private readonly userService: UserService) {}

  profile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          message: "Unauthorized",
        });
        return;
      }

      const user = await this.userService.getProfile(userId);

      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: Request<{}, {}, UpdateProfileRequest>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          message: "Unauthorized",
        });
        return;
      }

      const user = await this.userService.updateProfile(userId, req.body);

      res.json(user);
    } catch (error) {
      next(error);
    }
  };
}
