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
      'A quick note on why this blog exists, what you should expect from it, and how the two sites under debybe.com are wired together.',
    tags: ['meta', 'systems'],
    readingMinutes: 3,
    publishedAt: new Date(),
    content: `## Why this exists

This blog is the place I think out loud about **systems design**, **AI in production**, and the practical edges of shipping software that people have to operate.

It lives on its own subdomain, \`blog.debybe.com\`, because the portfolio at \`debybe.com\` serves a different intent. One is for deciding whether to work with me. The other is for learning something.

## Architecture

The site is a micro-frontend. Two independent Next.js apps, one repo, one brand:

- \`debybe.com\` — portfolio landing page
- \`blog.debybe.com\` — this blog, backed by MongoDB

Each deploys separately. No shared runtime in the browser. Cross-links are just absolute URLs driven by env vars.

## What to expect

- Short posts, specific problems, real tradeoffs
- Diagrams when they help, not when they fill space
- Code snippets you can copy
- No newsletter pitch at the bottom of every post
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
