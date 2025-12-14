'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Container } from '@/components/ui/Container';
import { ContentGrid } from '@/components/content/ContentGrid';
import { SearchBar } from '@/components/ui/SearchBar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { superflixAPI } from '@/lib/api/superflix';
import { ContentItem } from '@/lib/types';

export default function SeriesPage() {
  const [series, setSeries] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(20);

  // Load series from SuperFlixAPI
  useEffect(() => {
    const loadSeries = async () => {
      try {
        setLoading(true);
        setError(null);

        const serieIds = await superflixAPI.getContentList('serie', 'tmdb');

        // Transform IDs into ContentItem objects
        const serieItems: ContentItem[] = serieIds.map((id) => ({
          id,
          tmdbId: id,
          type: 'serie',
          title: `Serie ${id}`,
          posterPath: `https://via.placeholder.com/300x450?text=Serie+${id}`,
          backdropPath: `https://via.placeholder.com/1920x1080?text=Serie+${id}`,
          overview: 'Loading details...',
        }));

        setSeries(serieItems);
      } catch (err) {
        console.error('Error loading series:', err);
        setError('Erro ao carregar séries. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadSeries();
  }, []);

  // Filter series based on search query
  const filteredSeries = useMemo(() => {
    if (!searchQuery.trim()) {
      return series.slice(0, displayCount);
    }

    const query = searchQuery.toLowerCase();
    return series
      .filter((serie) => serie.title.toLowerCase().includes(query))
      .slice(0, displayCount);
  }, [series, searchQuery, displayCount]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 500
      ) {
        setDisplayCount((prev) => Math.min(prev + 20, series.length));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [series.length]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setDisplayCount(20); // Reset display count on new search
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <ErrorMessage message={error} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Container className="py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-text-primary mb-6">
            Séries
          </h1>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Buscar séries..."
          />
        </div>

        <ContentGrid items={filteredSeries} />

        {displayCount < filteredSeries.length && (
          <div className="flex justify-center mt-8">
            <LoadingSpinner size="md" />
          </div>
        )}
      </Container>
    </main>
  );
}
