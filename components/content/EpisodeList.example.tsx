/**
 * Example usage of EpisodeList component
 * This file demonstrates how to use the EpisodeList component in different scenarios
 */

import { EpisodeList } from './EpisodeList';
import { Episode, Season } from '@/lib/types';

// Example 1: Simple episode list without seasons
export function SimpleEpisodeListExample() {
  const episodes: Episode[] = [
    {
      episodeNumber: 1,
      seasonNumber: 1,
      name: 'Pilot',
      overview: 'The beginning of an epic journey',
      airDate: '2024-01-01',
      stillPath: 'https://image.tmdb.org/t/p/w500/episode1.jpg',
      runtime: 45,
    },
    {
      episodeNumber: 2,
      seasonNumber: 1,
      name: 'The Adventure Continues',
      overview: 'Our heroes face their first challenge',
      airDate: '2024-01-08',
      stillPath: 'https://image.tmdb.org/t/p/w500/episode2.jpg',
      runtime: 42,
    },
    {
      episodeNumber: 3,
      seasonNumber: 1,
      name: 'Rising Action',
      overview: 'The plot thickens as secrets are revealed',
      airDate: '2024-01-15',
      runtime: 48,
    },
  ];

  const handleEpisodeSelect = (seasonNumber: number, episodeNumber: number) => {
    console.log(`Selected Season ${seasonNumber}, Episode ${episodeNumber}`);
    // Navigate to player page or update state
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-display font-bold text-text-primary mb-6">
        Episodes
      </h2>
      <EpisodeList
        episodes={episodes}
        currentEpisode={1}
        currentSeason={1}
        onEpisodeSelect={handleEpisodeSelect}
      />
    </div>
  );
}

// Example 2: Multi-season series with navigation
export function MultiSeasonEpisodeListExample() {
  const seasons: Season[] = [
    {
      seasonNumber: 1,
      name: 'Season 1',
      episodeCount: 10,
      airDate: '2024-01-01',
      episodes: [
        {
          episodeNumber: 1,
          seasonNumber: 1,
          name: 'Pilot',
          overview: 'The beginning of an epic journey',
          airDate: '2024-01-01',
          stillPath: 'https://image.tmdb.org/t/p/w500/s1e1.jpg',
          runtime: 45,
        },
        {
          episodeNumber: 2,
          seasonNumber: 1,
          name: 'The Adventure Continues',
          overview: 'Our heroes face their first challenge',
          airDate: '2024-01-08',
          stillPath: 'https://image.tmdb.org/t/p/w500/s1e2.jpg',
          runtime: 42,
        },
      ],
    },
    {
      seasonNumber: 2,
      name: 'Season 2',
      episodeCount: 12,
      airDate: '2024-06-01',
      episodes: [
        {
          episodeNumber: 1,
          seasonNumber: 2,
          name: 'New Beginnings',
          overview: 'Season 2 kicks off with a bang',
          airDate: '2024-06-01',
          stillPath: 'https://image.tmdb.org/t/p/w500/s2e1.jpg',
          runtime: 50,
        },
        {
          episodeNumber: 2,
          seasonNumber: 2,
          name: 'The Plot Thickens',
          overview: 'Mysteries deepen as new characters arrive',
          airDate: '2024-06-08',
          runtime: 48,
        },
      ],
    },
    {
      seasonNumber: 3,
      name: 'Season 3',
      episodeCount: 8,
      airDate: '2025-01-01',
      episodes: [
        {
          episodeNumber: 1,
          seasonNumber: 3,
          name: 'The Final Chapter Begins',
          overview: 'The epic conclusion starts here',
          airDate: '2025-01-01',
          stillPath: 'https://image.tmdb.org/t/p/w500/s3e1.jpg',
          runtime: 55,
        },
      ],
    },
  ];

  const handleEpisodeSelect = (seasonNumber: number, episodeNumber: number) => {
    console.log(`Selected Season ${seasonNumber}, Episode ${episodeNumber}`);
    // Navigate to player: /assistir/serie/tt1234567?season=X&episode=Y
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-display font-bold text-text-primary mb-6">
        All Episodes
      </h2>
      <EpisodeList
        episodes={[]} // Not used when seasons are provided
        seasons={seasons}
        currentEpisode={2}
        currentSeason={2}
        onEpisodeSelect={handleEpisodeSelect}
      />
    </div>
  );
}

// Example 3: Anime series with many episodes
export function AnimeEpisodeListExample() {
  // Generate 24 episodes for a typical anime season
  const episodes: Episode[] = Array.from({ length: 24 }, (_, i) => ({
    episodeNumber: i + 1,
    seasonNumber: 1,
    name: `Episode ${i + 1}`,
    overview: `Episode ${i + 1} of the anime series`,
    airDate: new Date(2024, 0, 1 + i * 7).toISOString().split('T')[0],
    runtime: 24,
  }));

  const handleEpisodeSelect = (seasonNumber: number, episodeNumber: number) => {
    console.log(`Watching Episode ${episodeNumber}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-display font-bold text-text-primary mb-6">
        Anime Episodes
      </h2>
      <EpisodeList
        episodes={episodes}
        currentEpisode={12}
        currentSeason={1}
        onEpisodeSelect={handleEpisodeSelect}
      />
    </div>
  );
}

// Example 4: Integration with details page
export function DetailsPageIntegrationExample() {
  const seriesData = {
    id: 'tt1234567',
    title: 'Amazing Series',
    seasons: [
      {
        seasonNumber: 1,
        name: 'Season 1',
        episodeCount: 8,
        episodes: [
          {
            episodeNumber: 1,
            seasonNumber: 1,
            name: 'Pilot',
            overview: 'The story begins',
            airDate: '2024-01-01',
            stillPath: 'https://image.tmdb.org/t/p/w500/ep1.jpg',
            runtime: 60,
          },
          // ... more episodes
        ],
      },
    ],
  };

  const handleWatchEpisode = (seasonNumber: number, episodeNumber: number) => {
    // Navigate to player page
    window.location.href = `/assistir/serie/${seriesData.id}?season=${seasonNumber}&episode=${episodeNumber}`;
  };

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Series header info would go here */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-text-primary mb-4">
            {seriesData.title}
          </h1>
        </div>

        {/* Episode list section */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text-primary mb-6">
            Episodes
          </h2>
          <EpisodeList
            episodes={[]}
            seasons={seriesData.seasons}
            onEpisodeSelect={handleWatchEpisode}
          />
        </section>
      </div>
    </div>
  );
}
