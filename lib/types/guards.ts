/**
 * Type guards for runtime type checking
 */

import type {
  ContentType,
  ContentItem,
  ContentDetail,
  Season,
  Episode,
  CastMember,
  Category,
  PlayerCustomization,
  CalendarItem,
} from './content';

/**
 * Type guard for ContentType
 */
export function isContentType(value: unknown): value is ContentType {
  return (
    typeof value === 'string' &&
    ['movie', 'serie', 'anime', 'dorama'].includes(value)
  );
}

/**
 * Type guard for ContentItem
 */
export function isContentItem(value: unknown): value is ContentItem {
  if (typeof value !== 'object' || value === null) return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === 'string' &&
    isContentType(item.type) &&
    typeof item.title === 'string' &&
    typeof item.posterPath === 'string'
  );
}

/**
 * Type guard for ContentDetail
 */
export function isContentDetail(value: unknown): value is ContentDetail {
  if (!isContentItem(value)) return false;

  // ContentDetail extends ContentItem, so we just need to check it's a valid ContentItem
  // Additional fields are optional, so no need to validate them
  return true;
}

/**
 * Type guard for Episode
 */
export function isEpisode(value: unknown): value is Episode {
  if (typeof value !== 'object' || value === null) return false;

  const episode = value as Record<string, unknown>;

  return (
    typeof episode.episodeNumber === 'number' &&
    typeof episode.seasonNumber === 'number' &&
    typeof episode.name === 'string' &&
    episode.episodeNumber > 0 &&
    episode.seasonNumber > 0
  );
}

/**
 * Type guard for Season
 */
export function isSeason(value: unknown): value is Season {
  if (typeof value !== 'object' || value === null) return false;

  const season = value as Record<string, unknown>;

  return (
    typeof season.seasonNumber === 'number' &&
    typeof season.name === 'string' &&
    typeof season.episodeCount === 'number' &&
    season.seasonNumber > 0 &&
    season.episodeCount >= 0
  );
}

/**
 * Type guard for CastMember
 */
export function isCastMember(value: unknown): value is CastMember {
  if (typeof value !== 'object' || value === null) return false;

  const member = value as Record<string, unknown>;

  return typeof member.name === 'string';
}

/**
 * Type guard for Category
 */
export function isCategory(value: unknown): value is Category {
  if (typeof value !== 'object' || value === null) return false;

  const category = value as Record<string, unknown>;

  return (
    typeof category.id === 'string' &&
    typeof category.name === 'string' &&
    typeof category.slug === 'string'
  );
}

/**
 * Type guard for PlayerCustomization
 */
export function isPlayerCustomization(
  value: unknown
): value is PlayerCustomization {
  if (typeof value !== 'object' || value === null) return false;

  const customization = value as Record<string, unknown>;

  // All fields are optional, so we just check that if they exist, they have the right type
  if (
    customization.hideEpisodeList !== undefined &&
    typeof customization.hideEpisodeList !== 'boolean'
  ) {
    return false;
  }

  if (
    customization.primaryColor !== undefined &&
    typeof customization.primaryColor !== 'string'
  ) {
    return false;
  }

  if (
    customization.hideLink !== undefined &&
    typeof customization.hideLink !== 'boolean'
  ) {
    return false;
  }

  if (
    customization.transparent !== undefined &&
    typeof customization.transparent !== 'boolean'
  ) {
    return false;
  }

  if (
    customization.hideBackground !== undefined &&
    typeof customization.hideBackground !== 'boolean'
  ) {
    return false;
  }

  return true;
}

/**
 * Type guard for CalendarItem
 */
export function isCalendarItem(value: unknown): value is CalendarItem {
  if (typeof value !== 'object' || value === null) return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    isContentType(item.type) &&
    typeof item.releaseDate === 'string'
  );
}

/**
 * Type guard to check if content is a series (has seasons)
 */
export function isSeriesContent(
  content: ContentItem | ContentDetail
): content is ContentDetail & { seasons: Season[] } {
  return (
    (content.type === 'serie' || content.type === 'anime' || content.type === 'dorama') &&
    'seasons' in content &&
    Array.isArray(content.seasons) &&
    content.seasons.length > 0
  );
}

/**
 * Type guard to check if content is kids-friendly
 */
export function isKidsFriendlyContent(
  content: ContentItem | ContentDetail
): boolean {
  return content.isKidsFriendly === true;
}

/**
 * Type guard to check if content is a movie
 */
export function isMovieContent(content: ContentItem | ContentDetail): boolean {
  return content.type === 'movie';
}
