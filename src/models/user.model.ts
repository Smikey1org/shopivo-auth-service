// The Prisma schema is the database model.
// This file contains small application-level helpers so
// controllers/services do not need to know Prisma details.

import { User } from "../generated/prisma/client.js";

export function publicUser(user:User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}
