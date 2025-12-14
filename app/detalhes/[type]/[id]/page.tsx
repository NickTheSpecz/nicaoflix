import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentDetailsPage } from './ContentDetailsPage';
import { superflixAPI } from '@/lib/api/superflix';
import { ContentType } from '@/lib/types';

interface PageProps {
  params: {
    type: string;
    id: string;
  };
}

// Validate content type
function isValidContentType(type: string): type is ContentType {
  return ['movie', 'serie', 'anime', 'dorama'].includes(type);
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type, id } = params;

  if (!isValidContentType(type)) {
    return {
      title: 'Content Not Found - NicãoFlix',
    };
  }

  try {
    const content = type === 'movie' 
      ? await superflixAPI.getMovieDetails(id)
      : await superflixAPI.getSeriesDetails(id);

    return {
      title: `${content.title} - NicãoFlix`,
      description: content.overview || `Watch ${content.title} on NicãoFlix`,
    };
  } catch (error) {
    return {
      title: 'Content Details - NicãoFlix',
    };
  }
}

export default async function DetailsPage({ params }: PageProps) {
  const { type, id } = params;

  // Validate content type
  if (!isValidContentType(type)) {
    notFound();
  }

  try {
    // Fetch content details based on type
    const content = type === 'movie'
      ? await superflixAPI.getMovieDetails(id)
      : await superflixAPI.getSeriesDetails(id);

    // For series, fetch the first season's episodes if available
    let firstSeasonWithEpisodes = null;
    if (content.type === 'serie' && content.seasons && content.seasons.length > 0) {
      try {
        const firstSeason = content.seasons.find(s => s.seasonNumber > 0) || content.seasons[0];
        firstSeasonWithEpisodes = await superflixAPI.getSeasonDetails(
          id,
          firstSeason.seasonNumber
        );
      } catch (error) {
        console.error('Error fetching first season details:', error);
      }
    }

    return (
      <ContentDetailsPage 
        content={content} 
        initialSeason={firstSeasonWithEpisodes}
      />
    );
  } catch (error) {
    console.error('Error fetching content details:', error);
    notFound();
  }
}
