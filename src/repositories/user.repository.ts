import type {
  PrismaClient,
  User,
} from "../generated/prisma/client.js";

type CreateUserData = {
  name: string;
  email: string;
  passwordHash: string;
};

type UpdateUserData = {
  name?: string;
};

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) { }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  create(data: CreateUserData): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  update(id: string, data: UpdateUserData): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
