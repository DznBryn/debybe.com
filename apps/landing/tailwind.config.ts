import type { Config } from 'tailwindcss';
import preset from '@debybe/config/tailwind';

const config: Config = {
  presets: [preset as Partial<Config>],
  content: [
    './src/app/**/*.{ts,tsx,mdx}',
    './src/components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
};

export default config;
