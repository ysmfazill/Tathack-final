import React from 'react';
import { clsx } from 'clsx';

interface ContentGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ContentGrid: React.FC<ContentGridProps> = ({
  children,
  cols = 4,
  gap = 'lg',
  className,
}) => {
  const colStyles = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
    12: 'grid-cols-1 xl:grid-cols-12',
  };

  const gapStyles = {
    sm: 'gap-space-sm',
    md: 'gap-space-md',
    lg: 'gap-space-lg',
    xl: 'gap-6',
  };

  return (
    <div className={clsx('grid w-full', colStyles[cols], gapStyles[gap], className)}>
      {children}
    </div>
  );
};
