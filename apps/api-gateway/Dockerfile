# apps/api-gateway/Dockerfile

FROM node:20-slim AS base

WORKDIR /app

# Enable Corepack and install Yarn
RUN corepack enable && corepack prepare yarn@4.9.2 --activate

# Install required tools
RUN apt-get update && apt-get install -y openssl

# Copy monorepo files
COPY .yarnrc.yml package.json yarn.lock ./
COPY .yarn/ .yarn/
COPY tsconfig.base.json ./
COPY apps/api-gateway/package.json ./apps/api-gateway/package.json
COPY packages/prisma ./packages/prisma
COPY packages/auth ./packages/auth

# Install all deps
RUN yarn install

# Generate Prisma client for correct platform
RUN yarn workspace @task-manager/prisma prisma generate

# Final stage
FROM node:20-slim AS dev

WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.9.2 --activate
RUN apt-get update && apt-get install -y openssl

# Copy prepared /app from builder
COPY --from=base /app /app

ENV PATH="/app/node_modules/.bin:${PATH}"

CMD ["yarn", "workspace", "api-gateway", "start:dev"]