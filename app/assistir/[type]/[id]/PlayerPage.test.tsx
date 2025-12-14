import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlayerPage } from './PlayerPage';
import { ContentDetail, Season, Episode } from '@/lib/types/content';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

describe('PlayerPage', () => {
  const mockMovieContent: ContentDetail = {
    id: 'tt1234567',
    imdbId: 'tt1234567',
    type: 'movie',
    title: 'Test Movie',
    posterPath: '/test-poster.jpg',
    backdropPath: '/test-backdrop.jpg',
    overview: 'A test movie',
    rating: 8.5,
    genres: ['Action', 'Adventure'],
  };

  const mockSeriesContent: ContentDetail = {
    id: '12345',
    tmdbId: '12345',
    type: 'serie',
    title: 'Test Series',
    posterPath: '/test-poster.jpg',
    backdropPath: '/test-backdrop.jpg',
    overview: 'A test series',
    rating: 9.0,
    genres: ['Drama'],
    totalSeasons: 2,
    totalEpisodes: 20,
  };

  const mockSeason: Season = {
    seasonNumber: 1,
    name: 'Season 1',
    episodeCount: 10,
    episodes: [
      {
        episodeNumber: 1,
        seasonNumber: 1,
        name: 'Pilot',
        overview: 'The first episode',
      },
      {
        episodeNumber: 2,
        seasonNumber: 1,
        name: 'Episode 2',
        overview: 'The second episode',
      },
    ],
  };

  const mockEpisode: Episode = {
    episodeNumber: 1,
    seasonNumber: 1,
    name: 'Pilot',
    overview: 'The first episode',
    runtime: 45,
  };

  it('renders movie player correctly', () => {
    render(
      <PlayerPage
        content={mockMovieContent}
        currentSeason={null}
        currentEpisode={null}
      />
    );

    // Check that the player container is rendered
    expect(screen.getByLabelText('Close player')).toBeInTheDocument();
  });

  it('renders series player with episode navigation', () => {
    render(
      <PlayerPage
        content={mockSeriesContent}
        season={1}
        episode={1}
        currentSeason={mockSeason}
        currentEpisode={mockEpisode}
      />
    );

    // Check that episode info is displayed
    expect(screen.getByText(/S1E1: Pilot/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Series/i)).toBeInTheDocument();

    // Check that navigation buttons are present
    expect(screen.getByLabelText('Previous episode')).toBeInTheDocument();
    expect(screen.getByLabelText('Next episode')).toBeInTheDocument();
  });

  it('disables previous button on first episode', () => {
    render(
      <PlayerPage
        content={mockSeriesContent}
        season={1}
        episode={1}
        currentSeason={mockSeason}
        currentEpisode={mockEpisode}
      />
    );

    const prevButton = screen.getByLabelText('Previous episode');
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last episode', () => {
    const lastEpisode: Episode = {
      episodeNumber: 10,
      seasonNumber: 1,
      name: 'Finale',
      overview: 'The last episode',
    };

    render(
      <PlayerPage
        content={mockSeriesContent}
        season={1}
        episode={10}
        currentSeason={mockSeason}
        currentEpisode={lastEpisode}
      />
    );

    const nextButton = screen.getByLabelText('Next episode');
    expect(nextButton).toBeDisabled();
  });

  it('shows fullscreen button for movies', () => {
    render(
      <PlayerPage
        content={mockMovieContent}
        currentSeason={null}
        currentEpisode={null}
      />
    );

    expect(screen.getByLabelText('Toggle fullscreen')).toBeInTheDocument();
  });
});
