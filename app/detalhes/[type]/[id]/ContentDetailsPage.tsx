'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ContentDetail, Season } from '@/lib/types';
import { EpisodeList } from '@/components/content/EpisodeList';
import { Button } from '@/components/ui/Button';
import { Play, Star, Calendar, Clock, ArrowLeft } from 'lucide-react';

interface ContentDetailsPageProps {
  content: ContentDetail;
  initialSeason?: Season | null;
}

export const ContentDetailsPage: React.FC<ContentDetailsPageProps> = ({
  content,
  initialSeason,
}) => {
  const router = useRouter();
  const isSeriesType = content.type === 'serie' || content.type === 'anime' || content.type === 'dorama';

  // For series, use the initial season with episodes if available
  const firstSeasonWithEpisodes = initialSeason;

  // Handle episode selection
  const handleEpisodeSelect = (seasonNumber: number, episodeNumber: number) => {
    const id = content.tmdbId || content.id;
    router.push(`/assistir/serie/${id}?season=${seasonNumber}&episode=${episodeNumber}`);
  };

  // Handle watch button click
  const handleWatchClick = () => {
    if (content.type === 'movie') {
      const id = content.imdbId || content.id;
      router.push(`/assistir/movie/${id}`);
    } else if (isSeriesType && firstSeasonWithEpisodes?.episodes && firstSeasonWithEpisodes.episodes.length > 0) {
      // Start with first episode of first season
      const firstEpisode = firstSeasonWithEpisodes.episodes[0];
      handleEpisodeSelect(firstEpisode.seasonNumber, firstEpisode.episodeNumber);
    }
  };

  // Format runtime
  const formatRuntime = (runtime?: number) => {
    if (!runtime) return null;
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Format rating
  const formatRating = (rating?: number) => {
    if (!rating) return null;
    return rating.toFixed(1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Backdrop Section */}
      <div className="relative w-full h-[50vh] md:h-[70vh]">
        {/* Backdrop Image */}
        {content.backdropPath ? (
          <Image
            src={content.backdropPath}
            alt={content.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-surface" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="bg-black/50 hover:bg-black/70 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative -mt-32 md:-mt-48 z-10 px-4 md:px-8 lg:px-16 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              <div className="relative w-48 md:w-64 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
                {content.posterPath ? (
                  <Image
                    src={content.posterPath}
                    alt={content.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 192px, 256px"
                  />
                ) : (
                  <div className="w-full h-full bg-surface flex items-center justify-center">
                    <span className="text-text-muted">No Poster</span>
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="flex-1">
              {/* Title */}
              <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-2">
                {content.title}
              </h1>

              {/* Tagline */}
              {content.tagline && (
                <p className="text-lg text-text-secondary italic mb-4">
                  {content.tagline}
                </p>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-text-secondary">
                {content.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-accent-yellow fill-accent-yellow" />
                    <span className="font-semibold">{formatRating(content.rating)}</span>
                  </div>
                )}

                {content.releaseDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-5 h-5" />
                    <span>{new Date(content.releaseDate).getFullYear()}</span>
                  </div>
                )}

                {content.runtime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-5 h-5" />
                    <span>{formatRuntime(content.runtime)}</span>
                  </div>
                )}

                {content.status && (
                  <span className="px-3 py-1 bg-surface rounded-full text-sm">
                    {content.status}
                  </span>
                )}
              </div>

              {/* Genres */}
              {content.genres && content.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {content.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-surface-light rounded-full text-sm text-text-primary"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {/* Watch Button */}
              <div className="mb-8">
                <Button
                  size="lg"
                  onClick={handleWatchClick}
                  className="gap-2"
                >
                  <Play className="w-5 h-5 fill-current" />
                  {content.type === 'movie' ? 'Assistir Filme' : 'Assistir Agora'}
                </Button>
              </div>

              {/* Overview */}
              {content.overview && (
                <div className="mb-8">
                  <h2 className="font-display text-2xl font-semibold text-text-primary mb-3">
                    Sinopse
                  </h2>
                  <p className="text-text-secondary leading-relaxed">
                    {content.overview}
                  </p>
                </div>
              )}

              {/* Series Info */}
              {isSeriesType && (content.totalSeasons || content.totalEpisodes) && (
                <div className="mb-8">
                  <div className="flex gap-6 text-text-secondary">
                    {content.totalSeasons && (
                      <div>
                        <span className="font-semibold text-text-primary">
                          {content.totalSeasons}
                        </span>{' '}
                        {content.totalSeasons === 1 ? 'Temporada' : 'Temporadas'}
                      </div>
                    )}
                    {content.totalEpisodes && (
                      <div>
                        <span className="font-semibold text-text-primary">
                          {content.totalEpisodes}
                        </span>{' '}
                        {content.totalEpisodes === 1 ? 'Episódio' : 'Episódios'}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Cast */}
              {content.cast && content.cast.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-display text-2xl font-semibold text-text-primary mb-3">
                    Elenco
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {content.cast.slice(0, 6).map((member, index) => (
                      <div key={index} className="text-sm">
                        <p className="font-semibold text-text-primary">{member.name}</p>
                        {member.character && (
                          <p className="text-text-muted">{member.character}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Director */}
              {content.director && (
                <div className="mb-8">
                  <h2 className="font-display text-xl font-semibold text-text-primary mb-2">
                    Diretor
                  </h2>
                  <p className="text-text-secondary">{content.director}</p>
                </div>
              )}
            </div>
          </div>

          {/* Episodes Section for Series */}
          {isSeriesType && firstSeasonWithEpisodes && (
            <div className="mt-12">
              <h2 className="font-display text-3xl font-semibold text-text-primary mb-6">
                Episódios
              </h2>

              <EpisodeList
                episodes={firstSeasonWithEpisodes.episodes || []}
                seasons={content.seasons}
                currentSeason={firstSeasonWithEpisodes.seasonNumber}
                onEpisodeSelect={handleEpisodeSelect}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
