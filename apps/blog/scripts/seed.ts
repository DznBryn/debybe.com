import { config as loadEnv } from 'dotenv';
import { PostModel, connectDb, disconnectDb, hasMongoConfig, resolveMongoUri } from '@debybe/db';

loadEnv({ path: '.env.local', quiet: true, });
loadEnv({ path: '.env', quiet: true, });

type SeedPost = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  readingMinutes: number;
  publishedAt: Date;
  content: string;
};

function redactMongoUri(uri: string): string {
  if (!(uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'))) {
    return uri;
  }
  try {
    const parsed = new URL(uri);
    if (parsed.username || parsed.password) {
      parsed.username = '***';
      parsed.password = '***';
    }
    return parsed.toString();
  } catch {
    return '[invalid mongo uri]';
  }
}

const posts: SeedPost[] = [
  {
    slug: 'welcome-to-debybe',
    title: 'Welcome to debybe',
    excerpt:
      'Why this blog exists, what I’ve been building at scale, and what I’ve learned from real production systems—frontend architecture, LLM integration, and TypeScript at depth.',
    tags: ['meta', 'systems', 'ai', 'typescript'],
    readingMinutes: 5,
    publishedAt: new Date(),
    content: `## Why this exists

This blog is where I document how real systems are built, not how they are imagined.

Most content online stops at tutorials or surface-level patterns. What’s missing is how things behave under real constraints—large datasets, complex workflows, evolving requirements, and systems that multiple teams depend on.

My focus is on:
- **Frontend architecture at scale**
- **AI systems in production (not demos)**
- **TypeScript as a design tool, not just type safety**

This isn’t theory. This comes from building and owning systems end-to-end.

---

## What I’ve been building

At \`Pratt & Whitney\`, I was the **sole frontend lead** on an internal platform called **PM Express**.

This wasn’t a typical dashboard.

It was a **financial and forecasting system** with:
- Deeply nested data hierarchies (Budget Owner → Category → IO)
- Time-phased datasets (year + monthly breakdowns)
- Editable vs locked states based on business rules
- Versioning, locking, and audit-style workflows
- Large-scale tables powered by MUI DataGrid

### What that actually meant

- Building a **"dirty layer" editing system**  
  Users could stage changes across months, review them, then commit in bulk. Nothing auto-saved.

- Designing **deterministic UI state over async data**  
  Avoiding race conditions while syncing backend data, local edits, and filters.

- Handling **performance at scale**  
  Thousands of rows, dynamic columns (months), computed totals, and real-time updates.

- Creating **clear data contracts**  
  The frontend wasn’t just consuming APIs—it enforced structure and consistency across the system.

This is where architecture stops being optional.

---

## What I learned about integrating LLMs

Most AI discussions focus on prompts. That’s not the hard part.

The real problem is **everything around the model**.

When implementing LLM features, I learned quickly:

### 1. The model is the least reliable part of your system

You cannot assume:
- consistent structure
- deterministic output
- stable performance

So you design for failure.

### 2. Structure > creativity

Strict schemas and validation matter more than clever prompts.

\`\`\`ts
const result = await client.responses.parse({
  model,
  input,
  text_format: OutputSchema,
});
\`\`\`

If it can’t be parsed, it’s not usable.

### 3. Cost and latency are first-class concerns

Every request has:
- token cost
- latency variability
- scaling implications

So you:
- truncate inputs
- cap outputs
- track usage per request

### 4. You need guardrails, not just features

- Evaluation sets before shipping
- Observability (inputs, outputs, tokens, latency)
- Fallbacks and feature flags

AI without these becomes unpredictable quickly.

---

## What TypeScript actually unlocked for me

I didn’t initially treat TypeScript as a design tool. That changed.

Working on complex systems forced a shift:

### 1. Types define system boundaries

Instead of:
- guessing API shapes
- relying on docs

Types became the **source of truth**.

### 2. Narrowing is where TypeScript becomes powerful

Understanding:
- \`typeof\`
- \`instanceof\`
- \`in\` operator
- custom type guards

turned runtime uncertainty into compile-time guarantees.

### 3. “Casting” is usually a smell

Most casting problems were actually:
- missing unions
- incorrect assumptions
- or lack of proper narrowing

Fixing the type model removed the need for unsafe casts.

### 4. Complex UI = complex types

Dynamic tables, conditional edit states, and derived values required:
- mapped types
- indexed access types
- discriminated unions

Without strong typing, the system becomes fragile fast.

---

## Architecture of this site

The site reflects the same principles.

Two independent Next.js apps, one repo:

- \`debybe.com\` — portfolio
- \`blog.debybe.com\` — this blog

### Why this structure

- **Isolation** — deployments don’t affect each other  
- **Independent velocity** — blog ships without touching the main site  
- **Clear boundaries** — no shared runtime complexity  

This is a deliberate tradeoff over multi-zone setups.

---

## What to expect

- Real implementation details, not abstractions
- Tradeoffs, not just “best practices”
- Patterns that come from production systems
- Code that reflects actual constraints

No filler. No generic content.
`,
  },
  {
    slug: 'shipping-ai-without-shipping-regret',
    title: 'Shipping AI without shipping regret',
    excerpt:
      'The three guardrails I put around every AI feature before it gets anywhere near production traffic.',
    tags: ['ai', 'production'],
    readingMinutes: 6,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    content: `Most AI features fail in production not because the model is wrong, but because the **envelope** around the model is missing.

## 1. Evaluate before you ship

If you can't describe what "good" looks like as a test, you can't ship the feature. Build an evaluation set before you build the prompt. Keep it in the repo.

## 2. Observe every call

Log inputs, outputs, latency, and cost per request. Without this, you can't tell a regression from a rumor.

\`\`\`ts
await trace('ai.summarize', async () => {
  const out = await model.run(input);
  recordMetrics({ tokens: out.usage, latency: out.latencyMs });
  return out;
});
\`\`\`

## 3. Have a kill switch

Every AI call should be behind a feature flag with a clean fallback. When the model provider has a bad day, your users shouldn't.
`,
  },
  {
    slug: 'micro-frontends-on-a-single-brand',
    title: 'Micro-frontends on a single brand',
    excerpt:
      'Why I chose subdomain-per-app deployments over Next.js Multi-Zones for debybe.com.',
    tags: ['architecture', 'systems'],
    readingMinutes: 4,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    content: `There are roughly three ways to run multiple frontends under one brand:

1. **Path-based** — everything on one domain, apps proxied at paths like \`/blog\`
2. **Multi-Zones** — Next.js rewrites routes across apps, still one origin
3. **Subdomain-per-app** — each app is its own origin on its own subdomain

For debybe.com I picked the third. Here's why:

- **Strong isolation.** A deploy on the blog cannot break the landing page. Different bundles, different caches, different crash domains.
- **Simpler mental model.** Cross-links are just URLs. There's nothing to "rewrite."
- **Independent release cadence.** The blog can ship hourly without touching the marketing page.

The cost is that I lose same-origin session sharing, which I don't need. For the MVP, the blog is read-only and anonymous.
`,
  },
  {
    slug: 'implementing-graphql-why-i-use-it',
    title: 'Implementing GraphQL: Why I Use It',
    excerpt: 'GraphQL streamlines the API layer by eliminating over-fetching, reducing endpoint sprawl, and letting the client request exactly the data it needs. This post covers why it fits well with modern frontend architecture and how Apollo Server and Apollo Client work together to structure, execute, and manage data flow.',
    tags: ['graphql', 'apollo', 'apolloserver', 'apolloclient'],
    readingMinutes: 3,
    publishedAt: new Date('2026-04-26T16:21:00.000Z'),
    content: `Before getting into how I implement GraphQL, it’s worth explaining why I reach for it in most of my API layers.

### Why GraphQL

In a lot of applications, REST starts to show friction pretty quickly:

* You either **over-fetch** (get too much data)
* Or **under-fetch** (need multiple calls to build one view)
* You end up with **too many endpoints**
* The frontend has to **orchestrate multiple requests**

GraphQL solves this by letting the client ask for exactly what it needs—nothing more, nothing less.

What I get out of it:

* **Precise data fetching** → components request only what they use
* **Single endpoint** → no endpoint sprawl
* **Aggregation layer** → combine multiple services in one query
* **Strong typing** → the schema doubles as documentation

For frontend-heavy apps (React, Next.js, Remix), this fits naturally with how components are built.

---

## The Basics: Schema + Resolvers

GraphQL really comes down to two things:

### Schema (Type Definitions)

This is the contract of your API, written in SDL.

\`\`\`graphql
type Query {
  user(id: ID!): User
}

type User {
  id: ID!
  name: String!
  email: String!
}
\`\`\`

It defines:

* What you can query
* What shape the data has
* What inputs are required

Think of it as the **blueprint of your API**.

---

### Resolvers

Resolvers are where the actual work happens.

\`\`\`ts
const resolvers = {
  Query: {
    user: async (_, { id }, { db }) => {
      return db.users.findById(id);
    },
  },
};
\`\`\`

They:

* Fetch data
* Apply business logic
* Connect to databases or other APIs

Schema says *what exists*. Resolvers define *how it works*.

---

## Server Layer: Apollo Server

This is what I use to run my GraphQL API.

It sits between the client and your data sources (MongoDB, REST APIs, etc.), and handles:

* Executing queries
* Validating against the schema
* Managing request lifecycle

### Basic Setup

\`\`\`ts
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});
\`\`\`

---

### Why Apollo Server

What I like about it:

* **Performance tools**

  * Built-in caching
  * Query batching
  * DataLoader support (fixes N+1 problems)

* **Extensibility**

  * Plugins for logging, metrics, error handling
  * Request lifecycle hooks

* **Scalability**

  * Federation support for microservices
  * Subscriptions for real-time updates

---

## Quick Note on \`startStandaloneServer\`

This is just a helper to:

* Spin up an HTTP server
* Attach Apollo Server to it
* Get something running quickly

It’s useful when you don’t want to wire up Express or another framework yet.

---

## Client Layer: Apollo Client

On the frontend, I use Apollo Client.

It’s not just a fetch library—it’s also a **state manager** for GraphQL data.

### Setup

\`\`\`ts
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
});
\`\`\`

---

### Why Apollo Client

* **All-in-one data layer**

  * Queries, mutations, subscriptions
  * Server + local state in one place

* **Smart caching**

  * Normalized cache
  * Automatic UI updates

* **Flexible networking**

  * HTTP + WebSockets
  * Retries, batching, middleware

* **Works well with React**

  * Co-locates queries with components
  * Strong TypeScript support

---

## How It All Fits Together

At a high level:

\`\`\`
Frontend (Apollo Client)
        ↓
Apollo Server (GraphQL)
        ↓
Databases / APIs
\`\`\`

GraphQL becomes the **middle layer that shapes data for the UI**, instead of forcing the UI to adapt to backend structure.

---

## Wrap Up

GraphQL simplifies a lot of the problems that show up as applications grow:

* Less API surface area
* Cleaner data flow to the frontend
* Strong typing across the stack

Apollo Server + Apollo Client make it straightforward to implement and scale.

`,
  }
];

async function main() {
  if (!hasMongoConfig()) {
    console.error('Mongo config is missing. Set MONGODB_URI or MONGODB_BASE_URI first.');
    process.exit(1);
  }

  console.log(`Connecting to ${redactMongoUri(resolveMongoUri())}`);
  await connectDb();

  for (const post of posts) {
    await PostModel.updateOne(
      { slug: post.slug },
      {
        $set: {
          ...post,
          status: 'published',
        },
      },
      { upsert: true },
    );
    console.log(`  upserted ${post.slug}`);
  }

  const total = await PostModel.countDocuments({ status: 'published' });
  console.log(`\nSeed complete. ${total} published post(s) in the database.`);

  await disconnectDb();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
