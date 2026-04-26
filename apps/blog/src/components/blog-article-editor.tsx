'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import type { MDEditorProps } from '@uiw/react-md-editor';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { BlogArticleEditorDraft, BlogArticleEditorErrors, SeedPost } from '@/types/blog-editor';
import {
  calculateReadingMinutes,
  formatSeedPost,
  generateSlug,
  sanitizeSlug,
  toDateTimeLocalValue,
  toSeedPost,
  validateDraft,
} from '@/lib/blog-editor';

const MDEditor = dynamic<MDEditorProps>(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false },
);

type EditorMode = 'edit' | 'preview' | 'split';

type BlogArticleEditorProps = {
  initialPost?: Partial<SeedPost>;
  onSave?: (post: SeedPost) => void;
};

function toInitialDraft(initialPost?: Partial<SeedPost>): BlogArticleEditorDraft {
  const initialDate = initialPost?.publishedAt ? new Date(initialPost.publishedAt) : new Date();
  const content = initialPost?.content ?? '';
  return {
    title: initialPost?.title ?? '',
    slug: initialPost?.slug ?? '',
    excerpt: initialPost?.excerpt ?? '',
    tags: initialPost?.tags ?? [],
    readingMinutes: initialPost?.readingMinutes ?? calculateReadingMinutes(content),
    publishedAt: toDateTimeLocalValue(initialDate),
    content,
  };
}

export function BlogArticleEditor({ initialPost, onSave }: BlogArticleEditorProps) {
  const [draft, setDraft] = useState<BlogArticleEditorDraft>(() => toInitialDraft(initialPost));
  const [mode, setMode] = useState<EditorMode>('split');
  const [tagInput, setTagInput] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(initialPost?.slug));
  const [readingMinutesManual, setReadingMinutesManual] = useState(Boolean(initialPost?.readingMinutes));
  const [errors, setErrors] = useState<BlogArticleEditorErrors>({});
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const seedPost = useMemo(() => toSeedPost(draft), [draft]);
  const objectPreview = useMemo(() => formatSeedPost(seedPost), [seedPost]);

  function setField<K extends keyof BlogArticleEditorDraft>(field: K, value: BlogArticleEditorDraft[K]) {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function onTitleChange(value: string) {
    setField('title', value);
    if (!slugManuallyEdited) {
      setField('slug', generateSlug(value));
    }
  }

  function onSlugChange(value: string) {
    setSlugManuallyEdited(true);
    setField('slug', sanitizeSlug(value));
  }

  function onContentChange(value?: string) {
    const nextContent = value ?? '';
    setField('content', nextContent);
    if (!readingMinutesManual) {
      setField('readingMinutes', calculateReadingMinutes(nextContent));
    }
  }

  function addTag(rawTag: string) {
    const tag = rawTag.trim().toLowerCase();
    if (!tag || draft.tags.includes(tag)) return;
    setDraft((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    setTagInput('');
    setErrors((prev) => ({ ...prev, tags: undefined }));
  }

  function removeTag(tag: string) {
    setDraft((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  }

  async function handleSave() {
    const nextErrors = validateDraft(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSave?.(seedPost);

    setSaving(true);
    setSaveError(null);
    setSaveMessage(null);
    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(draft),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? 'Failed to create post.');
      }

      const payload = (await response.json()) as { message?: string };
      setSaveMessage(payload.message ?? 'Post created successfully.');
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to create post.');
    } finally {
      setSaving(false);
    }
  }

  async function copyObjectPreview() {
    await navigator.clipboard.writeText(objectPreview);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-border bg-bg-soft p-6">
        <h1 className="text-2xl font-semibold text-fg">Blog Article Editor</h1>
        <p className="mt-2 text-sm text-fg-muted">
          Markdown-first editor with live preview. Output matches your `SeedPost` shape.
        </p>
      </header>

      <div className="grid gap-4 rounded-2xl border border-border bg-bg-soft p-6 md:grid-cols-2">
        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-fg">Title</span>
          <input
            value={draft.title}
            onChange={(event) => onTitleChange(event.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            placeholder="Implementing GraphQL: Part 1"
          />
          {errors.title && <span className="text-xs text-red-400">{errors.title}</span>}
        </label>

        <label className="space-y-1">
          <span className="text-sm text-fg">Slug</span>
          <input
            value={draft.slug}
            onChange={(event) => onSlugChange(event.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            placeholder="implementing-graphql-series"
          />
          {errors.slug && <span className="text-xs text-red-400">{errors.slug}</span>}
        </label>

        <label className="space-y-1">
          <span className="text-sm text-fg">Published At</span>
          <input
            type="datetime-local"
            value={draft.publishedAt}
            onChange={(event) => setField('publishedAt', event.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
          />
          {errors.publishedAt && <span className="text-xs text-red-400">{errors.publishedAt}</span>}
        </label>

        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-fg">Excerpt</span>
          <textarea
            value={draft.excerpt}
            onChange={(event) => setField('excerpt', event.target.value)}
            rows={3}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
          />
          {errors.excerpt && <span className="text-xs text-red-400">{errors.excerpt}</span>}
        </label>

        <div className="space-y-1 md:col-span-2">
          <span className="text-sm text-fg">Tags</span>
          <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-bg p-2">
            {draft.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => removeTag(tag)}
                className="rounded-full border border-border px-3 py-1 text-xs text-fg-muted hover:border-accent"
                title="Remove tag"
              >
                #{tag} ×
              </button>
            ))}
            <input
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ',') {
                  event.preventDefault();
                  addTag(tagInput.replace(/,$/, ''));
                }
              }}
              onBlur={() => addTag(tagInput)}
              className="min-w-[200px] flex-1 bg-transparent px-2 py-1 text-sm outline-none"
              placeholder="Type tag and press Enter"
            />
          </div>
          {errors.tags && <span className="text-xs text-red-400">{errors.tags}</span>}
        </div>

        <label className="space-y-1">
          <span className="text-sm text-fg">Reading Minutes</span>
          <input
            type="number"
            min={1}
            value={draft.readingMinutes}
            onChange={(event) => {
              setReadingMinutesManual(true);
              setField('readingMinutes', Number(event.target.value));
            }}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setReadingMinutesManual(false);
                setField('readingMinutes', calculateReadingMinutes(draft.content));
              }}
              className="text-xs text-fg-muted underline-offset-2 hover:text-fg hover:underline"
            >
              Recalculate automatically
            </button>
          </div>
          {errors.readingMinutes && <span className="text-xs text-red-400">{errors.readingMinutes}</span>}
        </label>
      </div>

      <section className="rounded-2xl border border-border bg-bg-soft p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            {(['edit', 'preview', 'split'] as EditorMode[]).map((candidate) => (
              <button
                key={candidate}
                type="button"
                onClick={() => setMode(candidate)}
                className={`rounded-md px-3 py-1 text-xs uppercase tracking-wider ${
                  mode === candidate
                    ? 'bg-accent text-black'
                    : 'border border-border text-fg-muted hover:border-accent'
                }`}
              >
                {candidate}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-accent px-3 py-1 text-sm font-medium text-black hover:bg-accent-soft"
          >
            {saving ? 'Creating...' : 'Create Post'}
          </button>
        </div>
        {saveError && <p className="mb-3 text-sm text-red-400">{saveError}</p>}
        {saveMessage && <p className="mb-3 text-sm text-accent">{saveMessage}</p>}

        {mode !== 'preview' && (
          <div className={mode === 'split' ? 'mb-4' : ''}>
            <MDEditor
              value={draft.content}
              onChange={onContentChange}
              height={mode === 'split' ? 320 : 420}
              preview="edit"
            />
            {errors.content && <span className="mt-1 block text-xs text-red-400">{errors.content}</span>}
          </div>
        )}

        {mode !== 'edit' && (
          <article className="prose prose-invert max-w-none rounded-xl border border-border bg-bg p-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {draft.content}
            </ReactMarkdown>
          </article>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-bg-soft p-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-fg">Generated SeedPost Object</h2>
          <button
            type="button"
            onClick={copyObjectPreview}
            className="rounded-md border border-border px-3 py-1 text-xs text-fg hover:border-accent"
          >
            {copied ? 'Copied' : 'Copy / Export'}
          </button>
        </div>
        <pre className="overflow-x-auto rounded-xl border border-border bg-bg p-4 text-xs text-fg-muted">
          <code>{objectPreview}</code>
        </pre>
      </section>
    </section>
  );
}
