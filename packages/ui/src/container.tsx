import { type HTMLAttributes } from 'react';
import { cn } from './lib/utils';

type Size = 'sm' | 'md' | 'lg';

const sizes: Record<Size, string> = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
};

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: Size;
}

export function Container({ size = 'md', className, ...props }: ContainerProps) {
  return <div className={cn('mx-auto w-full px-6 md:px-8', sizes[size], className)} {...props} />;
}
