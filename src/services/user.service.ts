import { AppError } from "../errors/app.error.js";
import { publicUser } from "../models/user.model.js";
import type { User } from "../generated/prisma/client.js";

interface UpdateProfileData {
  name?: string;
}

interface UserRepository {
  findById(userId: string): Promise<User | null>;

  update(userId: string, data: UpdateProfileData): Promise<User>;
}

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return publicUser(user);
  }

  async updateProfile(userId: string, data: UpdateProfileData) {
    const user = await this.userRepository.update(userId, {
      name: data.name,
    });

    return publicUser(user);
  }
}
