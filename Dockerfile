# =========================
# Stage 1: Build
# =========================
FROM node:26-alpine3.24 AS builder

WORKDIR /myapp

COPY package*.json ./

RUN npm ci

COPY prisma.config.ts ./
COPY tsconfig.json ./
COPY prisma/ ./prisma/
COPY src/ ./src/

RUN npm run prisma:generate
RUN npm run build

# =========================
# Stage 2: Runtime
# =========================
FROM node:26-alpine3.24 AS runner

WORKDIR /auth-service

ENV NODE_ENV=production

USER node

COPY --from=builder --chown=node:node /myapp/node_modules ./node_modules
COPY --from=builder --chown=node:node /myapp/dist ./dist
COPY --from=builder --chown=node:node /myapp/prisma ./prisma
COPY --from=builder --chown=node:node /myapp/prisma.config.ts ./prisma.config.ts

EXPOSE 5001

CMD ["node", "dist/server.js"]
