/**
 * Example usage of HeroSection component
 * 
 * This file demonstrates how to use the HeroSection component
 * in different scenarios.
 */

import { HeroSection } from './HeroSection';
import { ContentItem } from '@/lib/types';

// Example 1: Basic usage with a movie
export function BasicHeroExample() {
  const featuredMovie: ContentItem = {
    id: 'tt1234567',
    imdbId: 'tt1234567',
    type: 'movie',
    title: 'The Amazing Adventure',
    posterPath: 'https://image.tmdb.org/t/p/w500/poster.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/backdrop.jpg',
    overview:
      'An epic journey through time and space where heroes must save the world from an ancient evil that threatens to destroy everything they hold dear.',
    releaseDate: '2024-06-15',
    rating: 8.7,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
  };

  const handlePlayClick = () => {
    console.log('Play button clicked');
    // Navigate to player page
    window.location.href = `/assistir/movie/${featuredMovie.id}`;
  };

  return <HeroSection featuredContent={featuredMovie} onPlayClick={handlePlayClick} />;
}

// Example 2: Series with minimal data
export function MinimalHeroExample() {
  const featuredSeries: ContentItem = {
    id: '12345',
    tmdbId: '12345',
    type: 'serie',
    title: 'Mystery Chronicles',
    posterPath: 'https://image.tmdb.org/t/p/w500/series-poster.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/series-backdrop.jpg',
  };

  const handlePlayClick = () => {
    // Navigate to series details to select episode
    window.location.href = `/detalhes/serie/${featuredSeries.id}`;
  };

  return <HeroSection featuredContent={featuredSeries} onPlayClick={handlePlayClick} />;
}

// Example 3: Anime with full metadata
export function AnimeHeroExample() {
  const featuredAnime: ContentItem = {
    id: '98765',
    tmdbId: '98765',
    type: 'anime',
    title: 'Dragon Warriors: The Final Battle',
    originalTitle: 'ドラゴンウォリアーズ',
    posterPath: 'https://image.tmdb.org/t/p/w500/anime-poster.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/anime-backdrop.jpg',
    overview:
      'In a world where dragons and humans coexist, a young warrior must master ancient techniques to protect his village from dark forces.',
    releaseDate: '2024-03-20',
    rating: 9.2,
    genres: ['Anime', 'Action', 'Fantasy', 'Adventure'],
  };

  const handlePlayClick = () => {
    window.location.href = `/assistir/anime/${featuredAnime.id}`;
  };

  return <HeroSection featuredContent={featuredAnime} onPlayClick={handlePlayClick} />;
}

// Example 4: Kids content
export function KidsHeroExample() {
  const featuredKidsContent: ContentItem = {
    id: 'kids123',
    tmdbId: 'kids123',
    type: 'movie',
    title: 'The Magical Forest Adventure',
    posterPath: 'https://image.tmdb.org/t/p/w500/kids-poster.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/kids-backdrop.jpg',
    overview:
      'Join our friendly animal friends on a colorful journey through the magical forest where they learn about friendship and teamwork!',
    releaseDate: '2024-01-10',
    rating: 7.8,
    genres: ['Animation', 'Family', 'Adventure'],
    isKidsFriendly: true,
  };

  const handlePlayClick = () => {
    window.location.href = `/assistir/movie/${featuredKidsContent.id}`;
  };

  return <HeroSection featuredContent={featuredKidsContent} onPlayClick={handlePlayClick} />;
}

// Example 5: Integration in a page
export function HeroInPageExample() {
  const featuredContent: ContentItem = {
    id: 'featured001',
    type: 'dorama',
    title: 'Love in Seoul',
    posterPath: 'https://image.tmdb.org/t/p/w500/dorama-poster.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/dorama-backdrop.jpg',
    overview:
      'A heartwarming story of two people who find love in the bustling streets of Seoul.',
    releaseDate: '2024-02-14',
    rating: 8.9,
    genres: ['Romance', 'Drama', 'K-Drama'],
  };

  const handlePlayClick = () => {
    window.location.href = `/assistir/dorama/${featuredContent.id}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection featuredContent={featuredContent} onPlayClick={handlePlayClick} />
      
      {/* Other page content would go here */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-display font-bold mb-4">Continue Assistindo</h2>
        {/* Content grid would go here */}
      </div>
    </div>
  );
}
