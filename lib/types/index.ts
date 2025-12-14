/**
 * Type exports
 */

// Core types
export type {
  ContentType,
  ContentItem,
  ContentDetail,
  CastMember,
  Episode,
  Season,
  Category,
  PlayerCustomization,
  CalendarItem,
} from './content';

// Zod schemas
export {
  ContentTypeSchema,
  ContentItemSchema,
  ContentDetailSchema,
  CastMemberSchema,
  EpisodeSchema,
  SeasonSchema,
  CategorySchema,
  PlayerCustomizationSchema,
  CalendarItemSchema,
  ContentListResponseSchema,
  MovieDetailsResponseSchema,
  SeriesDetailsResponseSchema,
  SeasonDetailsResponseSchema,
  EpisodeDetailsResponseSchema,
  CalendarResponseSchema,
} from './schemas';

// Type guards
export {
  isContentType,
  isContentItem,
  isContentDetail,
  isEpisode,
  isSeason,
  isCastMember,
  isCategory,
  isPlayerCustomization,
  isCalendarItem,
  isSeriesContent,
  isKidsFriendlyContent,
  isMovieContent,
} from './guards';

// Utility types
export type {
  MovieContent,
  SeriesContent,
  AnimeContent,
  DoramaContent,
  ContentWithBackdrop,
  ContentWithRating,
  ContentWithGenres,
  SeriesWithSeasons,
  SeasonWithEpisodes,
  PartialContentItem,
  ContentFilter,
  ContentSortBy,
  ContentSortOrder,
  ContentSort,
  PaginationParams,
  PaginatedResponse,
  ApiSuccess,
  ApiError,
  ApiResponse,
  LoadingState,
  AsyncData,
  PlayerState,
  EpisodeNavigation,
  SearchResult,
  CategoryWithCount,
  MovieId,
  SeriesId,
  ContentId,
  RequiredKeys,
  OptionalKeys,
  WithRequired,
  WithOptional,
  DeepPartial,
  DeepReadonly,
} from './utils';
