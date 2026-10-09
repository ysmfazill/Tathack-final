import React from 'react';
import { clsx } from 'clsx';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'default' | 'fluid' | 'full';
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  maxWidth = 'fluid',
}) => {
  const maxWidthStyles = {
    default: 'max-w-7xl mx-auto',
    fluid: 'w-full',
    full: 'w-full px-0',
  };

  return (
    <div
      className={clsx(
        'flex flex-col w-full gap-space-lg text-on-surface',
        maxWidthStyles[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
};
