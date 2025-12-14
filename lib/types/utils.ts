/**
 * Utility types for NicãoFlix
 */

import type {
  ContentType,
  ContentItem,
  ContentDetail,
  Season,
  Episode,
} from './content';

/**
 * Extract content by type
 */
export type MovieContent = ContentItem & { type: 'movie' };
export type SeriesContent = ContentItem & { type: 'serie' };
export type AnimeContent = ContentItem & { type: 'anime' };
export type DoramaContent = ContentItem & { type: 'dorama' };

/**
 * Content with required fields
 */
export type ContentWithBackdrop = ContentItem & { backdropPath: string };
export type ContentWithRating = ContentItem & { rating: number };
export type ContentWithGenres = ContentItem & { genres: string[] };

/**
 * Series-specific types
 */
export type SeriesWithSeasons = ContentDetail & {
  type: 'serie' | 'anime' | 'dorama';
  seasons: Season[];
};

export type SeasonWithEpisodes = Season & {
  episodes: Episode[];
};

/**
 * Partial content types for loading states
 */
export type PartialContentItem = Partial<ContentItem> & {
  id: string;
  type: ContentType;
};

/**
 * Content filter types
 */
export type ContentFilter = {
  type?: ContentType;
  genre?: string;
  year?: number;
  kidsOnly?: boolean;
  minRating?: number;
};

/**
 * Content sort options
 */
export type ContentSortBy =
  | 'title'
  | 'releaseDate'
  | 'rating'
  | 'popularity'
  | 'recent';

export type ContentSortOrder = 'asc' | 'desc';

export type ContentSort = {
  by: ContentSortBy;
  order: ContentSortOrder;
};

/**
 * Pagination types
 */
export type PaginationParams = {
  page: number;
  pageSize: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/**
 * API response wrapper types
 */
export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: {
    message: string;
    code?: string;
    statusCode?: number;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/**
 * Loading state types
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type AsyncData<T> = {
  data: T | null;
  state: LoadingState;
  error: string | null;
};

/**
 * Player state types
 */
export type PlayerState = {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
};

/**
 * Episode navigation types
 */
export type EpisodeNavigation = {
  current: Episode;
  previous: Episode | null;
  next: Episode | null;
};

/**
 * Search result types
 */
export type SearchResult = ContentItem & {
  matchScore?: number;
  matchedFields?: string[];
};

/**
 * Category with content count
 */
export type CategoryWithCount = {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  count: number;
};

/**
 * Content ID types for API calls
 */
export type MovieId = {
  type: 'movie';
  imdbId: string;
};

export type SeriesId = {
  type: 'serie' | 'anime' | 'dorama';
  tmdbId: string;
};

export type ContentId = MovieId | SeriesId;

/**
 * Helper type to extract required keys from an object type
 */
export type RequiredKeys<T> = {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

/**
 * Helper type to extract optional keys from an object type
 */
export type OptionalKeys<T> = {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

/**
 * Make specific keys required
 */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * Make specific keys optional
 */
export type WithOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

/**
 * Deep partial type
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Deep readonly type
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
