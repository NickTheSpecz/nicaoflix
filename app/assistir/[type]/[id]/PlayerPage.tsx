'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Maximize, Info, X } from 'lucide-react';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { ContentDetail, Season, Episode } from '@/lib/types/content';

interface PlayerPageProps {
  content: ContentDetail;
  season?: number;
  episode?: number;
  currentSeason: Season | null;
  currentEpisode: Episode | null | undefined;
}

export function PlayerPage({
  content,
  season,
  episode,
  currentSeason,
  currentEpisode,
}: PlayerPageProps) {
  const router = useRouter();
  const [showInfo, setShowInfo] = useState(false);
  const [_isFullscreen, setIsFullscreen] = useState(false);

  // Check if there's a previous episode
  const hasPreviousEpisode = useCallback(() => {
    if (!currentSeason || episode === undefined) return false;
    return episode > 1;
  }, [currentSeason, episode]);

  // Check if there's a next episode
  const hasNextEpisode = useCallback(() => {
    if (!currentSeason || episode === undefined) return false;
    return episode < (currentSeason.episodeCount || 0);
  }, [currentSeason, episode]);

  // Navigate to previous episode
  const goToPreviousEpisode = useCallback(() => {
    if (!hasPreviousEpisode() || season === undefined || episode === undefined) return;
    
    const prevEpisode = episode - 1;
    router.push(`/assistir/${content.type}/${content.id}?season=${season}&episode=${prevEpisode}`);
  }, [hasPreviousEpisode, season, episode, content, router]);

  // Navigate to next episode
  const goToNextEpisode = useCallback(() => {
    if (!hasNextEpisode() || season === undefined || episode === undefined) return;
    
    const nextEpisode = episode + 1;
    router.push(`/assistir/${content.type}/${content.id}?season=${season}&episode=${nextEpisode}`);
  }, [hasNextEpisode, season, episode, content, router]);

  // Handle fullscreen toggle
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Arrow left: previous episode
      if (e.key === 'ArrowLeft' && hasPreviousEpisode()) {
        goToPreviousEpisode();
      }
      // Arrow right: next episode
      if (e.key === 'ArrowRight' && hasNextEpisode()) {
        goToNextEpisode();
      }
      // F key: toggle fullscreen
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
      // I key: toggle info
      if (e.key === 'i' || e.key === 'I') {
        setShowInfo((prev) => !prev);
      }
      // Escape: close player
      if (e.key === 'Escape' && !document.fullscreenElement) {
        router.back();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [hasPreviousEpisode, hasNextEpisode, goToPreviousEpisode, goToNextEpisode, toggleFullscreen, router]);

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Video Player */}
      <VideoPlayer
        type={content.type === 'movie' ? 'movie' : 'serie'}
        id={content.id}
        season={season}
        episode={episode}
        customization={{
          hideEpisodeList: false,
          primaryColor: 'e50914',
        }}
        onClose={handleClose}
      />

      {/* Control Bar - Only show for series with episodes */}
      {content.type === 'serie' && season !== undefined && episode !== undefined && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6 z-40">
          <div className="max-w-7xl mx-auto">
            {/* Episode Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousEpisode}
                disabled={!hasPreviousEpisode()}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50 rounded-lg transition-colors duration-200"
                aria-label="Previous episode"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <button
                onClick={() => setShowInfo(!showInfo)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
                aria-label="Toggle info"
              >
                <Info className="w-5 h-5" />
                <span className="hidden sm:inline">Info</span>
              </button>

              <button
                onClick={toggleFullscreen}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
                aria-label="Toggle fullscreen"
              >
                <Maximize className="w-5 h-5" />
                <span className="hidden sm:inline">Fullscreen</span>
              </button>

              <button
                onClick={goToNextEpisode}
                disabled={!hasNextEpisode()}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50 rounded-lg transition-colors duration-200"
                aria-label="Next episode"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Current Episode Info */}
            {currentEpisode && (
              <div className="text-center">
                <h2 className="text-lg font-semibold text-white mb-1">
                  S{season}E{episode}: {currentEpisode.name}
                </h2>
                <p className="text-sm text-gray-300">
                  {content.title}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen button for movies */}
      {content.type === 'movie' && (
        <button
          onClick={toggleFullscreen}
          className="absolute bottom-6 right-6 z-40 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Toggle fullscreen"
        >
          <Maximize className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Info Panel */}
      {showInfo && (
        <div className="absolute top-20 right-6 w-80 max-w-[90vw] bg-black/95 backdrop-blur-sm rounded-lg p-6 z-50 shadow-2xl">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-white">{content.title}</h3>
            <button
              onClick={() => setShowInfo(false)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              aria-label="Close info"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {currentEpisode && (
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-white mb-2">
                S{season}E{episode}: {currentEpisode.name}
              </h4>
              {currentEpisode.overview && (
                <p className="text-sm text-gray-300 leading-relaxed">
                  {currentEpisode.overview}
                </p>
              )}
              {currentEpisode.runtime && (
                <p className="text-sm text-gray-400 mt-2">
                  Runtime: {currentEpisode.runtime} min
                </p>
              )}
            </div>
          )}

          {content.type === 'movie' && content.overview && (
            <div className="mb-4">
              <p className="text-sm text-gray-300 leading-relaxed">
                {content.overview}
              </p>
              {content.runtime && (
                <p className="text-sm text-gray-400 mt-2">
                  Runtime: {content.runtime} min
                </p>
              )}
            </div>
          )}

          {content.genres && content.genres.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-1">Genres</p>
              <div className="flex flex-wrap gap-2">
                {content.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-2 py-1 bg-white/10 rounded text-xs text-white"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {content.rating && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Rating</p>
              <p className="text-sm text-white">
                ⭐ {content.rating.toFixed(1)}/10
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
