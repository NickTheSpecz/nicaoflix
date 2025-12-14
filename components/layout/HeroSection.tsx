'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Play, Info } from 'lucide-react';
import { ContentItem } from '@/lib/types';

export interface HeroSectionProps {
  featuredContent: ContentItem;
  onPlayClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredContent,
  onPlayClick,
}) => {
  const [scrollY, setScrollY] = useState(0);

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const parallaxOffset = scrollY * 0.5;

  return (
    <section className="relative w-full h-[70vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden" aria-label="Conteúdo em destaque">
      {/* Backdrop Image with Parallax */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
          willChange: 'transform',
        }}
        aria-hidden="true"
      >
        <Image
          src={featuredContent.backdropPath || featuredContent.posterPath}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          quality={90}
        />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" aria-hidden="true" />

      {/* Content */}
      <div className="relative h-full flex items-end pb-12 sm:pb-16 lg:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-2xl space-y-4 sm:space-y-6">
            {/* Title */}
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-text-primary leading-tight drop-shadow-2xl">
              {featuredContent.title}
            </h1>

            {/* Metadata */}
            <div className="flex items-center gap-3 sm:gap-4 text-sm sm:text-base text-text-secondary">
              {featuredContent.releaseDate && (
                <span className="font-medium">
                  {new Date(featuredContent.releaseDate).getFullYear()}
                </span>
              )}
              {featuredContent.rating && (
                <div className="flex items-center gap-1">
                  <span className="text-accent-yellow" aria-hidden="true">★</span>
                  <span className="font-medium">
                    {featuredContent.rating.toFixed(1)}
                  </span>
                  <span className="sr-only">de 10</span>
                </div>
              )}
              {featuredContent.genres && featuredContent.genres.length > 0 && (
                <span className="hidden sm:inline">
                  {featuredContent.genres.slice(0, 3).join(' • ')}
                </span>
              )}
            </div>

            {/* Synopsis */}
            {featuredContent.overview && (
              <p className="text-text-secondary text-sm sm:text-base lg:text-lg leading-relaxed line-clamp-3 sm:line-clamp-4 drop-shadow-lg">
                {featuredContent.overview}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={onPlayClick}
                className="gap-2 shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-shadow"
                aria-label={`Assistir ${featuredContent.title}`}
              >
                <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" aria-hidden="true" />
                <span className="font-semibold">Assistir</span>
              </Button>

              <Button
                variant="secondary"
                size="lg"
                className="gap-2 backdrop-blur-sm bg-surface/80 hover:bg-surface shadow-lg"
                onClick={() => {
                  // Navigate to details page
                  window.location.href = `/detalhes/${featuredContent.type}/${featuredContent.id}`;
                }}
                aria-label={`Ver mais informações sobre ${featuredContent.title}`}
              >
                <Info className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                <span className="font-semibold hidden sm:inline">
                  Mais Informações
                </span>
                <span className="font-semibold sm:hidden">Info</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade to ensure smooth transition to content below */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" aria-hidden="true" />
    </section>
  );
};
