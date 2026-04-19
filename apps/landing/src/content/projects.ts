export interface Project {
  title: string;
  role?: string;
  summary: string;
  stack: string[];
  href?: string;
}

export const projects: Project[] = [
  {
    title: 'Aerospace Financial Systems Platform',
    role: 'Pratt & Whitney — Senior Frontend Engineer',
    summary:
      'Frontend lead owning architecture for enterprise applications. Built scalable, TypeScript systems powering complex financial and forecasting workflows. Designed modular component architecture, centralized state (Redux Toolkit), and optimized performance across large data-intensive interfaces.',
    stack: ['Next.js', 'TypeScript', 'Redux Toolkit', 'MUI'],
  },
  {
    title: 'Headless Shopify migration',
    role: 'TULA Skincare — Senior Shopify/React Engineer',
    summary:
      'Migrated a monolithic Shopify setup to Hydrogen + Remix with Sanity CMS. Reduced TTFB by 35% via selective GraphQL queries, Apollo caching, and middleware over Storefront + Admin APIs.',
    stack: ['Hydrogen', 'Remix', 'Apollo', 'Sanity'],
  },
  {
    title: 'Banking application architecture',
    role: 'Bank of America — Application Architect',
    summary:
      'React application features for banking workflows. Continuous performance tuning, scalable architecture, and cross-functional alignment with Team Architect on strategic enhancements.',
    stack: ['React', 'TypeScript', 'Architecture'],
  },
  {
    title: 'Legacy-to-Next.js micro-frontend',
    role: 'Publicis Sapient — Senior Frontend Engineer (The Container Store)',
    summary:
      'Built a micro-frontend transition off a legacy JSP platform. Delivered PLP, PDP, checkout, and wishlist in Next.js with hybrid state sharing over Spring Boot APIs and localStorage.',
    stack: ['Next.js', 'React', 'Spring Boot', 'Micro-FE'],
  },
  {
    title: 'debybe blog',
    role: 'Personal — Architecture Articles',
    summary:
      'A MongoDB-backed blog deployed as an independent micro-frontend on blog.debybe.com. Notes on systems design, AI in production, and practical engineering tradeoffs.',
    stack: ['Next.js 15', 'MongoDB', 'MDX', 'Turborepo'],
    href: process.env.NEXT_PUBLIC_BLOG_URL,
  },
  {
    title: 'Enterprise React consulting',
    role: 'PwC, Isobar, Elephant, GOLO, and others',
    summary:
      'Responsive, accessible UI components across a range of industries. TDD, Apollo/GraphQL, Auth0, React Native, and Vue — shipping features that survive contact with production.',
    stack: ['React', 'GraphQL', 'Vue', 'React Native'],
  },
];
