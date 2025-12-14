import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EpisodeList } from './EpisodeList';
import { Episode, Season } from '@/lib/types';

describe('EpisodeList', () => {
  const mockEpisodes: Episode[] = [
    {
      episodeNumber: 1,
      seasonNumber: 1,
      name: 'Pilot',
      overview: 'The first episode of the series',
      airDate: '2024-01-01',
      stillPath: '/episode1.jpg',
      runtime: 45,
    },
    {
      episodeNumber: 2,
      seasonNumber: 1,
      name: 'Second Episode',
      overview: 'The second episode continues the story',
      airDate: '2024-01-08',
      stillPath: '/episode2.jpg',
      runtime: 42,
    },
  ];

  const mockSeasons: Season[] = [
    {
      seasonNumber: 1,
      name: 'Season 1',
      episodeCount: 2,
      episodes: mockEpisodes,
    },
    {
      seasonNumber: 2,
      name: 'Season 2',
      episodeCount: 1,
      episodes: [
        {
          episodeNumber: 1,
          seasonNumber: 2,
          name: 'Season 2 Premiere',
          overview: 'The start of season 2',
          airDate: '2024-06-01',
          runtime: 50,
        },
      ],
    },
  ];

  const mockOnEpisodeSelect = vi.fn();

  it('renders list of episodes', () => {
    render(
      <EpisodeList
        episodes={mockEpisodes}
        onEpisodeSelect={mockOnEpisodeSelect}
      />
    );

    expect(screen.getByText('Pilot')).toBeDefined();
    expect(screen.getByText('Second Episode')).toBeDefined();
  });

  it('displays episode information (name, duration, synopsis)', () => {
    render(
      <EpisodeList
        episodes={mockEpisodes}
        onEpisodeSelect={mockOnEpisodeSelect}
      />
    );

    // Check episode names
    expect(screen.getByText('Pilot')).toBeDefined();
    expect(screen.getByText('Second Episode')).toBeDefined();

    // Check episode overviews
    expect(screen.getByText('The first episode of the series')).toBeDefined();
    expect(screen.getByText('The second episode continues the story')).toBeDefined();

    // Check runtime is displayed (45m and 42m)
    expect(screen.getByText('45m')).toBeDefined();
    expect(screen.getByText('42m')).toBeDefined();
  });

  it('highlights current episode', () => {
    render(
      <EpisodeList
        episodes={mockEpisodes}
        currentEpisode={1}
        currentSeason={1}
        onEpisodeSelect={mockOnEpisodeSelect}
      />
    );

    const episodeButtons = screen.getAllByRole('button');
    const firstEpisodeButton = episodeButtons.find((btn) =>
      btn.textContent?.includes('Pilot')
    );

    // Current episode should have primary color styling
    expect(firstEpisodeButton?.className).toContain('border-primary');
  });

  it('calls onEpisodeSelect when episode is clicked', () => {
    render(
      <EpisodeList
        episodes={mockEpisodes}
        onEpisodeSelect={mockOnEpisodeSelect}
      />
    );

    const episodeButtons = screen.getAllByRole('button');
    const firstEpisodeButton = episodeButtons.find((btn) =>
      btn.textContent?.includes('Pilot')
    );

    if (firstEpisodeButton) {
      fireEvent.click(firstEpisodeButton);
      expect(mockOnEpisodeSelect).toHaveBeenCalledWith(1, 1);
    }
  });

  it('displays season navigation when multiple seasons provided', () => {
    render(
      <EpisodeList
        episodes={mockEpisodes}
        seasons={mockSeasons}
        onEpisodeSelect={mockOnEpisodeSelect}
      />
    );

    expect(screen.getByText('Season 1')).toBeDefined();
    expect(screen.getByText('Season 2')).toBeDefined();
  });

  it('switches episodes when different season is selected', () => {
    render(
      <EpisodeList
        episodes={mockEpisodes}
        seasons={mockSeasons}
        onEpisodeSelect={mockOnEpisodeSelect}
      />
    );

    // Initially shows Season 1 episodes
    expect(screen.getByText('Pilot')).toBeDefined();

    // Click Season 2 button
    const season2Button = screen.getByText('Season 2');
    fireEvent.click(season2Button);

    // Should now show Season 2 episode
    expect(screen.getByText('Season 2 Premiere')).toBeDefined();
  });

  it('formats runtime correctly for hours and minutes', () => {
    const episodeWithLongRuntime: Episode[] = [
      {
        episodeNumber: 1,
        seasonNumber: 1,
        name: 'Long Episode',
        runtime: 125, // 2h 5m
      },
    ];

    render(
      <EpisodeList
        episodes={episodeWithLongRuntime}
        onEpisodeSelect={mockOnEpisodeSelect}
      />
    );

    expect(screen.getByText('2h 5m')).toBeDefined();
  });

  it('handles episodes without thumbnails', () => {
    const episodesWithoutThumbs: Episode[] = [
      {
        episodeNumber: 1,
        seasonNumber: 1,
        name: 'No Thumbnail Episode',
      },
    ];

    render(
      <EpisodeList
        episodes={episodesWithoutThumbs}
        onEpisodeSelect={mockOnEpisodeSelect}
      />
    );

    expect(screen.getByText('No Thumbnail Episode')).toBeDefined();
  });

  it('does not show season navigation for single season', () => {
    const singleSeason: Season[] = [
      {
        seasonNumber: 1,
        name: 'Season 1',
        episodeCount: 2,
        episodes: mockEpisodes,
      },
    ];

    render(
      <EpisodeList
        episodes={mockEpisodes}
        seasons={singleSeason}
        onEpisodeSelect={mockOnEpisodeSelect}
      />
    );

    // Season navigation should not be visible for single season
    const seasonButtons = screen.queryAllByRole('button').filter((btn) =>
      btn.textContent?.includes('Season')
    );
    expect(seasonButtons.length).toBe(0);
  });
});
