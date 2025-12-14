/**
 * Tests for type definitions, schemas, and guards
 */

import { describe, it, expect } from 'vitest';
import {
  ContentItemSchema,
  ContentDetailSchema,
  EpisodeSchema,
  SeasonSchema,
  CastMemberSchema,
  CategorySchema,
  PlayerCustomizationSchema,
  CalendarItemSchema,
} from './schemas';
import {
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
import type { ContentItem, ContentDetail, Episode, Season } from './content';

describe('Zod Schemas', () => {
  describe('ContentItemSchema', () => {
    it('validates a valid content item', () => {
      const validItem = {
        id: '123',
        type: 'movie',
        title: 'Test Movie',
        posterPath: '/poster.jpg',
      };

      const result = ContentItemSchema.safeParse(validItem);
      expect(result.success).toBe(true);
    });

    it('rejects invalid content type', () => {
      const invalidItem = {
        id: '123',
        type: 'invalid',
        title: 'Test Movie',
        posterPath: '/poster.jpg',
      };

      const result = ContentItemSchema.safeParse(invalidItem);
      expect(result.success).toBe(false);
    });

    it('rejects missing required fields', () => {
      const invalidItem = {
        id: '123',
        type: 'movie',
      };

      const result = ContentItemSchema.safeParse(invalidItem);
      expect(result.success).toBe(false);
    });
  });

  describe('EpisodeSchema', () => {
    it('validates a valid episode', () => {
      const validEpisode = {
        episodeNumber: 1,
        seasonNumber: 1,
        name: 'Pilot',
      };

      const result = EpisodeSchema.safeParse(validEpisode);
      expect(result.success).toBe(true);
    });

    it('rejects negative episode numbers', () => {
      const invalidEpisode = {
        episodeNumber: -1,
        seasonNumber: 1,
        name: 'Pilot',
      };

      const result = EpisodeSchema.safeParse(invalidEpisode);
      expect(result.success).toBe(false);
    });
  });

  describe('PlayerCustomizationSchema', () => {
    it('validates valid customization', () => {
      const validCustomization = {
        hideEpisodeList: true,
        primaryColor: '#FF0000',
      };

      const result = PlayerCustomizationSchema.safeParse(validCustomization);
      expect(result.success).toBe(true);
    });

    it('rejects invalid color format', () => {
      const invalidCustomization = {
        primaryColor: 'red',
      };

      const result = PlayerCustomizationSchema.safeParse(invalidCustomization);
      expect(result.success).toBe(false);
    });
  });
});

describe('Type Guards', () => {
  describe('isContentType', () => {
    it('returns true for valid content types', () => {
      expect(isContentType('movie')).toBe(true);
      expect(isContentType('serie')).toBe(true);
      expect(isContentType('anime')).toBe(true);
      expect(isContentType('dorama')).toBe(true);
    });

    it('returns false for invalid content types', () => {
      expect(isContentType('invalid')).toBe(false);
      expect(isContentType(123)).toBe(false);
      expect(isContentType(null)).toBe(false);
    });
  });

  describe('isContentItem', () => {
    it('returns true for valid content item', () => {
      const item = {
        id: '123',
        type: 'movie',
        title: 'Test Movie',
        posterPath: '/poster.jpg',
      };

      expect(isContentItem(item)).toBe(true);
    });

    it('returns false for invalid content item', () => {
      expect(isContentItem(null)).toBe(false);
      expect(isContentItem({})).toBe(false);
      expect(isContentItem({ id: '123' })).toBe(false);
    });
  });

  describe('isEpisode', () => {
    it('returns true for valid episode', () => {
      const episode = {
        episodeNumber: 1,
        seasonNumber: 1,
        name: 'Pilot',
      };

      expect(isEpisode(episode)).toBe(true);
    });

    it('returns false for invalid episode', () => {
      expect(isEpisode(null)).toBe(false);
      expect(isEpisode({ episodeNumber: 0 })).toBe(false);
    });
  });

  describe('isSeason', () => {
    it('returns true for valid season', () => {
      const season = {
        seasonNumber: 1,
        name: 'Season 1',
        episodeCount: 10,
      };

      expect(isSeason(season)).toBe(true);
    });

    it('returns false for invalid season', () => {
      expect(isSeason(null)).toBe(false);
      expect(isSeason({})).toBe(false);
    });
  });

  describe('isSeriesContent', () => {
    it('returns true for series with seasons', () => {
      const series: ContentDetail = {
        id: '123',
        type: 'serie',
        title: 'Test Series',
        posterPath: '/poster.jpg',
        seasons: [
          {
            seasonNumber: 1,
            name: 'Season 1',
            episodeCount: 10,
          },
        ],
      };

      expect(isSeriesContent(series)).toBe(true);
    });

    it('returns false for movie', () => {
      const movie: ContentItem = {
        id: '123',
        type: 'movie',
        title: 'Test Movie',
        posterPath: '/poster.jpg',
      };

      expect(isSeriesContent(movie)).toBe(false);
    });
  });

  describe('isKidsFriendlyContent', () => {
    it('returns true for kids-friendly content', () => {
      const content: ContentItem = {
        id: '123',
        type: 'movie',
        title: 'Kids Movie',
        posterPath: '/poster.jpg',
        isKidsFriendly: true,
      };

      expect(isKidsFriendlyContent(content)).toBe(true);
    });

    it('returns false for non-kids-friendly content', () => {
      const content: ContentItem = {
        id: '123',
        type: 'movie',
        title: 'Adult Movie',
        posterPath: '/poster.jpg',
        isKidsFriendly: false,
      };

      expect(isKidsFriendlyContent(content)).toBe(false);
    });
  });

  describe('isMovieContent', () => {
    it('returns true for movie content', () => {
      const movie: ContentItem = {
        id: '123',
        type: 'movie',
        title: 'Test Movie',
        posterPath: '/poster.jpg',
      };

      expect(isMovieContent(movie)).toBe(true);
    });

    it('returns false for non-movie content', () => {
      const series: ContentItem = {
        id: '123',
        type: 'serie',
        title: 'Test Series',
        posterPath: '/poster.jpg',
      };

      expect(isMovieContent(series)).toBe(false);
    });
  });
});
