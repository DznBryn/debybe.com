import GithubSlugger from 'github-slugger';
import type { BlogArticleEditorDraft, BlogArticleEditorErrors, SeedPost } from '@/types/blog-editor';

const WORDS_PER_MINUTE = 220;

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function toDateTimeLocalValue(date: Date): string {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function generateSlug(title: string): string {
  const slugger = new GithubSlugger();
  return slugger.slug(title.trim().toLowerCase());
}

export function calculateReadingMinutes(content: string): number {
  const normalized = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .trim();

  const words = normalized.length === 0 ? 0 : normalized.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function sanitizeSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function validateDraft(draft: BlogArticleEditorDraft): BlogArticleEditorErrors {
  const errors: BlogArticleEditorErrors = {};

  if (!draft.title.trim()) errors.title = 'Title is required.';
  if (!draft.slug.trim()) errors.slug = 'Slug is required.';
  if (draft.slug && sanitizeSlug(draft.slug) !== draft.slug) {
    errors.slug = 'Slug must be lowercase and URL-safe.';
  }
  if (!draft.excerpt.trim()) errors.excerpt = 'Excerpt is required.';
  if (draft.tags.length === 0) errors.tags = 'Add at least one tag.';
  if (!draft.content.trim()) errors.content = 'Content is required.';
  if (!draft.publishedAt) errors.publishedAt = 'Publish date is required.';
  if (draft.readingMinutes < 1 || Number.isNaN(draft.readingMinutes)) {
    errors.readingMinutes = 'Reading minutes must be at least 1.';
  }

  return errors;
}

export function toSeedPost(draft: BlogArticleEditorDraft): SeedPost {
  return {
    slug: draft.slug,
    title: draft.title.trim(),
    excerpt: draft.excerpt.trim(),
    tags: draft.tags,
    readingMinutes: draft.readingMinutes,
    publishedAt: new Date(draft.publishedAt),
    content: draft.content,
  };
}

function escapeTemplateLiteral(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

export function formatSeedPost(post: SeedPost): string {
  return `{
  slug: '${post.slug}',
  title: '${post.title.replace(/'/g, "\\'")}',
  excerpt: '${post.excerpt.replace(/'/g, "\\'")}',
  tags: [${post.tags.map((tag) => `'${tag.replace(/'/g, "\\'")}'`).join(', ')}],
  readingMinutes: ${post.readingMinutes},
  publishedAt: new Date('${post.publishedAt.toISOString()}'),
  content: \`${escapeTemplateLiteral(post.content)}\`,
}`;
}
