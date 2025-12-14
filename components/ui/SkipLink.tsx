/**
 * SkipLink Component
 * 
 * Provides a "Skip to main content" link for keyboard users
 * Hidden until focused, allowing users to bypass navigation
 */

import React from 'react';

export interface SkipLinkProps {
  href?: string;
  children?: React.ReactNode;
}

export const SkipLink: React.FC<SkipLinkProps> = ({
  href = '#main-content',
  children = 'Pular para o conteúdo principal',
}) => {
  return (
    <a
      href={href}
      className="
        sr-only
        focus:not-sr-only
        focus:absolute
        focus:top-4
        focus:left-4
        focus:z-[100]
        focus:px-4
        focus:py-2
        focus:bg-primary
        focus:text-white
        focus:rounded
        focus:shadow-lg
        focus:outline-none
        focus:ring-2
        focus:ring-primary-light
        focus:ring-offset-2
        focus:ring-offset-background
        font-medium
        transition-all
      "
    >
      {children}
    </a>
  );
};
