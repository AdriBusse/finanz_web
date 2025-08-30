# Repository Guidelines

## Project Structure & Module Organization
- App: `src/app` (App Router). Auth under `src/app/(auth)`, private pages under `src/app/dashboard`.
- GraphQL: `src/graphql/{client.ts,links.ts,queries,mutations,fragments,types,codegen.ts}`.
- UI: `src/components/ui` (shadcn/ui), forms in `src/components/forms`.
- Lib & State: `src/lib` (auth, SSR, fetch helpers), `src/hooks`, `src/state`.
- Styles & Config: `src/app/globals.css`, Tailwind config, and root configs (`next.config.mjs`, `tsconfig.json`).
- Scripts: `scripts/gen-ops-from-schema.mjs`. Env in `.env.local`.
- use as much as possible npm libraries. dont implement components or functions by yourself
- color scheme. dark gray. and poison green for first accents, light blue for second accent
- each query and each mutation lies in their own file
- ts tyes are also one type per file

## Build, Test, and Development Commands
- `npm run dev`: Run Next.js in development.
- `npm run build`: Production build with type checks.
- `npm start`: Start the built app.
- `npm run lint` / `pnpm typecheck`: Lint and TypeScript checks.
- `npm run codegen`: Generate GraphQL types from operations and schema.
- `npm run test` (if configured): Run unit/integration tests.

## Coding Style & Naming Conventions
- TypeScript, 2‑space indent, ESLint + Prettier. No `any`; prefer generated GraphQL types.
- Components: PascalCase file/folder names (e.g., `AccountTable.tsx`). Hooks: camelCase with `use` prefix (e.g., `useAuth`).
- GraphQL: co‑locate ops in `src/graphql/queries|mutations|fragments`; name operations clearly (e.g., `GetAccounts`).
- UI: compose shadcn primitives; ensure accessible labels and keyboard navigation.

## Testing Guidelines
- Place tests next to code or under `src`, named `*.test.ts(x)`.
- Prefer React Testing Library for components and light integration tests; mock network via Apollo testing utilities.
- Run `pnpm test` locally; keep tests deterministic and fast.

## Commit & Pull Request Guidelines
- Conventional Commits. Examples: `feat(auth): add login form`, `fix(graphql): handle nullable Account fields`, `chore(ui): add button variant`.
- PRs: clear description, linked issues, screenshots for UI changes, steps to verify, and checklist that `build`, `lint`, `typecheck`, and `codegen` pass.

## Security & Configuration Tips
- Tokens in HTTP‑only cookies only; never log or store in `localStorage`.
- `.env.local`: set `NEXT_PUBLIC_GRAPHQL_HTTP=https://apifinanzv2.ghettohippy.de/graphql`. Use HTTPS in production.
- Middleware guards `/dashboard`; logout must clear cookies and reset Apollo cache.

## Agent‑Specific Instructions
- Plan small, reversible patches; read only relevant files.
- After changes: run `pnpm build`, `pnpm lint`, `pnpm typecheck`, and `pnpm codegen`.


## Memory
- > 3 | import { useQuery, useMutation } from "@apollo/client"; cannot be imported. use this instead: import { useMutation, useQuery } from "@apollo/client/react";


## Workflow
- always let the use confirm when something need to be deleted

## Data
- the current graphql schema definition is placed in /.ai/graphql.schema