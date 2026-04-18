import type { MetadataRoute } from 'next';
import { getPublishedPosts, getAllTags } from '@debybe/db';

export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BLOG_URL ?? 'https://blog.debybe.com';
  const posts = await getPublishedPosts(200);
  const tags = await getAllTags();

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
