'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Container } from '@/components/ui/Container';
import { ContentGrid } from '@/components/content/ContentGrid';
import { SearchBar } from '@/components/ui/SearchBar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { superflixAPI } from '@/lib/api/superflix';
import { ContentItem } from '@/lib/types';

export default function FilmesPage() {
  const [movies, setMovies] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(20);

  // Load movies from SuperFlixAPI
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const movieIds = await superflixAPI.getContentList('movie', 'imdb');

        // Transform IDs into ContentItem objects
        const movieItems: ContentItem[] = movieIds.map((id) => ({
          id,
          imdbId: id,
          type: 'movie',
          title: `Movie ${id}`,
          posterPath: `https://via.placeholder.com/300x450?text=Movie+${id}`,
          backdropPath: `https://via.placeholder.com/1920x1080?text=Movie+${id}`,
          overview: 'Loading details...',
        }));

        setMovies(movieItems);
      } catch (err) {
        console.error('Error loading movies:', err);
        setError('Erro ao carregar filmes. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  // Filter movies based on search query
  const filteredMovies = useMemo(() => {
    if (!searchQuery.trim()) {
      return movies.slice(0, displayCount);
    }

    const query = searchQuery.toLowerCase();
    return movies
      .filter((movie) => movie.title.toLowerCase().includes(query))
      .slice(0, displayCount);
  }, [movies, searchQuery, displayCount]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 500
      ) {
        setDisplayCount((prev) => Math.min(prev + 20, movies.length));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [movies.length]);

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
            Filmes
          </h1>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Buscar filmes..."
          />
        </div>

        <ContentGrid items={filteredMovies} />

        {displayCount < filteredMovies.length && (
          <div className="flex justify-center mt-8">
            <LoadingSpinner size="md" />
          </div>
        )}
      </Container>
    </main>
  );
}
