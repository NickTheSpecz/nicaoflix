import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeroSection } from './HeroSection';
import { ContentItem } from '@/lib/types';

describe('HeroSection', () => {
  const mockContent: ContentItem = {
    id: '123',
    type: 'movie',
    title: 'Test Movie',
    posterPath: '/test-poster.jpg',
    backdropPath: '/test-backdrop.jpg',
    overview: 'This is a test movie overview that describes the content.',
    releaseDate: '2024-01-15',
    rating: 8.5,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
  };

  const mockOnPlayClick = vi.fn();

  it('renders the hero section with featured content', () => {
    render(
      <HeroSection featuredContent={mockContent} onPlayClick={mockOnPlayClick} />
    );

    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText(/This is a test movie overview/)).toBeInTheDocument();
  });

  it('displays the release year', () => {
    render(
      <HeroSection featuredContent={mockContent} onPlayClick={mockOnPlayClick} />
    );

    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('displays the rating', () => {
    render(
      <HeroSection featuredContent={mockContent} onPlayClick={mockOnPlayClick} />
    );

    expect(screen.getByText('8.5')).toBeInTheDocument();
  });

  it('displays genres on desktop', () => {
    render(
      <HeroSection featuredContent={mockContent} onPlayClick={mockOnPlayClick} />
    );

    const genresText = screen.getByText(/Action • Adventure • Sci-Fi/);
    expect(genresText).toBeInTheDocument();
  });

  it('calls onPlayClick when play button is clicked', () => {
    render(
      <HeroSection featuredContent={mockContent} onPlayClick={mockOnPlayClick} />
    );

    const playButton = screen.getByRole('button', { name: /Assistir/i });
    fireEvent.click(playButton);

    expect(mockOnPlayClick).toHaveBeenCalledTimes(1);
  });

  it('renders play button with correct text', () => {
    render(
      <HeroSection featuredContent={mockContent} onPlayClick={mockOnPlayClick} />
    );

    expect(screen.getByRole('button', { name: /Assistir/i })).toBeInTheDocument();
  });

  it('renders info button', () => {
    render(
      <HeroSection featuredContent={mockContent} onPlayClick={mockOnPlayClick} />
    );

    const infoButtons = screen.getAllByRole('button', { name: /Info/i });
    expect(infoButtons.length).toBeGreaterThan(0);
  });

  it('handles content without backdrop by using poster', () => {
    const contentWithoutBackdrop: ContentItem = {
      ...mockContent,
      backdropPath: undefined,
    };

    render(
      <HeroSection
        featuredContent={contentWithoutBackdrop}
        onPlayClick={mockOnPlayClick}
      />
    );

    expect(screen.getByText('Test Movie')).toBeInTheDocument();
  });

  it('handles content without overview', () => {
    const contentWithoutOverview: ContentItem = {
      ...mockContent,
      overview: undefined,
    };

    render(
      <HeroSection
        featuredContent={contentWithoutOverview}
        onPlayClick={mockOnPlayClick}
      />
    );

    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.queryByText(/This is a test movie overview/)).not.toBeInTheDocument();
  });

  it('handles content without rating', () => {
    const contentWithoutRating: ContentItem = {
      ...mockContent,
      rating: undefined,
    };

    render(
      <HeroSection
        featuredContent={contentWithoutRating}
        onPlayClick={mockOnPlayClick}
      />
    );

    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.queryByText('8.5')).not.toBeInTheDocument();
  });

  it('handles content without genres', () => {
    const contentWithoutGenres: ContentItem = {
      ...mockContent,
      genres: undefined,
    };

    render(
      <HeroSection
        featuredContent={contentWithoutGenres}
        onPlayClick={mockOnPlayClick}
      />
    );

    expect(screen.getByText('Test Movie')).toBeInTheDocument();
  });
});
