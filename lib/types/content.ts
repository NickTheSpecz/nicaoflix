/**
 * Type definitions for NicãoFlix content models
 */

export type ContentType = 'movie' | 'serie' | 'anime' | 'dorama';

export interface ContentItem {
  id: string;
  tmdbId?: string;
  imdbId?: string;
  type: ContentType;
  title: string;
  originalTitle?: string;
  posterPath: string;
  backdropPath?: string;
  overview?: string;
  releaseDate?: string;
  rating?: number;
  genres?: string[];
  isKidsFriendly?: boolean;
}

export interface CastMember {
  name: string;
  character?: string;
  profilePath?: string;
}

export interface Episode {
  episodeNumber: number;
  seasonNumber: number;
  name: string;
  overview?: string;
  airDate?: string;
  stillPath?: string;
  runtime?: number;
}

export interface Season {
  seasonNumber: number;
  name: string;
  episodeCount: number;
  airDate?: string;
  posterPath?: string;
  episodes?: Episode[];
}

export interface ContentDetail extends ContentItem {
  runtime?: number;
  status?: string;
  tagline?: string;
  cast?: CastMember[];
  director?: string;
  seasons?: Season[];
  totalSeasons?: number;
  totalEpisodes?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface PlayerCustomization {
  hideEpisodeList?: boolean;
  primaryColor?: string;
  hideLink?: boolean;
  transparent?: boolean;
  hideBackground?: boolean;
}

export interface CalendarItem {
  id: string;
  title: string;
  type: ContentType;
  releaseDate: string;
  posterPath?: string;
}
