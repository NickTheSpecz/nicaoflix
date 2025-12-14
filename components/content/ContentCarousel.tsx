'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ContentItem } from '@/lib/types';
import { ContentCard } from './ContentCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface ContentCarouselProps {
  title: string;
  items: ContentItem[];
  className?: string;
}

export const ContentCarousel: React.FC<ContentCarouselProps> = ({
  title,
  items,
  className = '',
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
    const newScrollLeft =
      scrollContainerRef.current.scrollLeft +
      (direction === 'left' ? -scrollAmount : scrollAmount);

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <section className={`relative group ${className}`} aria-label={title}>
      {/* Section Title */}
      <h2 className="text-2xl sm:text-3xl font-display font-bold text-text-primary mb-4 px-4 sm:px-6 lg:px-8">
        {title}
      </h2>

      {/* Carousel Container */}
      <div className="relative" role="region" aria-label={`Carrossel de ${title}`}>
        {/* Left Navigation Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 sm:w-16 bg-gradient-to-r from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-start pl-2 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={`Rolar ${title} para a esquerda`}
        >
          <div className="bg-surface/80 backdrop-blur-sm rounded-full p-2 hover:bg-surface hover:scale-110 transition-all">
            <ChevronLeft className="w-6 h-6 text-text-primary" aria-hidden="true" />
          </div>
        </button>

        {/* Scrollable Content */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4 scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          role="list"
          aria-label={`Lista de ${title}`}
        >
          {items.map((item) => (
            <motion.div
              key={`${item.type}-${item.id}`}
              className="flex-shrink-0 w-36 sm:w-44 md:w-52"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              role="listitem"
            >
              <ContentCard
                id={item.id}
                type={item.type}
                title={item.title}
                posterPath={item.posterPath}
                year={
                  item.releaseDate
                    ? new Date(item.releaseDate).getFullYear()
                    : undefined
                }
                rating={item.rating}
              />
            </motion.div>
          ))}
        </div>

        {/* Right Navigation Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 sm:w-16 bg-gradient-to-l from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-end pr-2 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={`Rolar ${title} para a direita`}
        >
          <div className="bg-surface/80 backdrop-blur-sm rounded-full p-2 hover:bg-surface hover:scale-110 transition-all">
            <ChevronRight className="w-6 h-6 text-text-primary" aria-hidden="true" />
          </div>
        </button>
      </div>
    </section>
  );
};
