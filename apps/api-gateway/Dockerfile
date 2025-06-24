# apps/api-gateway/Dockerfile

FROM node:24-alpine3.21 AS deps

WORKDIR /app

# Enable Corepack and install Yarn
RUN corepack enable && corepack prepare yarn@4.9.2 --activate

# Copy important monorepo files from root
COPY .yarnrc.yml package.json yarn.lock ./
COPY .yarn/ .yarn/
COPY apps/api-gateway/package.json ./apps/api-gateway/package.json
COPY tsconfig.base.json ./
COPY packages/prisma ./packages/prisma


# Install all deps centrally
RUN yarn install

# Stage 2: Dev environment
FROM node:24-alpine3.21 AS dev

WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.9.2 --activate

COPY --from=deps /app /app

RUN yarn workspace @task-manager/prisma prisma generate

# Add binaries to PATH
ENV PATH="/app/node_modules/.bin:${PATH}"

CMD ["yarn", "workspace", "api-gateway", "start:dev"]