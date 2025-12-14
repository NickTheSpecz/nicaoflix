/**
 * Content Synchronization Service
 * Automatically syncs content from SuperFlixAPI at regular intervals
 */

import { superflixAPI } from './superflix';

export interface SyncState {
  lastSync: Date | null;
  isRunning: boolean;
  movieIds: Set<string>;
  serieIds: Set<string>;
  animeIds: Set<string>;
  errors: SyncError[];
}

export interface SyncError {
  timestamp: Date;
  category: string;
  message: string;
  attempt: number;
}

export interface SyncResult {
  success: boolean;
  newMovies: string[];
  newSeries: string[];
  newAnimes: string[];
  errors: SyncError[];
  timestamp: Date;
}

export class ContentSyncService {
  private state: SyncState = {
    lastSync: null,
    isRunning: false,
    movieIds: new Set(),
    serieIds: new Set(),
    animeIds: new Set(),
    errors: [],
  };

  private syncInterval: NodeJS.Timeout | null = null;
  private readonly SYNC_INTERVAL_MS = 60 * 60 * 1000; // 1 hour
  private readonly MAX_RETRIES = 3;
  private readonly INITIAL_BACKOFF_MS = 1000; // 1 second
  private readonly MAX_ERROR_LOG_SIZE = 100;

  /**
   * Start automatic synchronization
   * @param intervalMs - Sync interval in milliseconds (default: 1 hour)
   */
  startAutoSync(intervalMs: number = this.SYNC_INTERVAL_MS): void {
    if (this.syncInterval) {
      console.log('Auto-sync already running');
      return;
    }

    console.log(`Starting auto-sync with interval: ${intervalMs}ms`);
    
    // Run initial sync
    this.syncContent();

    // Schedule periodic syncs
    this.syncInterval = setInterval(() => {
      this.syncContent();
    }, intervalMs);
  }

  /**
   * Stop automatic synchronization
   */
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('Auto-sync stopped');
    }
  }

  /**
   * Manually trigger content synchronization
   * @returns Sync result with new content detected
   */
  async syncContent(): Promise<SyncResult> {
    if (this.state.isRunning) {
      console.log('Sync already in progress, skipping...');
      return {
        success: false,
        newMovies: [],
        newSeries: [],
        newAnimes: [],
        errors: [
          {
            timestamp: new Date(),
            category: 'sync',
            message: 'Sync already in progress',
            attempt: 0,
          },
        ],
        timestamp: new Date(),
      };
    }

    this.state.isRunning = true;
    const result: SyncResult = {
      success: true,
      newMovies: [],
      newSeries: [],
      newAnimes: [],
      errors: [],
      timestamp: new Date(),
    };

    try {
      console.log('Starting content synchronization...');

      // Sync movies
      const movieResult = await this.syncCategory('movie', 'imdb');
      result.newMovies = movieResult.newIds;
      result.errors.push(...movieResult.errors);

      // Sync series
      const serieResult = await this.syncCategory('serie', 'tmdb');
      result.newSeries = serieResult.newIds;
      result.errors.push(...serieResult.errors);

      // Sync animes
      const animeResult = await this.syncCategory('anime', 'tmdb');
      result.newAnimes = animeResult.newIds;
      result.errors.push(...animeResult.errors);

      // Update last sync time
      this.state.lastSync = new Date();

      // Log results
      const totalNew =
        result.newMovies.length +
        result.newSeries.length +
        result.newAnimes.length;
      
      if (totalNew > 0) {
        console.log(
          `Sync completed: ${result.newMovies.length} new movies, ` +
          `${result.newSeries.length} new series, ` +
          `${result.newAnimes.length} new animes`
        );
      } else {
        console.log('Sync completed: No new content detected');
      }

      if (result.errors.length > 0) {
        console.warn(`Sync completed with ${result.errors.length} errors`);
        result.success = false;
      }
    } catch (error) {
      console.error('Critical error during sync:', error);
      result.success = false;
      result.errors.push({
        timestamp: new Date(),
        category: 'sync',
        message: error instanceof Error ? error.message : 'Unknown error',
        attempt: 0,
      });
    } finally {
      this.state.isRunning = false;
    }

    return result;
  }

  /**
   * Sync a specific content category with retry logic
   */
  private async syncCategory(
    category: 'movie' | 'serie' | 'anime',
    idType: 'tmdb' | 'imdb'
  ): Promise<{ newIds: string[]; errors: SyncError[] }> {
    const errors: SyncError[] = [];
    let attempt = 0;

    while (attempt < this.MAX_RETRIES) {
      try {
        const ids = await this.fetchWithRetry(
          () => superflixAPI.getContentList(category, idType),
          attempt
        );

        // Detect new content
        const existingIds = this.getExistingIds(category);
        const newIds = ids.filter((id) => !existingIds.has(id));

        // Update state with all IDs
        ids.forEach((id) => existingIds.add(id));

        return { newIds, errors };
      } catch (error) {
        attempt++;
        const syncError: SyncError = {
          timestamp: new Date(),
          category,
          message: error instanceof Error ? error.message : 'Unknown error',
          attempt,
        };

        errors.push(syncError);
        this.logError(syncError);

        if (attempt >= this.MAX_RETRIES) {
          console.error(
            `Failed to sync ${category} after ${this.MAX_RETRIES} attempts`
          );
          break;
        }

        // Wait before retry with exponential backoff
        const backoffMs = this.calculateBackoff(attempt);
        console.log(
          `Retrying ${category} sync in ${backoffMs}ms (attempt ${attempt + 1}/${this.MAX_RETRIES})`
        );
        await this.sleep(backoffMs);
      }
    }

    return { newIds: [], errors };
  }

  /**
   * Fetch data with exponential backoff retry
   */
  private async fetchWithRetry<T>(
    fetchFn: () => Promise<T>,
    attempt: number
  ): Promise<T> {
    try {
      return await fetchFn();
    } catch (error) {
      if (attempt < this.MAX_RETRIES - 1) {
        const backoffMs = this.calculateBackoff(attempt + 1);
        await this.sleep(backoffMs);
        return this.fetchWithRetry(fetchFn, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Calculate exponential backoff delay
   */
  private calculateBackoff(attempt: number): number {
    return this.INITIAL_BACKOFF_MS * Math.pow(2, attempt);
  }

  /**
   * Sleep utility for async delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get existing IDs for a category
   */
  private getExistingIds(category: 'movie' | 'serie' | 'anime'): Set<string> {
    switch (category) {
      case 'movie':
        return this.state.movieIds;
      case 'serie':
        return this.state.serieIds;
      case 'anime':
        return this.state.animeIds;
    }
  }

  /**
   * Log error to state with size limit
   */
  private logError(error: SyncError): void {
    this.state.errors.push(error);

    // Keep only the most recent errors
    if (this.state.errors.length > this.MAX_ERROR_LOG_SIZE) {
      this.state.errors = this.state.errors.slice(-this.MAX_ERROR_LOG_SIZE);
    }
  }

  /**
   * Get current sync state
   */
  getSyncState(): Readonly<SyncState> {
    return {
      ...this.state,
      movieIds: new Set(this.state.movieIds),
      serieIds: new Set(this.state.serieIds),
      animeIds: new Set(this.state.animeIds),
      errors: [...this.state.errors],
    };
  }

  /**
   * Get sync statistics
   */
  getSyncStats() {
    return {
      lastSync: this.state.lastSync,
      isRunning: this.state.isRunning,
      totalMovies: this.state.movieIds.size,
      totalSeries: this.state.serieIds.size,
      totalAnimes: this.state.animeIds.size,
      totalContent:
        this.state.movieIds.size +
        this.state.serieIds.size +
        this.state.animeIds.size,
      errorCount: this.state.errors.length,
      recentErrors: this.state.errors.slice(-5),
    };
  }

  /**
   * Clear error log
   */
  clearErrors(): void {
    this.state.errors = [];
  }

  /**
   * Reset sync state (useful for testing)
   */
  reset(): void {
    this.stopAutoSync();
    this.state = {
      lastSync: null,
      isRunning: false,
      movieIds: new Set(),
      serieIds: new Set(),
      animeIds: new Set(),
      errors: [],
    };
  }
}

// Export singleton instance
export const contentSyncService = new ContentSyncService();
