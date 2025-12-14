'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ContentItem } from '@/lib/types';
import { ContentCard } from './ContentCard';
import { ContentCardSkeleton } from '@/components/ui/LoadingSkeleton';

export interface ContentGridProps {
  items: ContentItem[];
  loading?: boolean;
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  className?: string;
}

const defaultColumns = {
  mobile: 2,
  tablet: 3,
  desktop: 5,
};

export const ContentGrid: React.FC<ContentGridProps> = ({
  items,
  loading = false,
  columns = defaultColumns,
  className = '',
}) => {
  // Generate grid column classes based on breakpoints
  const gridColsClass = `
    grid-cols-${columns.mobile}
    sm:grid-cols-${columns.tablet}
    lg:grid-cols-${columns.desktop}
  `.trim().replace(/\s+/g, ' ');

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  // Show loading skeletons
  if (loading) {
    return (
      <div
        className={`grid gap-4 sm:gap-6 ${gridColsClass} ${className}`}
        role="status"
        aria-label="Carregando conteúdo"
        aria-live="polite"
        aria-busy="true"
      >
        {Array.from({ length: columns.desktop * 2 }).map((_, index) => (
          <ContentCardSkeleton key={`skeleton-${index}`} />
        ))}
        <span className="sr-only">Carregando grade de conteúdo...</span>
      </div>
    );
  }

  // Show empty state
  if (items.length === 0) {
    return (
      <div 
        className={`flex flex-col items-center justify-center py-16 ${className}`}
        role="status"
        aria-live="polite"
      >
        <p className="text-text-secondary text-lg">Nenhum conteúdo encontrado</p>
      </div>
    );
  }

  return (
    <motion.div
      className={`grid gap-4 sm:gap-6 ${gridColsClass} ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      role="list"
      aria-label="Grade de conteúdo"
    >
      {items.map((item, index) => (
        <motion.div
          key={`${item.type}-${item.id}`}
          variants={itemVariants}
          role="listitem"
        >
          <ContentCard
            id={item.id}
            type={item.type}
            title={item.title}
            posterPath={item.posterPath}
            year={item.releaseDate ? new Date(item.releaseDate).getFullYear() : undefined}
            rating={item.rating}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
