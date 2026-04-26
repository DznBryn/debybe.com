export type SeedPost = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  readingMinutes: number;
  publishedAt: Date;
  content: string;
};

export type BlogArticleEditorDraft = {
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  readingMinutes: number;
  publishedAt: string;
  content: string;
};

export type BlogArticleEditorErrors = Partial<Record<keyof BlogArticleEditorDraft, string>>;
