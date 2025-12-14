'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Episode, Season } from '@/lib/types';
import { Play, Clock } from 'lucide-react';

export interface EpisodeListProps {
  episodes: Episode[];
  seasons?: Season[];
  currentEpisode?: number;
  currentSeason?: number;
  onEpisodeSelect: (seasonNumber: number, episodeNumber: number) => void;
}

export const EpisodeList: React.FC<EpisodeListProps> = ({
  episodes,
  seasons,
  currentEpisode,
  currentSeason,
  onEpisodeSelect,
}) => {
  const [selectedSeason, setSelectedSeason] = useState(currentSeason || 1);

  // Get episodes for the selected season
  const displayedEpisodes = seasons
    ? seasons.find((s) => s.seasonNumber === selectedSeason)?.episodes || episodes
    : episodes;

  const handleSeasonChange = (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
  };

  const formatRuntime = (runtime?: number) => {
    if (!runtime) return null;
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="w-full">
      {/* Season Navigation */}
      {seasons && seasons.length > 1 && (
        <div className="mb-6" role="navigation" aria-label="Navegação de temporadas">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-surface-light scrollbar-track-transparent">
            {seasons.map((season) => (
              <button
                key={season.seasonNumber}
                onClick={() => handleSeasonChange(season.seasonNumber)}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap
                  transition-all duration-base
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
                  ${
                    selectedSeason === season.seasonNumber
                      ? 'bg-primary text-text-primary shadow-lg'
                      : 'bg-surface text-text-secondary hover:bg-surface-light hover:text-text-primary'
                  }
                `}
                aria-pressed={selectedSeason === season.seasonNumber}
                aria-label={`${season.name}${selectedSeason === season.seasonNumber ? ', selecionada' : ''}`}
              >
                {season.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Episodes List */}
      <div 
        className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-surface-light scrollbar-track-transparent"
        role="list"
        aria-label="Lista de episódios"
      >
        {displayedEpisodes.map((episode) => {
          const isCurrentEpisode =
            episode.episodeNumber === currentEpisode &&
            episode.seasonNumber === selectedSeason;

          const episodeLabel = [
            `Episódio ${episode.episodeNumber}`,
            episode.name,
            episode.runtime && formatRuntime(episode.runtime),
            isCurrentEpisode && 'Episódio atual',
          ]
            .filter(Boolean)
            .join(', ');

          return (
            <button
              key={`${episode.seasonNumber}-${episode.episodeNumber}`}
              onClick={() =>
                onEpisodeSelect(episode.seasonNumber, episode.episodeNumber)
              }
              className={`
                w-full flex gap-4 p-3 rounded-lg text-left
                transition-all duration-base
                ${
                  isCurrentEpisode
                    ? 'bg-primary/20 border-2 border-primary'
                    : 'bg-surface hover:bg-surface-light border-2 border-transparent'
                }
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
              `}
              role="listitem"
              aria-label={episodeLabel}
              aria-current={isCurrentEpisode ? 'true' : undefined}
            >
              {/* Episode Thumbnail */}
              <div className="relative flex-shrink-0 w-32 sm:w-40 aspect-video rounded overflow-hidden bg-surface-light">
                {episode.stillPath ? (
                  <Image
                    src={episode.stillPath}
                    alt={`Miniatura do episódio ${episode.episodeNumber}: ${episode.name}`}
                    fill
                    sizes="(max-width: 640px) 128px, 160px"
                    className="object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
                    <Play className="w-8 h-8 text-text-muted" />
                  </div>
                )}

                {/* Episode Number Overlay */}
                <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded text-xs font-semibold" aria-hidden="true">
                  {episode.episodeNumber}
                </div>

                {/* Current Episode Indicator */}
                {isCurrentEpisode && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50" aria-hidden="true">
                    <Play className="w-10 h-10 text-primary fill-primary" />
                  </div>
                )}
              </div>

              {/* Episode Info */}
              <div className="flex-1 min-w-0">
                <h4
                  className={`
                  font-display font-semibold text-sm sm:text-base mb-1 line-clamp-1
                  ${isCurrentEpisode ? 'text-primary' : 'text-text-primary'}
                `}
                >
                  {episode.name}
                </h4>

                {/* Episode Metadata */}
                <div className="flex items-center gap-3 mb-2 text-xs text-text-secondary">
                  {episode.runtime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      <span>{formatRuntime(episode.runtime)}</span>
                    </div>
                  )}
                  {episode.airDate && (
                    <span>{new Date(episode.airDate).getFullYear()}</span>
                  )}
                </div>

                {/* Episode Overview */}
                {episode.overview && (
                  <p className="text-xs sm:text-sm text-text-secondary line-clamp-2 sm:line-clamp-3">
                    {episode.overview}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
