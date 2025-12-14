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
        let movieIds = await superflixAPI.getContentList('movie', 'imdb').catch(() => [] as string[]);
        let serieIds = await superflixAPI.getContentList('serie', 'tmdb').catch(() => [] as string[]);
        let animeIds = await superflixAPI.getContentList('anime', 'tmdb').catch(() => [] as string[]);

        // If all requests failed, use mock data
        if (movieIds.length === 0 && serieIds.length === 0 && animeIds.length === 0) {
          console.warn('API requests failed, using mock data');
          // Use mock IDs for demonstration
          movieIds = ['tt0111161', 'tt0068646', 'tt0468569', 'tt0071562', 'tt0050083'];
          serieIds = ['1396', '1399', '60735', '94605', '82856'];
          animeIds = ['1429', '30831', '16498', '11061', '21'];
        }

        // Fetch actual details for a subset of content
        // We'll fetch details for the first few items to show real data
        const fetchMovieDetails = async (imdbId: string): Promise<ContentItem> => {
          try {
            const details = await superflixAPI.getMovieDetails(imdbId);
            return details;
          } catch {
            return {
              id: imdbId,
              imdbId,
              type: 'movie',
              title: `Movie ${imdbId}`,
              posterPath: `https://image.tmdb.org/t/p/w500/placeholder.jpg`,
              overview: 'Details unavailable',
            };
          }
        };

        const fetchSeriesDetails = async (tmdbId: string, type: 'serie' | 'anime' | 'dorama'): Promise<ContentItem> => {
          try {
            const details = await superflixAPI.getSeriesDetails(tmdbId);
            return { ...details, type };
          } catch {
            return {
              id: tmdbId,
              tmdbId,
              type,
              title: `${type} ${tmdbId}`,
              posterPath: `https://image.tmdb.org/t/p/w500/placeholder.jpg`,
              overview: 'Details unavailable',
            };
          }
        };

        // Fetch details for first 10 items of each category
        const movieDetailsPromises = movieIds.slice(0, 10).map(fetchMovieDetails);
        const seriesDetailsPromises = serieIds.slice(0, 10).map(id => fetchSeriesDetails(id, 'serie'));
        const animeDetailsPromises = animeIds.slice(0, 10).map(id => fetchSeriesDetails(id, 'anime'));
        const doramaDetailsPromises = serieIds.slice(10, 15).map(id => fetchSeriesDetails(id, 'dorama'));

        const [movies, series, animes, doramas] = await Promise.all([
          Promise.all(movieDetailsPromises),
          Promise.all(seriesDetailsPromises),
          Promise.all(animeDetailsPromises),
          Promise.all(doramaDetailsPromises),
        ]);

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
