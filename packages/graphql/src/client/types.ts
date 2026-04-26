export interface AppInfo {
  id: string;
  name: string;
  url: string;
}

export interface PublishedPostPreview {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  readingMinutes: number;
  publishedAt: string | null;
  updatedAt: string;
}

export interface HealthQueryResult {
  health: string;
}

export interface AppsQueryResult {
  apps: AppInfo[];
}

export interface PublishedPostsQueryResult {
  publishedPosts: PublishedPostPreview[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  readingMinutes: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostBySlugQueryResult {
  postBySlug: BlogPost | null;
}

export interface AllTagsQueryResult {
  allTags: string[];
}
