/**
 * Zod schemas for runtime validation of API responses
 */

import { z } from 'zod';

/**
 * Content Type Schema
 */
export const ContentTypeSchema = z.enum(['movie', 'serie', 'anime', 'dorama']);

/**
 * ContentItem Schema
 * Validates basic content item structure from API
 */
export const ContentItemSchema = z.object({
  id: z.string(),
  tmdbId: z.string().optional(),
  imdbId: z.string().optional(),
  type: ContentTypeSchema,
  title: z.string(),
  originalTitle: z.string().optional(),
  posterPath: z.string(),
  backdropPath: z.string().optional(),
  overview: z.string().optional(),
  releaseDate: z.string().optional(),
  rating: z.number().min(0).max(10).optional(),
  genres: z.array(z.string()).optional(),
  isKidsFriendly: z.boolean().optional(),
});

/**
 * CastMember Schema
 */
export const CastMemberSchema = z.object({
  name: z.string(),
  character: z.string().optional(),
  profilePath: z.string().optional(),
});

/**
 * Episode Schema
 */
export const EpisodeSchema = z.object({
  episodeNumber: z.number().int().positive(),
  seasonNumber: z.number().int().positive(),
  name: z.string(),
  overview: z.string().optional(),
  airDate: z.string().optional(),
  stillPath: z.string().optional(),
  runtime: z.number().int().positive().optional(),
});

/**
 * Season Schema
 */
export const SeasonSchema = z.object({
  seasonNumber: z.number().int().positive(),
  name: z.string(),
  episodeCount: z.number().int().nonnegative(),
  airDate: z.string().optional(),
  posterPath: z.string().optional(),
  episodes: z.array(EpisodeSchema).optional(),
});

/**
 * ContentDetail Schema
 * Extends ContentItem with additional detail fields
 */
export const ContentDetailSchema = ContentItemSchema.extend({
  runtime: z.number().int().positive().optional(),
  status: z.string().optional(),
  tagline: z.string().optional(),
  cast: z.array(CastMemberSchema).optional(),
  director: z.string().optional(),
  seasons: z.array(SeasonSchema).optional(),
  totalSeasons: z.number().int().nonnegative().optional(),
  totalEpisodes: z.number().int().nonnegative().optional(),
});

/**
 * Category Schema
 */
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  icon: z.string().optional(),
});

/**
 * PlayerCustomization Schema
 */
export const PlayerCustomizationSchema = z.object({
  hideEpisodeList: z.boolean().optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  hideLink: z.boolean().optional(),
  transparent: z.boolean().optional(),
  hideBackground: z.boolean().optional(),
});

/**
 * CalendarItem Schema
 */
export const CalendarItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: ContentTypeSchema,
  releaseDate: z.string(),
  posterPath: z.string().optional(),
});

/**
 * API Response Schemas
 */

// Schema for /lista endpoint response
export const ContentListResponseSchema = z.array(z.string());

// Schema for movie details response
export const MovieDetailsResponseSchema = ContentDetailSchema;

// Schema for series details response
export const SeriesDetailsResponseSchema = ContentDetailSchema;

// Schema for season details response
export const SeasonDetailsResponseSchema = SeasonSchema;

// Schema for episode details response
export const EpisodeDetailsResponseSchema = EpisodeSchema;

// Schema for calendar response
export const CalendarResponseSchema = z.array(CalendarItemSchema);
