# Task Manager Backend (Microservices)

This is a monorepo for the Task Manager backend services, built with [NestJS](https://nestjs.com/), [TypeScript](https://www.typescriptlang.org/), and [Yarn Workspaces](https://yarnpkg.com/features/workspaces). Services are containerized with Docker and managed through `docker-compose`.

## Structure

```
task-manager-backend/
├── apps/                 # Application services
│   ├── api-gateway/      # Entrypoint API Gateway
│   ├── auth-service/     # (optional) Auth microservice
│   └── task-service/     # (optional) Tasks microservice
├── packages/             # (optional) Shared libraries
├── .yarnrc.yml           # Yarn 4 configuration
├── yarn.lock             # Monorepo lockfile
├── package.json          # Root workspace config
├── docker-compose.yml    # Multi-service Docker setup
└── tsconfig.base.json    # Shared TypeScript base config
```

## Services

- `api-gateway`: Handles HTTP traffic, routes to microservices, manages JWT auth.
- `auth-service`: Handles user registration, login, and role-based access control.
- `task-service`: Manages tasks with CRUD, filtering, and pagination.

## Tech Stack

- NestJS (per service)
- Prisma ORM + PostgreSQL
- JWT for authentication
- Microservices

## High-Level Architecture

                          ┌──────────────────────┐
                          │     Web Browser      │
                          └─────────┬────────────┘
                                    │
                          ┌─────────▼────────────┐
                          │   Next.js Frontend   │◄── SSR & API calls
                          └─────────┬────────────┘
                                    │
                            HTTP / API calls
                                    ▼
                          ┌──────────────────────┐
                          │   API Gateway (Nest) │
                          └─────────┬────────────┘
                    ┌──────────────┼────────────────────────┐
                    ▼              ▼                        ▼
           ┌────────────┐ ┌────────────────┐     ┌─────────────────┐
           │ AuthService│ │ TaskService    │     │ UserService     │
           └────────────┘ └────────────────┘     └─────────────────┘

## Centralized Tooling Strategy

This monorepo follows a centralized tooling architecture, designed to reduce duplication, ensure consistency, and simplify dependency management across multiple workspaces.

### Tooling Overview

All development tools and configurations are defined once at the root of the repository and shared across all workspaces.
This includes:
Linters: eslint, prettier, and associated plugins
TypeScript tooling: typescript, ts-node, ts-node-dev, tsconfig-paths
Monorepo tooling: Yarn Workspaces (Berry v4), Corepack, nodeLinker: node-modules

Each app or package relies on this centralized configuration and does not define its own redundant devDependencies \*.

\*Some TypeScript type packages (like @types/node) are required per workspace if their code uses global types such as process, even when tooling is centralized. This is due to how Yarn
Workspaces and TypeScript resolution work.

### Key Practices

Root-managed tooling: All dev tools are installed and versioned at the root.
Workspaces are lean: Each workspace defines only its own dependencies. Shared tools live at the root.
Project-local TypeScript config: Each workspace extends a base config (tsconfig.base.json) to inherit settings and path aliases.
No nested installs: All packages are installed from the root using yarn install.

## Getting Started

### 1. Install Dependencies

```bash
yarn install
```

### 2. Run Services Locally with Docker

```bash
docker compose up --build
```

### 3. Run a Single Service (e.g., API Gateway)

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

- **NestJS**
- **Yarn 4** (workspaces)
- **Docker / docker-compose**
- **ESLint / Prettier / Jest**
- **ts-node-dev** (for hot reloading)

---

## Project Commands

Common commands from the root:

```bash
yarn workspaces foreach run lint
yarn workspaces foreach run build
yarn workspaces foreach run test
```

---

## Adding a New Service

```bash
nest new apps/new-service-name --no-git --skip-install
cd apps/new-service-name
yarn install
```

Update the root `package.json` if needed.

---

## DEV Notes

- `nodeLinker: node-modules` is used in `.yarnrc.yml` to avoid Plug’n’Play issues.
- Avoid mixing Yarn 1.x and Yarn 4 — install via Corepack.

```
corepack enable
corepack prepare yarn@stable --activate
```
