# Task Manager Backend (Modular Monolith)

This is a **modular monolith** backend for the Task Manager app, built with [NestJS](https://nestjs.com/), [TypeScript](https://www.typescriptlang.org/), and [Yarn Workspaces](https://yarnpkg.com/features/workspaces). The app is containerized with Docker and managed through `docker-compose`.

## Structure

```
task-manager-backend/
├── apps/                 # Application services (NestJS apps)
│   └── api-gateway/      # Main entrypoint API (HTTP server)
├── packages/             # Shared modules
│   ├── auth/             # Auth logic, decorators, JWT, etc.
│   ├── prisma/           # Shared PrismaService + Client wrapper
├── .yarnrc.yml           # Yarn 4 configuration
├── yarn.lock             # Monorepo lockfile
├── package.json          # Root workspace config
├── docker-compose.yml    # Multi-service Docker setup
└── tsconfig.base.json    # Shared TypeScript base config
```

## Packages

- **`@task-manager/auth`**: Provides `AuthModule`, `JwtStrategy`, guards, and custom decorators. Imported into apps like `api-gateway`.
- **`@task-manager/prisma`**: Wraps PrismaClient in a singleton NestJS service. Shared by all apps that access the DB.
- These are **shared libraries**, not standalone microservices.

## App

- **`api-gateway`**: The main NestJS HTTP server. Imports `AuthModule`, uses `PrismaService`, and routes client traffic. Acts as the single point of entry to the backend.

---

## High-Level Architecture

```
                          ┌─────────────────────┐
                          │     Web Browser     │
                          └─────────────────────┘
                                    │
                          ┌──────────────────────┐
                          │   Next.js Frontend   │ ◇─ SSR & API calls
                          └──────────────────────┘
                                    │
                            HTTP / API calls
                                    ▼
                          ┌──────────────────────┐
                          │   API Gateway (Nest) │
                          └──────────────────────┘
                                    ▼
                       ┌────────────────────────────┐
                       │ Shared Logic via Packages  │
                       │ - @task-manager/auth       │
                       │ - @task-manager/prisma     │
                       └────────────────────────────┘
```

## Centralized Tooling Strategy

This monorepo uses a **centralized tooling architecture** to reduce duplication and maintain consistency.

### Tooling Overview

All development tooling is defined in the root `package.json`. This includes:

- **Linters**: ESLint, Prettier
- **TypeScript Tooling**: `ts-node`, `ts-node-dev`, `tsconfig-paths`
- **Monorepo Management**: Yarn 4 (Berry) with Workspaces
- **Node Modules Linking**: `nodeLinker: node-modules` (for compatibility)

> Each workspace inherits config from root, and only declares its own runtime dependencies.

> `@types/node` and similar global types must still be declared per workspace due to how TypeScript resolution works.

### Key Practices

- Dev tools live at the root, not per workspace.
- Each workspace has a `tsconfig.json` extending `tsconfig.base.json` to inherit settings and path aliases..
- **Never run `yarn add` inside a workspace** — always do it from the root to avoid nested `node_modules`.

---

## Getting Started

### 1. Install Dependencies

```bash
yarn install
```

### 2. Run All Services in Docker

```bash
docker compose up --build
```

### 3. Run API Gateway Locally (Dev)

```bash
cd apps/api-gateway
yarn start:dev
```

Or from root:

```bash
yarn workspace api-gateway run start:dev
```

---

## Tooling

- **NestJS** (Modular Monolith)
- **Yarn 4** (with Workspaces)
- **Docker / docker-compose**
- **Prisma + PostgreSQL**
- **ESLint / Prettier / Jest**
- **ts-node-dev** for fast development

---

## Common Commands

Run these from the root:

```bash
yarn workspaces foreach run lint
yarn workspaces foreach run build
yarn workspaces foreach run test
```

---

## Adding a New Feature Package

```bash
mkdir packages/my-feature
cd packages/my-feature
nest g module my-feature
# Then wire it up in tsconfig and package.json
```

---

## Developer Notes

- Uses `nodeLinker: node-modules` in `.yarnrc.yml` for better ecosystem compatibility.
- Uses `tsconfig-paths` for cleaner path aliases like `@task-manager/prisma`.

```bash
corepack enable
corepack prepare yarn@stable --activate
```

---
