import { getAllTags, getPostBySlug, getPublishedPosts } from '@debybe/db';

interface PublishedPostsArgs {
  limit?: number | null;
}

const DEFAULT_POST_LIMIT = 10;
const MAX_POST_LIMIT = 50;

function clampPostLimit(value?: number | null): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return DEFAULT_POST_LIMIT;
  }
  if (value < 1) {
    return 1;
  }
  if (value > MAX_POST_LIMIT) {
    return MAX_POST_LIMIT;
  }
  return value;
}

export const typeDefs = `#graphql
  type AppInfo {
    id: ID!
    name: String!
    url: String!
  }

  type PublishedPostPreview {
    id: ID!
    slug: String!
    title: String!
    excerpt: String!
    tags: [String!]!
    readingMinutes: Int!
    publishedAt: String
    updatedAt: String!
  }

  type BlogPost {
    id: ID!
    slug: String!
    title: String!
    excerpt: String!
    content: String!
    tags: [String!]!
    readingMinutes: Int!
    publishedAt: String
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    health: String!
    apps: [AppInfo!]!
    publishedPosts(limit: Int): [PublishedPostPreview!]!
    postBySlug(slug: String!): BlogPost
    allTags: [String!]!
  }
`;

export const resolvers = {
  Query: {
    health: () => 'ok',
    apps: () => [
      {
        id: 'landing',
        name: 'Landing',
        url: process.env.NEXT_PUBLIC_LANDING_URL ?? 'http://localhost:3000',
      },
      {
        id: 'blog',
        name: 'Blog',
        url: process.env.NEXT_PUBLIC_BLOG_URL ?? 'http://localhost:3001',
      },
    ],
    publishedPosts: async (_parent: unknown, args: PublishedPostsArgs) => {
      const posts = await getPublishedPosts(clampPostLimit(args.limit));
      return posts.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        tags: post.tags,
        readingMinutes: post.readingMinutes,
        publishedAt: post.publishedAt,
        updatedAt: post.updatedAt,
      }));
    },
    postBySlug: async (_parent: unknown, args: { slug: string }) => {
      const post = await getPostBySlug(args.slug);
      if (!post) return null;
      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        tags: post.tags,
        readingMinutes: post.readingMinutes,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    },
    allTags: async () => getAllTags(),
  },
};
