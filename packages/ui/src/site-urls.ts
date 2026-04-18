export const siteUrls = {
  landing:
    process.env.NEXT_PUBLIC_LANDING_URL ??
    (process.env.NODE_ENV === 'production' ? 'https://debybe.com' : 'http://debybe.local:3000'),
  blog:
    process.env.NEXT_PUBLIC_BLOG_URL ??
    (process.env.NODE_ENV === 'production'
      ? 'https://blog.debybe.com'
      : 'http://blog.debybe.local:3001'),
};
