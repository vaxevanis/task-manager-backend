# API Gateway – Task Manager Backend

This is the **API Gateway** microservice for the Task Manager SaaS project.
This service is the entrypoint for the Task Manager system. It handles routing, authentication, and coordination with internal microservices.

## Features

- Acts as a single entry point for all backend services
- Routes requests to other microservices (e.g. `auth-service`, `task-service`)
- Handles request validation, auth middleware, response formatting
- Supports hot-reloading with `ts-node-dev` (Reliability in Docker, Faster than nest start --watch)
- Written in **TypeScript**, linted using **ESLint Flat Config**

## Responsibilities

- Expose unified HTTP API to clients
- Delegate auth and data operations to other services
- Perform token verification and role-based access
- Centralized rate-limiting, logging, and error handling

## Stack

- **NestJS** framework
- **TypeScript**
- **ts-node-dev** (hot reload in dev)
- **ESLint Flat Config** + Prettier
- **Jest** for unit/e2e testing

---

## Running Locally

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Running the App with Docker

From root folder:

```bash
# 1. Build the container and start the app
docker compose up --build api-gateway

# 2. Start the app
docker-compose up api-gateway

# 3. Shut it down
docker-compose down api-gateway

# 4. Rebuild if needed
docker compose build --no-cache api-gateway
```

## Scripts

See `package.json` for full list. Key scripts:

```json
{
  "start:dev": "ts-node-dev --respawn --transpile-only src/main.ts",
  "build": "nest build",
  "lint": "eslint . --ext .ts"
}
```

---

## Dev Notes

- Shared base config is in `tsconfig.base.json` at root
- Extendable with other NestJS modules (e.g., `@nestjs/config`, `@nestjs/swagger`)

---

## Directory Structure

```
src/
├── main.ts             # Bootstrap file
├── app.module.ts       # Root module
├── controllers/        # Route controllers
├── services/           # Business logic
└── common/             # Reusable pipes, guards, filters
```

---

## API Docs

To be added with `@nestjs/swagger` in the future.

## Deployment

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
