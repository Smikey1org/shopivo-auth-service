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

COPY package*.json ./

RUN npm ci --omit=dev --omit=optional && rm -rf /usr/local/lib/node_modules/npm

COPY --from=builder --chown=node:node /myapp/dist ./dist
COPY --from=builder --chown=node:node /myapp/prisma ./prisma
COPY --from=builder --chown=node:node /myapp/prisma.config.ts ./prisma.config.ts

RUN chown -R node:node /auth-service

USER node

EXPOSE 5001

CMD ["node", "dist/server.js"]