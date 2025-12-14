'use client';

import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { superflixAPI } from '@/lib/api/superflix';
import { PlayerCustomization } from '@/lib/types/content';

export interface VideoPlayerProps {
  type: 'movie' | 'serie';
  id: string;
  season?: number;
  episode?: number;
  customization?: PlayerCustomization;
  onClose?: () => void;
}

/**
 * VideoPlayer Component
 * Wrapper for SuperFlixAPI iframe player with customization options
 */
export function VideoPlayer({
  type,
  id,
  season,
  episode,
  customization,
  onClose,
}: VideoPlayerProps) {
  const router = useRouter();

  // Generate player URL using the API service
  const playerURL = superflixAPI.generatePlayerURL(
    type,
    id,
    season,
    episode,
    customization
  );

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  const playerTitle = type === 'movie' ? 'Reprodutor de filme' : 'Reprodutor de episódio';

  return (
    <div className="fixed inset-0 z-50 bg-black" role="dialog" aria-label={playerTitle} aria-modal="true">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
        aria-label="Fechar reprodutor e voltar"
      >
        <X className="w-6 h-6 text-white" aria-hidden="true" />
      </button>

      {/* Responsive iframe container */}
      <div className="w-full h-full">
        <iframe
          src={playerURL}
          className="w-full h-full border-0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title={playerTitle}
        />
      </div>
    </div>
  );
}
