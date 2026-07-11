import type { MetadataRoute } from 'next';
import {
  createGraphqlClient,
  GET_ALL_TAGS_QUERY,
  GET_PUBLISHED_POSTS_QUERY,
  type AllTagsQueryResult,
  type PublishedPostsQueryResult,
} from '@debybe/graphql';

export const revalidate = 600;

async function getSitemapData() {
  try {
    const client = createGraphqlClient();
    const [{ data: postsData }, { data: tagsData }] = await Promise.all([
      client.query<PublishedPostsQueryResult>({
        query: GET_PUBLISHED_POSTS_QUERY,
        variables: { limit: 200 },
      }),
      client.query<AllTagsQueryResult>({
        query: GET_ALL_TAGS_QUERY,
      }),
    ]);

    return { posts: postsData?.publishedPosts ?? [], tags: tagsData?.allTags ?? [] };
  } catch {
    return { posts: [], tags: [] };
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BLOG_URL ?? 'https://blog.debybe.com';
  const { posts, tags } = await getSitemapData();

  return [
    { url: `${baseUrl}/`, lastModified: new Date() },
    ...posts.map((p) => ({
      url: `${baseUrl}/${p.slug}`,
      lastModified: new Date(p.updatedAt),
    })),
    ...tags.map((t) => ({
      url: `${baseUrl}/tags/${encodeURIComponent(t)}`,
      lastModified: new Date(),
    })),
  ];
}
