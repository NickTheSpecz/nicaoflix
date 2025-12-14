'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/layout/HeroSection';
import { CategoryFilter } from '@/components/layout/CategoryFilter';
import { SearchBar } from '@/components/ui/SearchBar';
import { Container } from '@/components/ui/Container';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { superflixAPI } from '@/lib/api/superflix';
import { ContentItem, Category } from '@/lib/types';
import { usePrefetchRoutes, usePrefetchContentDetails } from '@/lib/utils/prefetch';

// Lazy load heavy components
const ContentCarousel = dynamic(
  () => import('@/components/content/ContentCarousel').then((mod) => mod.ContentCarousel),
  {
    loading: () => <LoadingSpinner />,
    ssr: true,
  }
);

const ContentGrid = dynamic(
  () => import('@/components/content/ContentGrid').then((mod) => mod.ContentGrid),
  {
    loading: () => <LoadingSpinner />,
    ssr: true,
  }
);

// Define available categories
const categories: Category[] = [
  { id: 'movies', name: 'Filmes', slug: 'movies' },
  { id: 'series', name: 'Séries', slug: 'series' },
  { id: 'animes', name: 'Animes', slug: 'animes' },
  { id: 'doramas', name: 'Doramas', slug: 'doramas' },
];

export default function Home() {
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Prefetch important routes
  usePrefetchRoutes(['/filmes', '/series', '/animes', '/doramas', '/kids']);

  // Prefetch content details for visible items
  usePrefetchContentDetails(
    allContent.slice(0, 10).map((item) => ({ type: item.type, id: item.id })),
    5
  );

  // Load content from SuperFlixAPI
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch content lists for all categories in parallel
        const [movieIds, serieIds, animeIds] = await Promise.all([
          superflixAPI.getContentList('movie', 'imdb').catch(() => []),
          superflixAPI.getContentList('serie', 'tmdb').catch(() => []),
          superflixAPI.getContentList('anime', 'tmdb').catch(() => []),
        ]);

        // If all requests failed, use mock data
        if (movieIds.length === 0 && serieIds.length === 0 && animeIds.length === 0) {
          console.warn('API requests failed, using mock data');
          // Use mock IDs for demonstration
          movieIds.push(...['tt0111161', 'tt0068646', 'tt0468569', 'tt0071562', 'tt0050083']);
          serieIds.push(...['1396', '1399', '60735', '94605', '82856']);
          animeIds.push(...['1429', '30831', '16498', '11061', '21']);
        }

        // Transform IDs into ContentItem objects
        // Note: In a real implementation, we would fetch details for each item
        // For now, we'll create placeholder items with the IDs
        const movies: ContentItem[] = movieIds.slice(0, 20).map((id) => ({
          id,
          imdbId: id,
          type: 'movie',
          title: `Movie ${id}`,
          posterPath: `https://via.placeholder.com/300x450?text=Movie+${id}`,
          backdropPath: `https://via.placeholder.com/1920x1080?text=Movie+${id}`,
          overview: 'Loading details...',
        }));

        const series: ContentItem[] = serieIds.slice(0, 20).map((id) => ({
          id,
          tmdbId: id,
          type: 'serie',
          title: `Serie ${id}`,
          posterPath: `https://via.placeholder.com/300x450?text=Serie+${id}`,
          backdropPath: `https://via.placeholder.com/1920x1080?text=Serie+${id}`,
          overview: 'Loading details...',
        }));

        const animes: ContentItem[] = animeIds.slice(0, 20).map((id) => ({
          id,
          tmdbId: id,
          type: 'anime',
          title: `Anime ${id}`,
          posterPath: `https://via.placeholder.com/300x450?text=Anime+${id}`,
          backdropPath: `https://via.placeholder.com/1920x1080?text=Anime+${id}`,
          overview: 'Loading details...',
        }));

        // Doramas are typically series, so we'll use a subset of series
        const doramas: ContentItem[] = serieIds.slice(20, 35).map((id) => ({
          id,
          tmdbId: id,
          type: 'dorama',
          title: `Dorama ${id}`,
          posterPath: `https://via.placeholder.com/300x450?text=Dorama+${id}`,
          backdropPath: `https://via.placeholder.com/1920x1080?text=Dorama+${id}`,
          overview: 'Loading details...',
        }));

        const content = [...movies, ...series, ...animes, ...doramas];
        setAllContent(content);
      } catch (err) {
        console.error('Error loading content:', err);
        setError('Erro ao carregar conteúdo. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  // Filter content based on search query and active category
  const filteredContent = useMemo(() => {
    let filtered = allContent;

    // Apply category filter
    if (activeCategory) {
      const categoryTypeMap: Record<string, string> = {
        movies: 'movie',
        series: 'serie',
        animes: 'anime',
        doramas: 'dorama',
      };
      const contentType = categoryTypeMap[activeCategory];
      filtered = filtered.filter((item) => item.type === contentType);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allContent, activeCategory, searchQuery]);

  // Group content by category for carousels
  const contentByCategory = useMemo(() => {
    return {
      movies: allContent.filter((item) => item.type === 'movie'),
      series: allContent.filter((item) => item.type === 'serie'),
      animes: allContent.filter((item) => item.type === 'anime'),
      doramas: allContent.filter((item) => item.type === 'dorama'),
    };
  }, [allContent]);

  // Get featured content for hero section (first movie with backdrop)
  const featuredContent = useMemo(() => {
    return (
      allContent.find((item) => item.backdropPath) ||
      allContent[0] || {
        id: '1',
        type: 'movie' as const,
        title: 'NicãoFlix',
        posterPath: 'https://via.placeholder.com/300x450',
        backdropPath: 'https://via.placeholder.com/1920x1080',
        overview: 'Bem-vindo ao NicãoFlix',
      }
    );
  }, [allContent]);

  const handlePlayClick = () => {
    // Navigate to player page
    window.location.href = `/assistir/${featuredContent.type}/${featuredContent.id}`;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setActiveCategory(categoryId);
  };

  // Show loading state
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </main>
    );
  }

  // Show error state
  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <ErrorMessage message={error} />
      </main>
    );
  }

  // Determine if we should show carousels or grid
  const showCarousels = !searchQuery && !activeCategory;
  const showGrid = searchQuery || activeCategory;

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection
        featuredContent={featuredContent}
        onPlayClick={handlePlayClick}
      />

      {/* Search and Filter Section */}
      <Container className="py-6 space-y-4">
        <SearchBar onSearch={handleSearch} />
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      </Container>

      {/* Content Display */}
      {showCarousels && (
        <div className="space-y-8 pb-12">
          {/* Movies Carousel */}
          {contentByCategory.movies.length > 0 && (
            <ContentCarousel
              title="Filmes"
              items={contentByCategory.movies}
            />
          )}

          {/* Series Carousel */}
          {contentByCategory.series.length > 0 && (
            <ContentCarousel
              title="Séries"
              items={contentByCategory.series}
            />
          )}

          {/* Animes Carousel */}
          {contentByCategory.animes.length > 0 && (
            <ContentCarousel
              title="Animes"
              items={contentByCategory.animes}
            />
          )}

          {/* Doramas Carousel */}
          {contentByCategory.doramas.length > 0 && (
            <ContentCarousel
              title="Doramas"
              items={contentByCategory.doramas}
            />
          )}
        </div>
      )}

      {showGrid && (
        <Container className="py-8">
          {searchQuery && (
            <h2 className="text-2xl font-display font-bold text-text-primary mb-6">
              Resultados para &quot;{searchQuery}&quot;
            </h2>
          )}
          <ContentGrid items={filteredContent} />
        </Container>
      )}
    </main>
  );
}
