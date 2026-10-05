import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/app.error.js";
import { publicUser } from "../models/user.model.js";
import type { env } from "../config/env.js";
import type { User } from "../generated/prisma/client.js";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
}

interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserInput): Promise<User>;
}

type Env = typeof env;

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly env: Env
  ) { }

  async register({
    name,
    email,
    password,
  }: RegisterInput) {
    if (!name || !email || !password) {
      throw new AppError(
        "name, email and password are required",
        400
      );
    }

    const normalizedEmail = email.toLowerCase();

    const existing =
      await this.userRepository.findByEmail(normalizedEmail);

    if (existing) {
      throw new AppError("Email already exists", 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await this.userRepository.create({
      name,
      email: normalizedEmail,
      passwordHash,
    });

    return publicUser(user);
  }

  async login({
    email,
    password,
  }: LoginInput) {
    const normalizedEmail = email.toLowerCase();

    const user =
      await this.userRepository.findByEmail(normalizedEmail);

    if (
      !user ||
      !(await bcrypt.compare(password, user.passwordHash))
    ) {
      throw new AppError(
        "Invalid email or password",
        401
      );
    }

    const accessToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
      },
      this.env.jwtSecret,
      {
        expiresIn: this.env.jwtExpiresIn,
      }
    );

    return {
      accessToken,
      user: publicUser(user),
    };
  }
}
