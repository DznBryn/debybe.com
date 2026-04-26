# debybe

Minimalist portfolio + blog, built as a micro-frontend monorepo.

Two independently deployable Next.js apps under one brand, one repo, separate subdomains:

- **`debybe.com`** — portfolio landing page (`apps/landing`)
- **`blog.debybe.com`** — MongoDB-backed blog (`apps/blog`)

Each app deploys independently. No shared browser runtime. Cross-links are absolute URLs driven by env vars.

## Stack

- Next.js 15 (App Router) + React 19
- Tailwind CSS v3 (shared preset)
- MongoDB via mongoose (blog only)
- MDX via `next-mdx-remote/rsc` + `rehype-pretty-code`
- Turborepo + pnpm workspaces
- TypeScript strict

## Repo layout

```
.
├─ apps/
│  ├─ landing/        # debybe.com
│  └─ blog/           # blog.debybe.com
├─ packages/
│  ├─ ui/             # shared React components
│  ├─ config/         # shared tailwind preset + tsconfig base
│  └─ db/             # mongoose client + Post model + queries
├─ turbo.json
├─ pnpm-workspace.yaml
└─ package.json
```

## Prerequisites

- Node.js 20+ (see `.nvmrc`)
- pnpm 9+ via Corepack:
  ```sh
  corepack enable
  corepack prepare pnpm@9.12.0 --activate
  ```
- A MongoDB connection string (local Mongo, Atlas, etc.)

## First-time setup

1. Install dependencies:

   ```sh
   pnpm install
   ```

2. Create local env files from the templates:

   ```sh
   cp apps/landing/.env.example apps/landing/.env.local
   cp apps/blog/.env.example apps/blog/.env.local
   ```

   Then edit `apps/blog/.env.local` and set your real `MONGODB_URI`.

3. Add subdomain entries to your hosts file so local dev mirrors production:

   ```sh
   sudo sh -c 'cat >> /etc/hosts <<EOF

   # debybe micro-frontends (local dev)
   127.0.0.1 debybe.local
   127.0.0.1 blog.debybe.local
   EOF'
   ```

4. Seed a few blog posts:

   ```sh
   pnpm seed:blog
   ```

## Development

Run all services in parallel:

```sh
pnpm dev
```

- Landing     → <http://debybe.local:3000>
- Blog        → <http://blog.debybe.local:3001>
- GraphQL API → <http://localhost:4000>

Run just one:

```sh
pnpm --filter @debybe/landing dev
pnpm --filter @debybe/blog dev
pnpm --filter @debybe/api dev
```

## Scripts (root)

| Script              | What it does                                              |
| ------------------- | --------------------------------------------------------- |
| `pnpm dev`          | Runs landing, blog, and GraphQL API in parallel           |
| `pnpm build`        | Production build for every app and package                |
| `pnpm lint`         | Lints everything                                          |
| `pnpm typecheck`    | Typechecks everything                                     |
| `pnpm seed:blog`    | Populates the blog database with the bundled seed posts   |
| `pnpm clean`        | Removes build artifacts and all `node_modules`            |

## Building individual apps

```sh
pnpm --filter @debybe/landing build
pnpm --filter @debybe/blog build
```

Builds succeed even without `MONGODB_URI` — DB-backed queries gracefully return empty results during build. The real data populates at runtime once the URI is set in the environment.

## Environment variables

### `apps/landing/.env.local`

```
NEXT_PUBLIC_LANDING_URL=http://debybe.local:3000
NEXT_PUBLIC_BLOG_URL=http://blog.debybe.local:3001
GRAPHQL_API_URL=http://localhost:4000
```

### `apps/blog/.env.local`

```
MONGODB_URI=mongodb://localhost:27017/blog_test
NEXT_PUBLIC_LANDING_URL=http://debybe.local:3000
NEXT_PUBLIC_BLOG_URL=http://blog.debybe.local:3001
GRAPHQL_API_URL=http://localhost:4000
GITHUB_CLIENT_ID=your_github_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret
NEXTAUTH_SECRET=generate_a_long_random_string
NEXTAUTH_URL=http://localhost:3001
ADMIN_GITHUB_LOGIN=dznbryn
```

### `apps/api/.env.local`

```
GRAPHQL_PORT=4000
NEXT_PUBLIC_LANDING_URL=http://debybe.local:3000
NEXT_PUBLIC_BLOG_URL=http://blog.debybe.local:3001
MONGODB_URI=mongodb://localhost:27017/blog_test
```

Production values:

- `NEXT_PUBLIC_LANDING_URL=https://debybe.com`
- `NEXT_PUBLIC_BLOG_URL=https://blog.debybe.com`
- `GRAPHQL_API_URL=https://api.debybe.com` (for landing/blog apps)
- `GRAPHQL_PORT=4000` (for the API app runtime)
- `MONGODB_URI=.../blogs` (or set `MONGODB_BASE_URI=...` and `MONGODB_DB_NAME=blogs`)
- `ADMIN_GITHUB_LOGIN=dznbryn` (GitHub user allowed into `/admin`)

`@debybe/db` now defaults to `blog_test` in local development and `blogs` in production when no DB name is present in the URI. It also bootstraps the `posts` collection on first connect, which creates the database automatically if it does not exist yet.

## Blog data model

`packages/db` exposes a single `Post` model:

```ts
{
  slug: string;            // unique
  title: string;
  excerpt: string;
  content: string;         // markdown / mdx
  tags: string[];
  coverImage?: string;
  status: 'draft' | 'published';
  readingMinutes: number;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

Only `status: 'published'` posts are surfaced by the public queries (`getPublishedPosts`, `getPostBySlug`, `getPostsByTag`, `getAllTags`).

Posts can be managed from `/admin/editor`, which is protected by GitHub OAuth via `next-auth` and restricted to `ADMIN_GITHUB_LOGIN`.

## Deployment

Three separate deployable services, one per app/service. Each project points at its app directory.

### Project: `debybe-landing`

- Root directory: `apps/landing`
- Framework preset: Next.js
- Env vars:
  - `NEXT_PUBLIC_LANDING_URL=https://debybe.com`
  - `NEXT_PUBLIC_BLOG_URL=https://blog.debybe.com`
- Domain: `debybe.com`

### Project: `debybe-blog`

- Root directory: `apps/blog`
- Framework preset: Next.js
- Env vars:
  - `MONGODB_URI=.../blogs`
  - `NEXT_PUBLIC_LANDING_URL=https://debybe.com`
  - `NEXT_PUBLIC_BLOG_URL=https://blog.debybe.com`
- Domain: `blog.debybe.com`

### Project: `debybe-api`

- Root directory: `apps/api`
- Runtime: Node.js service (Apollo Server)
- Env vars:
  - `GRAPHQL_PORT=4000`
  - `MONGODB_URI=.../blogs`
  - `NEXT_PUBLIC_LANDING_URL=https://debybe.com`
  - `NEXT_PUBLIC_BLOG_URL=https://blog.debybe.com`
- Domain: `api.debybe.com`

### DNS

- `debybe.com` → landing deployment (A/ALIAS)
- `blog.debybe.com` → blog deployment (CNAME)
- `api.debybe.com` → api deployment (CNAME)

No reverse proxy, no rewrites. DNS plus per-service deployments provide the subdomain split.

## Design tokens

Defined centrally in `packages/config/tailwind.preset.ts`:

- Background `#0a0a0b`
- Foreground `#e9e9ee`
- Accent `#49dcba` (teal)
- Fonts: Inter (sans) + JetBrains Mono (mono) loaded via `next/font`

Both apps extend this preset to stay visually consistent.

## Archived code

The original single-app task/todo prototype was snapshotted on the branch `archive/task-todo` prior to the monorepo migration.
