'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Container } from '@/components/ui/Container';
import { ContentGrid } from '@/components/content/ContentGrid';
import { SearchBar } from '@/components/ui/SearchBar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { superflixAPI } from '@/lib/api/superflix';
import { ContentItem } from '@/lib/types';
import { Sparkles, Star, Heart, Smile } from 'lucide-react';

export default function KidsPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(20);

  // Load kids content from all categories
  useEffect(() => {
    const loadKidsContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch content from all categories
        const [movieIds, serieIds, animeIds] = await Promise.all([
          superflixAPI.getContentList('movie', 'imdb'),
          superflixAPI.getContentList('serie', 'tmdb'),
          superflixAPI.getContentList('anime', 'tmdb'),
        ]);

        // Transform IDs into ContentItem objects with isKidsFriendly flag
        const allContent: ContentItem[] = [
          ...movieIds.map((id) => ({
            id,
            imdbId: id,
            type: 'movie' as const,
            title: `Movie ${id}`,
            posterPath: `https://via.placeholder.com/300x450?text=Movie+${id}`,
            backdropPath: `https://via.placeholder.com/1920x1080?text=Movie+${id}`,
            overview: 'Loading details...',
            // For demo purposes, mark some content as kids-friendly
            isKidsFriendly: Math.random() > 0.5,
          })),
          ...serieIds.map((id) => ({
            id,
            tmdbId: id,
            type: 'serie' as const,
            title: `Serie ${id}`,
            posterPath: `https://via.placeholder.com/300x450?text=Serie+${id}`,
            backdropPath: `https://via.placeholder.com/1920x1080?text=Serie+${id}`,
            overview: 'Loading details...',
            isKidsFriendly: Math.random() > 0.5,
          })),
          ...animeIds.map((id) => ({
            id,
            tmdbId: id,
            type: 'anime' as const,
            title: `Anime ${id}`,
            posterPath: `https://via.placeholder.com/300x450?text=Anime+${id}`,
            backdropPath: `https://via.placeholder.com/1920x1080?text=Anime+${id}`,
            overview: 'Loading details...',
            isKidsFriendly: Math.random() > 0.5,
          })),
        ];

        // Filter to only kids-friendly content
        const kidsContent = allContent.filter((item) => item.isKidsFriendly);
        setContent(kidsContent);
      } catch (err) {
        console.error('Error loading kids content:', err);
        setError('Erro ao carregar conteúdo infantil. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadKidsContent();
  }, []);

  // Filter content based on search query
  const filteredContent = useMemo(() => {
    if (!searchQuery.trim()) {
      return content.slice(0, displayCount);
    }

    const query = searchQuery.toLowerCase();
    return content
      .filter((item) => item.title.toLowerCase().includes(query))
      .slice(0, displayCount);
  }, [content, searchQuery, displayCount]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 500
      ) {
        setDisplayCount((prev) => Math.min(prev + 20, content.length));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [content.length]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setDisplayCount(20);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-2xl font-display font-bold text-white">
            Carregando diversão...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300">
        <ErrorMessage message={error} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300">
      {/* Decorative floating icons */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <Star
          className="absolute top-20 left-10 text-yellow-300 opacity-60 animate-pulse"
          size={32}
        />
        <Heart
          className="absolute top-40 right-20 text-pink-400 opacity-60 animate-pulse"
          size={28}
          style={{ animationDelay: '0.5s' }}
        />
        <Sparkles
          className="absolute bottom-40 left-20 text-blue-300 opacity-60 animate-pulse"
          size={36}
          style={{ animationDelay: '1s' }}
        />
        <Smile
          className="absolute bottom-20 right-40 text-yellow-400 opacity-60 animate-pulse"
          size={30}
          style={{ animationDelay: '1.5s' }}
        />
      </div>

      <Container className="py-8 relative z-10">
        {/* Header with playful design */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="text-yellow-300" size={40} />
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white drop-shadow-lg">
              Kids
            </h1>
            <Sparkles className="text-pink-300" size={40} />
          </div>
          <p className="text-xl md:text-2xl font-display text-white drop-shadow-md mb-6">
            Conteúdo seguro e divertido para crianças! 🎉
          </p>

          {/* Search bar with colorful styling */}
          <div className="max-w-2xl mx-auto">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Buscar desenhos e filmes..."
            />
          </div>
        </div>

        {/* Content count badge */}
        {filteredContent.length > 0 && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              <Star className="text-yellow-500" size={20} />
              <span className="font-display font-semibold text-purple-600">
                {filteredContent.length} {filteredContent.length === 1 ? 'título' : 'títulos'} disponíveis
              </span>
              <Star className="text-yellow-500" size={20} />
            </div>
          </div>
        )}

        {/* Content grid with white background for better visibility */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl">
          {filteredContent.length === 0 ? (
            <div className="text-center py-16">
              <Smile className="mx-auto text-purple-400 mb-4" size={64} />
              <p className="text-2xl font-display font-semibold text-purple-600">
                Nenhum conteúdo encontrado
              </p>
              <p className="text-lg text-purple-500 mt-2">
                Tente buscar por outro título!
              </p>
            </div>
          ) : (
            <ContentGrid items={filteredContent} />
          )}
        </div>

        {displayCount < filteredContent.length && (
          <div className="flex justify-center mt-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
              <LoadingSpinner size="md" />
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
