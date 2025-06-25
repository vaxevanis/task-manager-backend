# @task-manager/prisma – Prisma Client & DB Schema

This package manages the Prisma schema, migrations, and client generation for the Task Manager monorepo.  
It acts as the centralized source of truth for all database models and access patterns.

---

## Workspace Overview

This package is meant to be consumed by other workspaces in the monorepo  
(e.g., `@task-manager/api`, `@task-manager/auth`) and should not be used standalone.

---

## Available Scripts

Run from the monorepo root:

| Command                                        | Description                |
| ---------------------------------------------- | -------------------------- |
| `yarn workspace @task-manager/prisma generate` | Generate the Prisma Client |
| `yarn workspace @task-manager/prisma migrate`  | Run a dev DB migration     |
| `yarn workspace @task-manager/prisma build`    | Compile the TS wrapper     |

---

## Notes

Keep all DB schema changes centralized in this workspace.

Use .env files per environment to manage the DATABASE_URL.

Always re-run yarn generate after editing the schema.

Node.js 18+ required

Prisma v5+

Uses CommonJS ("type": "commonjs")
