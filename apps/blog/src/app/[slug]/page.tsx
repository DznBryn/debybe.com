import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Container, Prose } from '@debybe/ui';
import { getPostBySlug } from '@debybe/db';
import { PostHeader } from '@/components/post-header';
import { Mdx } from '@/components/mdx';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Not found' };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt ?? undefined,
      tags: post.tags,
      url: `/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main>
      <Container size="sm" className="py-16 md:py-24">
        <Link
          href="/"
          className="mb-10 inline-block font-mono text-xs uppercase tracking-[0.2em] text-fg-subtle transition-colors hover:text-accent"
        >
          ← all posts
        </Link>
        <PostHeader post={post} />
        <Prose>
          <Mdx source={post.content} />
        </Prose>
      </Container>
    </main>
  );
}
