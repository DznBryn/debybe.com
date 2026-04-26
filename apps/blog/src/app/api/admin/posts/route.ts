import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDb, PostModel } from '@debybe/db';
import { authOptions, getAllowedGithubLogin } from '@/lib/auth';
import { sanitizeSlug } from '@/lib/blog-editor';
import type { BlogArticleEditorDraft } from '@/types/blog-editor';

type CreatePostInput = BlogArticleEditorDraft;

function normalizeTags(tags: string[]): string[] {
  return [...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))];
}

function validateInput(input: CreatePostInput): string | null {
  if (!input.title.trim()) return 'Title is required.';
  if (!input.slug.trim()) return 'Slug is required.';
  if (!input.excerpt.trim()) return 'Excerpt is required.';
  if (!input.content.trim()) return 'Content is required.';
  if (!input.publishedAt) return 'Published date is required.';
  if (input.readingMinutes < 1 || Number.isNaN(input.readingMinutes)) return 'Reading minutes are invalid.';
  if (!Array.isArray(input.tags) || input.tags.length === 0) return 'At least one tag is required.';
  if (sanitizeSlug(input.slug) !== input.slug) return 'Slug must be lowercase and URL-safe.';
  return null;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const githubLogin = session?.user?.githubLogin?.toLowerCase();
  if (!githubLogin || githubLogin !== getAllowedGithubLogin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as CreatePostInput;
  const validationError = validateInput(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  await connectDb();
  const existing = await PostModel.findOne({ slug: body.slug }).lean<{ _id: unknown } | null>();
  if (existing) {
    return NextResponse.json({ error: `A post with slug "${body.slug}" already exists.` }, { status: 409 });
  }

  const created = await PostModel.create({
    slug: body.slug,
    title: body.title.trim(),
    excerpt: body.excerpt.trim(),
    content: body.content,
    tags: normalizeTags(body.tags),
    readingMinutes: body.readingMinutes,
    publishedAt: new Date(body.publishedAt),
    status: 'published',
  });

  return NextResponse.json(
    {
      id: created._id.toString(),
      slug: created.slug,
      message: 'Post created successfully.',
    },
    { status: 201 },
  );
}
