import { config as loadEnv } from 'dotenv';
import { PostModel, connectDb, disconnectDb } from '@debybe/db';

loadEnv({ path: '.env.local' });
loadEnv({ path: '.env' });

type SeedPost = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  readingMinutes: number;
  publishedAt: Date;
  content: string;
};

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
];

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set. Create apps/blog/.env.local first.');
    process.exit(1);
  }

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
