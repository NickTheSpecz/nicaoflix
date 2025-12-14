'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Container } from '@/components/ui/Container';
import { ContentGrid } from '@/components/content/ContentGrid';
import { SearchBar } from '@/components/ui/SearchBar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { superflixAPI } from '@/lib/api/superflix';
import { ContentItem } from '@/lib/types';

export default function AnimesPage() {
  const [animes, setAnimes] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(20);

  // Load animes from SuperFlixAPI
  useEffect(() => {
    const loadAnimes = async () => {
      try {
        setLoading(true);
        setError(null);

        const animeIds = await superflixAPI.getContentList('anime', 'tmdb');

        // Transform IDs into ContentItem objects
        const animeItems: ContentItem[] = animeIds.map((id) => ({
          id,
          tmdbId: id,
          type: 'anime',
          title: `Anime ${id}`,
          posterPath: `https://via.placeholder.com/300x450?text=Anime+${id}`,
          backdropPath: `https://via.placeholder.com/1920x1080?text=Anime+${id}`,
          overview: 'Loading details...',
        }));

        setAnimes(animeItems);
      } catch (err) {
        console.error('Error loading animes:', err);
        setError('Erro ao carregar animes. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadAnimes();
  }, []);

  // Filter animes based on search query
  const filteredAnimes = useMemo(() => {
    if (!searchQuery.trim()) {
      return animes.slice(0, displayCount);
    }

    const query = searchQuery.toLowerCase();
    return animes
      .filter((anime) => anime.title.toLowerCase().includes(query))
      .slice(0, displayCount);
  }, [animes, searchQuery, displayCount]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 500
      ) {
        setDisplayCount((prev) => Math.min(prev + 20, animes.length));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [animes.length]);

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
            Animes
          </h1>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Buscar animes..."
          />
        </div>

        <ContentGrid items={filteredAnimes} />

        {displayCount < filteredAnimes.length && (
          <div className="flex justify-center mt-8">
            <LoadingSpinner size="md" />
          </div>
        )}
      </Container>
    </main>
  );
}
