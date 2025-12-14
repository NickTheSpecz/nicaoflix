'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ContentItem } from '@/lib/types';
import { Star } from 'lucide-react';
import { usePrefetchOnHover } from '@/lib/utils/prefetch';

export interface ContentCardProps {
  id: string;
  type: 'movie' | 'serie' | 'anime' | 'dorama';
  title: string;
  posterPath: string;
  year?: number;
  rating?: number;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  id,
  type,
  title,
  posterPath,
  year,
  rating,
}) => {
  // Extract year from releaseDate if provided as full date
  const displayYear = year;

  // Prefetch details page on hover
  const prefetchProps = usePrefetchOnHover(`/detalhes/${type}/${id}`);

  // Build accessible label
  const typeLabel = {
    movie: 'Filme',
    serie: 'Série',
    anime: 'Anime',
    dorama: 'Dorama',
  }[type];

  const ariaLabel = [
    title,
    typeLabel,
    displayYear && `${displayYear}`,
    rating && `Avaliação ${rating.toFixed(1)} de 10`,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Link
      href={`/detalhes/${type}/${id}`}
      className="group block relative rounded-lg overflow-hidden bg-surface transition-all duration-base hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={ariaLabel}
      {...prefetchProps}
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] w-full bg-surface-light">
        <Image
          src={posterPath}
          alt={`Poster de ${title}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-base" />
      </div>

      {/* Content Info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-base">
        <h3 className="font-display font-semibold text-text-primary text-sm sm:text-base line-clamp-2 mb-1">
          {title}
        </h3>
        
        <div className="flex items-center gap-3 text-xs sm:text-sm text-text-secondary">
          {displayYear && (
            <span className="font-medium">{displayYear}</span>
          )}
          
          {rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-accent-yellow text-accent-yellow" aria-hidden="true" />
              <span className="font-medium">{rating.toFixed(1)}</span>
              <span className="sr-only">de 10</span>
            </div>
          )}
        </div>
      </div>

      {/* Always visible title for mobile */}
      <div className="sm:hidden p-2 bg-surface">
        <h3 className="font-display font-semibold text-text-primary text-xs line-clamp-1">
          {title}
        </h3>
      </div>
    </Link>
  );
};

