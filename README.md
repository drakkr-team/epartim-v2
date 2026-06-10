<!-- prettier-ignore -->
<div align="center">

<pre>
███████╗███████╗   ███████╗████████╗ █████╗  ██████╗██╗  ██╗
██╔════╝██╔════╝   ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
█████╗  ███████╗   ███████╗   ██║   ███████║██║     █████╔╝ 
██╔══╝  ╚════██║   ╚════██║   ██║   ██╔══██║██║     ██╔═██╗ 
███████╗███████║██╗███████║   ██║   ██║  ██║╚██████╗██║  ██╗
╚══════╝╚══════╝╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
</pre>

**A modern TypeScript monorepo for typed API and web application development.**

[![Node.js](https://img.shields.io/badge/Node.js-24.x-43853D?style=flat-square&logo=node.js&logoColor=white)](#)
[![pnpm](https://img.shields.io/badge/pnpm-10.33.2-f69220?style=flat-square&logo=pnpm&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-007ACC?style=flat-square&logo=typescript&logoColor=white)](#)
[![AdonisJS](https://img.shields.io/badge/AdonisJS-7.3-220052?style=flat-square&logo=AdonisJS&logoColor=white)](#)
[![TanStack Start](https://img.shields.io/badge/TanStack_Start-1.168-FF4154?style=flat-square&logo=react-query&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-19.2-20232A?style=flat-square&logo=react&logoColor=61DAFB)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](#)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.9-EF4444?style=flat-square&logo=turborepo&logoColor=white)](#)
[![Biome](https://img.shields.io/badge/Biome-2.4-60A5FA?style=flat-square&logo=biome&logoColor=white)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/eloitsme/epartim/ci.yml?style=flat-square&label=CI)](.github/workflows/ci.yml)

*AdonisJS API, TanStack Start web app, and shared UI packages connected by Tuyau and pnpm workspaces.*

[Overview](#overview) • [Stack](#stack) • [Getting Started](#getting-started) • [Commands](#commands) • [Testing](#testing) • [Architecture](#architecture)

</div>

---

## Overview

**epartim** is a pnpm/Turborepo workspace with an **AdonisJS** JSON API, a **TanStack Start** React app, and split UI packages for React components and generated Tailwind CSS. The web app consumes the API through **Tuyau**, so route definitions generate the typed client surface used by React Query hooks.

## Features

- **Typed API Client:** Tuyau exposes generated API query and mutation helpers from the Adonis route registry.
- **Feature-First API:** User-management code is grouped by domain under `apps/api/src/features/user_management`.
- **TanStack Start Web App:** File routes use custom `layout.tsx` and `page.tsx` tokens, plus route groups for guest/private flows.
- **Profile Settings Flow:** Authenticated profile UI is tabbed across `/profile`, `/profile/security`, and `/profile/privacy`.
- **Shared UI Packages:** `@workspace/ui-react` provides Storybook-backed components; `@workspace/ui-theme` generates checked-in Tailwind CSS from tokens.
- **French i18n Build:** Source `locales/fr.json` files compile into a generated web bundle during install and development.

## Project Structure

```text
epartim/
├── apps/
│   ├── api/                 # AdonisJS API, queue worker, Docker Compose sidecars
│   └── web/                 # TanStack Start app, Tuyau client, French i18n build
├── packages/
│   └── ui/
│       ├── react/           # @workspace/ui-react, Storybook component package
│       └── theme/           # @workspace/ui-theme, token source + generated CSS
├── biome.json               # Biome formatting, linting, organize imports
├── package.json             # Root scripts, Node/pnpm pins
├── pnpm-workspace.yaml      # Workspace globs: apps/*, packages/**
└── turbo.json               # Turbo task graph
```

## Stack

| Area | Technologies |
| :--- | :--- |
| **Core** | TypeScript 6.0.3, Node 24, pnpm 10.33.2, Turborepo 2.9.16 |
| **API** | AdonisJS 7.3.4, Lucid, Bouncer, Session Auth, Queue, Mail, Tuyau, Japa |
| **Web** | React 19.2.7, TanStack Start 1.168.20, TanStack Router, TanStack Query, TanStack Form, Vite 8.0.16 |
| **UI** | Tailwind CSS 4.3.0, Base UI, tailwind-variants, lucide-react, sonner, Storybook 10.4.2 |
| **Tooling** | Biome 2.4.16, Docker, GitHub Actions |

## Getting Started

### Prerequisites

- **Node.js** `24` (`.npmrc` enforces engine strictness)
- **pnpm** `10.33.2`
- **Docker & Docker Compose** for the API database, Redis, and mail sidecars

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/eloitsme/epartim.git
   cd epartim
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

   `apps/web` runs `i18n:build` during `postinstall`, generating the French i18n bundle.

3. Configure the API environment from `apps/api/.env.example`, then start Docker.

4. Start development:

   ```bash
   pnpm dev
   ```

> [!NOTE]
> Root `pnpm dev` runs Turbo. The API dev task also starts `docker-compose` and the email queue worker; the web dev task runs Vite on port `3000` plus the locale watcher.

## Commands

Run root commands from the repository root:

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts the Turbo development graph. |
| `pnpm build` | Builds the workspace with dependency ordering. |
| `pnpm typecheck` | Runs workspace TypeScript checks. |
| `pnpm test` | Runs Turbo tests across packages; currently API/Japa only. |
| `pnpm code-quality` | Runs Biome checks. |
| `pnpm code-quality:fix` | Runs Biome safe fixes. |
| `pnpm adonis` | Forwards to the API Ace CLI. |

## Testing

API tests are colocated with user-management feature code and run through Japa:

- `*.unit.spec.ts` covers policies, jobs, and mails.
- `*.e2e.spec.ts` covers HTTP controllers with the Japa API client.
- `apps/api/bootstrap.ts` runs database migrations/truncation and starts the HTTP server for e2e suites.

Run all workspace tests with `pnpm test`, or target the API with `pnpm --filter @workspace/api test`. The CI test job is present but currently commented out.

### Targeted Execution

Use pnpm filters when working on one surface:

```bash
pnpm --filter @workspace/api dev
pnpm --filter @workspace/api worker
pnpm --filter @workspace/api docker-compose
pnpm --filter @workspace/api test

pnpm --filter @workspace/web dev
pnpm --filter @workspace/web preview
pnpm --filter @workspace/web i18n:build

pnpm --filter @workspace/ui-react dev
pnpm --filter @workspace/ui-react typecheck

pnpm --filter @workspace/ui-theme dev
pnpm --filter @workspace/ui-theme generate:tailwind
pnpm --filter @workspace/ui-theme build
```

## Architecture

<details>
<summary><strong>API</strong></summary>

- Boot files live in `apps/api/start`; runtime entries are `bin/server.ts`, `bin/console.ts`, and `bin/test.ts`.
- Routes are imported from `apps/api/start/routes.ts`, then declared inside feature modules under `src/features/user_management/*/routes.ts`.
- Generated Adonis/Tuyau artifacts power controller imports and the `@workspace/api/registry` client export.
- Mail side effects run through queue jobs on queue `emails`; local compose services are Postgres, Redis, and smtp4dev.

</details>

<details>
<summary><strong>Web</strong></summary>

- TanStack Start uses `src/routes` with `layout.tsx` and `page.tsx` route tokens from `vite.config.ts`.
- `src/router.tsx` wires the QueryClient, generated route tree, and SSR query integration.
- Feature folders mirror backend domain names; route files compose feature components.
- The profile section is route-tabbed: profile update, password security, and privacy/delete account.

</details>

<details>
<summary><strong>UI & Theme</strong></summary>

- `@workspace/ui-react` exports `components/*`, `icons`, and `hooks/*`; it has Storybook and typecheck scripts, but no build script.
- `@workspace/ui-theme` exports `tokens` and `tailwind`; edit `src/tokens.ts`, then regenerate `src/tailwind.css`.
- Web and Storybook both import the generated Tailwind CSS from the theme package.

</details>

## Generated Files

Do not edit generated files manually:

- `apps/api/.adonisjs/**`
- `apps/api/ace.js`
- `apps/api/database/schema.ts`
- `apps/web/src/routeTree.gen.ts`
- `apps/web/src/libs/i18n/build/**`
- `packages/ui/theme/src/tailwind.css`

## CI & Deployment

GitHub Actions runs on pull requests. The active pipeline runs Biome, affected typecheck, and affected build; the test job exists but is currently commented out.

The API Docker image prunes/builds the API package, exposes `8080`, then runs migrations before `node apps/api/bin/server.js`. The web Docker image builds with `VITE_API_BASE_URL` and serves `apps/web/dist/client` through nginx on port `80`.

---

<div align="center">
  <i>Built with pnpm, Turbo, and the modern TypeScript web stack.</i>
</div>
