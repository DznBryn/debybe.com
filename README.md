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

Run both apps in parallel:

```sh
pnpm dev
```

- Landing → <http://debybe.local:3000>
- Blog    → <http://blog.debybe.local:3001>

Run just one:

```sh
pnpm --filter @debybe/landing dev
pnpm --filter @debybe/blog dev
```

## Scripts (root)

| Script              | What it does                                              |
| ------------------- | --------------------------------------------------------- |
| `pnpm dev`          | Runs both apps in parallel via Turborepo                  |
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
```

### `apps/blog/.env.local`

```
MONGODB_URI=mongodb://localhost:27017/debybe
NEXT_PUBLIC_LANDING_URL=http://debybe.local:3000
NEXT_PUBLIC_BLOG_URL=http://blog.debybe.local:3001
```

Production values:

- `NEXT_PUBLIC_LANDING_URL=https://debybe.com`
- `NEXT_PUBLIC_BLOG_URL=https://blog.debybe.com`

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

To add or edit posts for the MVP, extend `apps/blog/scripts/seed.ts` and re-run `pnpm seed:blog`. A proper `/admin` UI gated by `next-auth` is out of scope for this MVP.

## Deployment

Two separate Vercel (or equivalent) projects, one per app. Each project points at its app directory.

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
  - `MONGODB_URI=...`
  - `NEXT_PUBLIC_LANDING_URL=https://debybe.com`
  - `NEXT_PUBLIC_BLOG_URL=https://blog.debybe.com`
- Domain: `blog.debybe.com`

### DNS

- `debybe.com` → landing deployment (A/ALIAS)
- `blog.debybe.com` → blog deployment (CNAME)

No reverse proxy, no rewrites. DNS plus per-app deployments provide the subdomain split.

## Design tokens

Defined centrally in `packages/config/tailwind.preset.ts`:

- Background `#0a0a0b`
- Foreground `#e9e9ee`
- Accent `#49dcba` (teal)
- Fonts: Inter (sans) + JetBrains Mono (mono) loaded via `next/font`

Both apps extend this preset to stay visually consistent.

## Archived code

The original single-app task/todo prototype was snapshotted on the branch `archive/task-todo` prior to the monorepo migration.
