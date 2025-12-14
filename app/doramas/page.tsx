'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Container } from '@/components/ui/Container';
import { ContentGrid } from '@/components/content/ContentGrid';
import { SearchBar } from '@/components/ui/SearchBar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { superflixAPI } from '@/lib/api/superflix';
import { ContentItem } from '@/lib/types';

export default function DoramasPage() {
  const [doramas, setDoramas] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(20);

  // Load doramas from SuperFlixAPI
  // Note: Doramas are typically series, so we use the serie endpoint
  useEffect(() => {
    const loadDoramas = async () => {
      try {
        setLoading(true);
        setError(null);

        // Doramas are series, so we fetch from serie endpoint
        const serieIds = await superflixAPI.getContentList('serie', 'tmdb');

        // Transform IDs into ContentItem objects with dorama type
        // In a real implementation, we would filter for actual doramas
        const doramaItems: ContentItem[] = serieIds.slice(0, 50).map((id) => ({
          id,
          tmdbId: id,
          type: 'dorama',
          title: `Dorama ${id}`,
          posterPath: `https://via.placeholder.com/300x450?text=Dorama+${id}`,
          backdropPath: `https://via.placeholder.com/1920x1080?text=Dorama+${id}`,
          overview: 'Loading details...',
        }));

        setDoramas(doramaItems);
      } catch (err) {
        console.error('Error loading doramas:', err);
        setError('Erro ao carregar doramas. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadDoramas();
  }, []);

  // Filter doramas based on search query
  const filteredDoramas = useMemo(() => {
    if (!searchQuery.trim()) {
      return doramas.slice(0, displayCount);
    }

    const query = searchQuery.toLowerCase();
    return doramas
      .filter((dorama) => dorama.title.toLowerCase().includes(query))
      .slice(0, displayCount);
  }, [doramas, searchQuery, displayCount]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 500
      ) {
        setDisplayCount((prev) => Math.min(prev + 20, doramas.length));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [doramas.length]);

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
            Doramas
          </h1>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Buscar doramas..."
          />
        </div>

        <ContentGrid items={filteredDoramas} />

        {displayCount < filteredDoramas.length && (
          <div className="flex justify-center mt-8">
            <LoadingSpinner size="md" />
          </div>
        )}
      </Container>
    </main>
  );
}
