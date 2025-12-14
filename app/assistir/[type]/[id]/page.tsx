import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PlayerPage } from './PlayerPage';
import { superflixAPI } from '@/lib/api/superflix';
import { ContentType } from '@/lib/types';

interface PageProps {
  params: {
    type: string;
    id: string;
  };
  searchParams: {
    season?: string;
    episode?: string;
  };
}

// Validate content type
function isValidContentType(type: string): type is ContentType {
  return ['movie', 'serie', 'anime', 'dorama'].includes(type);
}

// Generate metadata for SEO
export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { type, id } = params;
  const { season, episode } = searchParams;

  if (!isValidContentType(type)) {
    return {
      title: 'Player - NicãoFlix',
    };
  }

  try {
    const content = type === 'movie' 
      ? await superflixAPI.getMovieDetails(id)
      : await superflixAPI.getSeriesDetails(id);

    let title = `${content.title} - NicãoFlix`;
    
    if (season && episode) {
      title = `${content.title} - S${season}E${episode} - NicãoFlix`;
    }

    return {
      title,
      description: `Watch ${content.title} on NicãoFlix`,
    };
  } catch (error) {
    return {
      title: 'Watch - NicãoFlix',
    };
  }
}

export default async function WatchPage({ params, searchParams }: PageProps) {
  const { type, id } = params;
  const { season: seasonParam, episode: episodeParam } = searchParams;

  // Validate content type
  if (!isValidContentType(type)) {
    notFound();
  }

  // Parse season and episode numbers
  const season = seasonParam ? parseInt(seasonParam, 10) : undefined;
  const episode = episodeParam ? parseInt(episodeParam, 10) : undefined;

  // For series, season and episode are required
  if (type === 'serie' && (season === undefined || episode === undefined)) {
    notFound();
  }

  try {
    // Fetch content details
    const content = type === 'movie'
      ? await superflixAPI.getMovieDetails(id)
      : await superflixAPI.getSeriesDetails(id);

    // For series, fetch the current season details to get episode information
    let currentSeason = null;
    let currentEpisode = null;
    
    if (content.type === 'serie' && season !== undefined) {
      try {
        currentSeason = await superflixAPI.getSeasonDetails(id, season);
        currentEpisode = currentSeason.episodes?.find(
          (ep) => ep.episodeNumber === episode
        );
      } catch (error) {
        console.error('Error fetching season/episode details:', error);
      }
    }

    return (
      <PlayerPage
        content={content}
        season={season}
        episode={episode}
        currentSeason={currentSeason}
        currentEpisode={currentEpisode}
      />
    );
  } catch (_error) {
    console.error('Error fetching content for player:', _error);
    notFound();
  }
}
