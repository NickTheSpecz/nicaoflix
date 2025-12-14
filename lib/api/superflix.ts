/**
 * SuperFlixAPI Service
 * Integration with SuperFlixAPI for content data and player URLs
 * Enhanced with retry logic and cache fallback
 */

import {
  ContentDetail,
  ContentType,
  Episode,
  Season,
  CalendarItem,
  PlayerCustomization,
} from '../types/content';
import {
  withRetryAndCache,
  APIError,
  getUserFriendlyErrorMessage,
} from '../utils/api-error-handler';

export class SuperFlixAPIService {
  private readonly baseURL = 'https://superflixapi.run';

  /**
   * Get all content IDs for a specific category
   * @param category - Content category (movie, serie, anime)
   * @param type - ID type (tmdb or imdb)
   * @returns Array of content IDs
   */
  async getContentList(
    category: 'movie' | 'serie' | 'anime',
    type: 'tmdb' | 'imdb' = 'tmdb'
  ): Promise<string[]> {
    return withRetryAndCache(
      async () => {
        const url = `${this.baseURL}/lista/${category}/${type}`;
        const response = await fetch(url, {
          next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
          throw new APIError(
            `Failed to fetch content list: ${response.statusText}`,
            response.status
          );
        }

        const data = await response.json();
        
        // The API returns an array of IDs
        if (Array.isArray(data)) {
          return data.map(String);
        }

        return [];
      },
      {
        key: `content-list-${category}-${type}`,
        ttl: 3600000, // 1 hour
        fallbackToStale: true,
      },
      {
        maxRetries: 3,
        initialDelay: 1000,
      }
    ).catch((error) => {
      console.error(`Error fetching content list for ${category}:`, error);
      throw new APIError(
        getUserFriendlyErrorMessage(error),
        error instanceof APIError ? error.statusCode : undefined,
        error
      );
    });
  }

  /**
   * Get detailed information about a movie
   * @param imdbId - IMDb ID of the movie
   * @returns Movie details
   */
  async getMovieDetails(imdbId: string): Promise<ContentDetail> {
    return withRetryAndCache(
      async () => {
        const url = `${this.baseURL}/filme/${imdbId}`;
        const response = await fetch(url, {
          next: { revalidate: 1800 }, // Cache for 30 minutes
        });

        if (!response.ok) {
          throw new APIError(
            `Failed to fetch movie details: ${response.statusText}`,
            response.status
          );
        }

        const data = await response.json();
        return this.transformMovieData(data, imdbId);
      },
      {
        key: `movie-${imdbId}`,
        ttl: 1800000, // 30 minutes
        fallbackToStale: true,
      },
      {
        maxRetries: 3,
        initialDelay: 1000,
      }
    ).catch((error) => {
      console.error(`Error fetching movie details for ${imdbId}:`, error);
      throw new APIError(
        getUserFriendlyErrorMessage(error),
        error instanceof APIError ? error.statusCode : undefined,
        error
      );
    });
  }

  /**
   * Get detailed information about a series
   * @param tmdbId - TMDB ID of the series
   * @returns Series details
   */
  async getSeriesDetails(tmdbId: string): Promise<ContentDetail> {
    return withRetryAndCache(
      async () => {
        const url = `${this.baseURL}/serie/${tmdbId}`;
        const response = await fetch(url, {
          next: { revalidate: 1800 }, // Cache for 30 minutes
        });

        if (!response.ok) {
          throw new APIError(
            `Failed to fetch series details: ${response.statusText}`,
            response.status
          );
        }

        const data = await response.json();
        return this.transformSeriesData(data, tmdbId);
      },
      {
        key: `series-${tmdbId}`,
        ttl: 1800000, // 30 minutes
        fallbackToStale: true,
      },
      {
        maxRetries: 3,
        initialDelay: 1000,
      }
    ).catch((error) => {
      console.error(`Error fetching series details for ${tmdbId}:`, error);
      throw new APIError(
        getUserFriendlyErrorMessage(error),
        error instanceof APIError ? error.statusCode : undefined,
        error
      );
    });
  }

  /**
   * Get details for a specific season of a series
   * @param tmdbId - TMDB ID of the series
   * @param seasonNumber - Season number
   * @returns Season details with episodes
   */
  async getSeasonDetails(
    tmdbId: string,
    seasonNumber: number
  ): Promise<Season> {
    return withRetryAndCache(
      async () => {
        const url = `${this.baseURL}/serie/${tmdbId}/${seasonNumber}`;
        const response = await fetch(url, {
          next: { revalidate: 1800 }, // Cache for 30 minutes
        });

        if (!response.ok) {
          throw new APIError(
            `Failed to fetch season details: ${response.statusText}`,
            response.status
          );
        }

        const data = await response.json();
        return this.transformSeasonData(data, seasonNumber);
      },
      {
        key: `season-${tmdbId}-${seasonNumber}`,
        ttl: 1800000, // 30 minutes
        fallbackToStale: true,
      },
      {
        maxRetries: 3,
        initialDelay: 1000,
      }
    ).catch((error) => {
      console.error(
        `Error fetching season ${seasonNumber} for series ${tmdbId}:`,
        error
      );
      throw new APIError(
        getUserFriendlyErrorMessage(error),
        error instanceof APIError ? error.statusCode : undefined,
        error
      );
    });
  }

  /**
   * Get details for a specific episode
   * @param tmdbId - TMDB ID of the series
   * @param seasonNumber - Season number
   * @param episodeNumber - Episode number
   * @returns Episode details
   */
  async getEpisodeDetails(
    tmdbId: string,
    seasonNumber: number,
    episodeNumber: number
  ): Promise<Episode> {
    return withRetryAndCache(
      async () => {
        const url = `${this.baseURL}/serie/${tmdbId}/${seasonNumber}/${episodeNumber}`;
        const response = await fetch(url, {
          next: { revalidate: 1800 }, // Cache for 30 minutes
        });

        if (!response.ok) {
          throw new APIError(
            `Failed to fetch episode details: ${response.statusText}`,
            response.status
          );
        }

        const data = await response.json();
        return this.transformEpisodeData(data, seasonNumber, episodeNumber);
      },
      {
        key: `episode-${tmdbId}-${seasonNumber}-${episodeNumber}`,
        ttl: 1800000, // 30 minutes
        fallbackToStale: true,
      },
      {
        maxRetries: 3,
        initialDelay: 1000,
      }
    ).catch((error) => {
      console.error(
        `Error fetching episode S${seasonNumber}E${episodeNumber} for series ${tmdbId}:`,
        error
      );
      throw new APIError(
        getUserFriendlyErrorMessage(error),
        error instanceof APIError ? error.statusCode : undefined,
        error
      );
    });
  }

  /**
   * Get calendar data for upcoming releases
   * @returns Array of calendar items
   */
  async getCalendar(): Promise<CalendarItem[]> {
    return withRetryAndCache(
      async () => {
        const url = `${this.baseURL}/calendario`;
        const response = await fetch(url, {
          next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
          throw new APIError(
            `Failed to fetch calendar: ${response.statusText}`,
            response.status
          );
        }

        const data = await response.json();
        return this.transformCalendarData(data);
      },
      {
        key: 'calendar',
        ttl: 3600000, // 1 hour
        fallbackToStale: true,
      },
      {
        maxRetries: 3,
        initialDelay: 1000,
      }
    ).catch((error) => {
      console.error('Error fetching calendar:', error);
      throw new APIError(
        getUserFriendlyErrorMessage(error),
        error instanceof APIError ? error.statusCode : undefined,
        error
      );
    });
  }

  /**
   * Generate player URL for movies or series episodes
   * @param type - Content type (movie or serie)
   * @param id - Content ID (IMDb for movies, TMDB for series)
   * @param season - Season number (for series)
   * @param episode - Episode number (for series)
   * @param customization - Player customization options
   * @returns Player URL
   */
  generatePlayerURL(
    type: 'movie' | 'serie',
    id: string,
    season?: number,
    episode?: number,
    customization?: PlayerCustomization
  ): string {
    let url: string;

    if (type === 'movie') {
      // Movie URL format: https://superflixapi.run/filme/{imdbId}
      url = `${this.baseURL}/filme/${id}`;
    } else {
      // Series URL format: https://superflixapi.run/serie/{tmdbId}/{season}/{episode}
      if (season === undefined || episode === undefined) {
        throw new Error(
          'Season and episode numbers are required for series player URLs'
        );
      }
      url = `${this.baseURL}/serie/${id}/${season}/${episode}`;
    }

    // Add customization parameters
    if (customization) {
      const params = new URLSearchParams();

      if (customization.hideEpisodeList) {
        params.append('noEpList', 'true');
      }
      if (customization.primaryColor) {
        params.append('color', customization.primaryColor);
      }
      if (customization.hideLink) {
        params.append('noLink', 'true');
      }
      if (customization.transparent) {
        params.append('transparent', 'true');
      }
      if (customization.hideBackground) {
        params.append('noBackground', 'true');
      }

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return url;
  }

  /**
   * Transform raw movie data from API to ContentDetail
   */
  private transformMovieData(data: any, imdbId: string): ContentDetail {
    return {
      id: imdbId,
      imdbId: imdbId,
      type: 'movie',
      title: data.title || data.name || 'Unknown Title',
      originalTitle: data.original_title || data.original_name,
      posterPath: data.poster_path || '',
      backdropPath: data.backdrop_path,
      overview: data.overview,
      releaseDate: data.release_date,
      rating: data.vote_average,
      genres: data.genres?.map((g: any) => g.name) || [],
      runtime: data.runtime,
      status: data.status,
      tagline: data.tagline,
      cast: data.credits?.cast?.slice(0, 10).map((c: any) => ({
        name: c.name,
        character: c.character,
        profilePath: c.profile_path,
      })),
      director: data.credits?.crew?.find((c: any) => c.job === 'Director')?.name,
    };
  }

  /**
   * Transform raw series data from API to ContentDetail
   */
  private transformSeriesData(data: any, tmdbId: string): ContentDetail {
    return {
      id: tmdbId,
      tmdbId: tmdbId,
      type: 'serie',
      title: data.name || data.title || 'Unknown Title',
      originalTitle: data.original_name || data.original_title,
      posterPath: data.poster_path || '',
      backdropPath: data.backdrop_path,
      overview: data.overview,
      releaseDate: data.first_air_date,
      rating: data.vote_average,
      genres: data.genres?.map((g: any) => g.name) || [],
      status: data.status,
      tagline: data.tagline,
      totalSeasons: data.number_of_seasons,
      totalEpisodes: data.number_of_episodes,
      cast: data.credits?.cast?.slice(0, 10).map((c: any) => ({
        name: c.name,
        character: c.character,
        profilePath: c.profile_path,
      })),
      seasons: data.seasons?.map((s: any) => ({
        seasonNumber: s.season_number,
        name: s.name,
        episodeCount: s.episode_count,
        airDate: s.air_date,
        posterPath: s.poster_path,
      })),
    };
  }

  /**
   * Transform raw season data from API to Season
   */
  private transformSeasonData(data: any, seasonNumber: number): Season {
    return {
      seasonNumber: seasonNumber,
      name: data.name || `Season ${seasonNumber}`,
      episodeCount: data.episodes?.length || 0,
      airDate: data.air_date,
      posterPath: data.poster_path,
      episodes: data.episodes?.map((e: any) => ({
        episodeNumber: e.episode_number,
        seasonNumber: seasonNumber,
        name: e.name,
        overview: e.overview,
        airDate: e.air_date,
        stillPath: e.still_path,
        runtime: e.runtime,
      })),
    };
  }

  /**
   * Transform raw episode data from API to Episode
   */
  private transformEpisodeData(
    data: any,
    seasonNumber: number,
    episodeNumber: number
  ): Episode {
    return {
      episodeNumber: episodeNumber,
      seasonNumber: seasonNumber,
      name: data.name || `Episode ${episodeNumber}`,
      overview: data.overview,
      airDate: data.air_date,
      stillPath: data.still_path,
      runtime: data.runtime,
    };
  }

  /**
   * Transform raw calendar data from API to CalendarItem array
   */
  private transformCalendarData(data: any): CalendarItem[] {
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((item: any) => ({
      id: item.id || item.tmdb_id || item.imdb_id,
      title: item.title || item.name,
      type: item.type || 'movie',
      releaseDate: item.release_date || item.air_date,
      posterPath: item.poster_path,
    }));
  }
}

// Export singleton instance
export const superflixAPI = new SuperFlixAPIService();
