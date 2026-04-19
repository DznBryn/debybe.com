export const siteUrls = {
  landing:
    process.env.NEXT_PUBLIC_LANDING_URL ??
    (process.env.NODE_ENV === 'production' ? 'https://debybe.com' : 'http://localhost:3000'),
  blog:
    process.env.NEXT_PUBLIC_BLOG_URL ??
    (process.env.NODE_ENV === 'production'
      ? 'https://blogs.debybe.com'
      : 'http://localhost:3001'),
};
