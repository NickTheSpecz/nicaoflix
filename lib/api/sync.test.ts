/**
 * Tests for Content Synchronization Service
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ContentSyncService } from './sync';
import { superflixAPI } from './superflix';

// Mock the superflixAPI
vi.mock('./superflix', () => ({
  superflixAPI: {
    getContentList: vi.fn(),
  },
}));

describe('ContentSyncService', () => {
  let syncService: ContentSyncService;

  beforeEach(() => {
    syncService = new ContentSyncService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    syncService.stopAutoSync();
    syncService.reset();
  });

  describe('syncContent', () => {
    it('should detect new movies when syncing', async () => {
      // Mock API response
      vi.mocked(superflixAPI.getContentList).mockResolvedValue([
        'tt1234567',
        'tt7654321',
      ]);

      const result = await syncService.syncContent();

      expect(result.success).toBe(true);
      expect(result.newMovies).toHaveLength(2);
      expect(result.newMovies).toContain('tt1234567');
      expect(result.newMovies).toContain('tt7654321');
    });

    it('should detect new series when syncing', async () => {
      vi.mocked(superflixAPI.getContentList).mockImplementation(
        async (category) => {
          if (category === 'movie') return [];
          if (category === 'serie') return ['12345', '67890'];
          if (category === 'anime') return [];
          return [];
        }
      );

      const result = await syncService.syncContent();

      expect(result.success).toBe(true);
      expect(result.newSeries).toHaveLength(2);
      expect(result.newSeries).toContain('12345');
    });

    it('should detect new animes when syncing', async () => {
      vi.mocked(superflixAPI.getContentList).mockImplementation(
        async (category) => {
          if (category === 'movie') return [];
          if (category === 'serie') return [];
          if (category === 'anime') return ['11111', '22222'];
          return [];
        }
      );

      const result = await syncService.syncContent();

      expect(result.success).toBe(true);
      expect(result.newAnimes).toHaveLength(2);
      expect(result.newAnimes).toContain('11111');
    });

    it('should not detect duplicate content on subsequent syncs', async () => {
      vi.mocked(superflixAPI.getContentList).mockResolvedValue([
        'tt1234567',
        'tt7654321',
      ]);

      // First sync
      const result1 = await syncService.syncContent();
      expect(result1.newMovies).toHaveLength(2);

      // Second sync with same data
      const result2 = await syncService.syncContent();
      expect(result2.newMovies).toHaveLength(0);
    });

    it('should detect only new content when some already exists', async () => {
      // First sync
      vi.mocked(superflixAPI.getContentList).mockResolvedValue([
        'tt1111111',
        'tt2222222',
      ]);
      await syncService.syncContent();

      // Second sync with additional content
      vi.mocked(superflixAPI.getContentList).mockResolvedValue([
        'tt1111111',
        'tt2222222',
        'tt3333333',
      ]);
      const result = await syncService.syncContent();

      expect(result.newMovies).toHaveLength(1);
      expect(result.newMovies).toContain('tt3333333');
    });

    it('should update lastSync timestamp after successful sync', async () => {
      vi.mocked(superflixAPI.getContentList).mockResolvedValue([]);

      const stateBefore = syncService.getSyncState();
      expect(stateBefore.lastSync).toBeNull();

      await syncService.syncContent();

      const stateAfter = syncService.getSyncState();
      expect(stateAfter.lastSync).not.toBeNull();
      expect(stateAfter.lastSync).toBeInstanceOf(Date);
    });

    it('should handle API errors and retry with exponential backoff', async () => {
      vi.useFakeTimers();
      
      const error = new Error('Network error');
      vi.mocked(superflixAPI.getContentList).mockRejectedValue(error);

      const syncPromise = syncService.syncContent();
      
      // Fast-forward through all the retry delays
      await vi.runAllTimersAsync();
      
      const result = await syncPromise;

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      // Should have errors from all three categories (movie, serie, anime)
      expect(result.errors.length).toBeGreaterThanOrEqual(3);
      
      vi.useRealTimers();
    });

    it('should not start sync if already running', async () => {
      vi.mocked(superflixAPI.getContentList).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve([]), 1000))
      );

      // Start first sync (will take 1 second)
      const promise1 = syncService.syncContent();

      // Try to start second sync immediately
      const result2 = await syncService.syncContent();

      expect(result2.success).toBe(false);
      expect(result2.errors[0].message).toBe('Sync already in progress');

      await promise1;
    });
  });

  describe('getSyncStats', () => {
    it('should return correct statistics', async () => {
      vi.mocked(superflixAPI.getContentList).mockImplementation(
        async (category) => {
          if (category === 'movie') return ['tt1', 'tt2'];
          if (category === 'serie') return ['s1', 's2', 's3'];
          if (category === 'anime') return ['a1'];
          return [];
        }
      );

      await syncService.syncContent();

      const stats = syncService.getSyncStats();

      expect(stats.totalMovies).toBe(2);
      expect(stats.totalSeries).toBe(3);
      expect(stats.totalAnimes).toBe(1);
      expect(stats.totalContent).toBe(6);
      expect(stats.lastSync).not.toBeNull();
    });
  });

  describe('startAutoSync and stopAutoSync', () => {
    it('should start and stop auto-sync', async () => {
      vi.mocked(superflixAPI.getContentList).mockResolvedValue([]);

      syncService.startAutoSync(100); // 100ms for testing
      
      // Wait for initial sync to complete
      await new Promise(resolve => setTimeout(resolve, 50));

      syncService.stopAutoSync();
    });

    it('should not start auto-sync if already running', () => {
      const consoleSpy = vi.spyOn(console, 'log');

      syncService.startAutoSync(100);
      syncService.startAutoSync(100); // Try to start again

      expect(consoleSpy).toHaveBeenCalledWith('Auto-sync already running');

      syncService.stopAutoSync();
    });
  });

  describe('reset', () => {
    it('should reset all state', async () => {
      vi.mocked(superflixAPI.getContentList).mockResolvedValue(['tt1', 'tt2']);

      await syncService.syncContent();

      const stateBefore = syncService.getSyncState();
      expect(stateBefore.movieIds.size).toBeGreaterThan(0);

      syncService.reset();

      const stateAfter = syncService.getSyncState();
      expect(stateAfter.movieIds.size).toBe(0);
      expect(stateAfter.serieIds.size).toBe(0);
      expect(stateAfter.animeIds.size).toBe(0);
      expect(stateAfter.lastSync).toBeNull();
      expect(stateAfter.errors).toHaveLength(0);
    });
  });

  describe('error logging', () => {
    it('should log errors during sync', async () => {
      vi.useFakeTimers();
      
      vi.mocked(superflixAPI.getContentList).mockRejectedValue(
        new Error('API Error')
      );

      const syncPromise = syncService.syncContent();
      await vi.runAllTimersAsync();
      await syncPromise;

      const state = syncService.getSyncState();
      expect(state.errors.length).toBeGreaterThan(0);
      // Check that at least one error has the expected message
      const hasExpectedError = state.errors.some(e => e.message === 'API Error');
      expect(hasExpectedError).toBe(true);
      
      vi.useRealTimers();
    });

    it('should clear errors', async () => {
      vi.useFakeTimers();
      
      vi.mocked(superflixAPI.getContentList).mockRejectedValue(
        new Error('API Error')
      );

      const syncPromise = syncService.syncContent();
      await vi.runAllTimersAsync();
      await syncPromise;

      expect(syncService.getSyncState().errors.length).toBeGreaterThan(0);

      syncService.clearErrors();

      expect(syncService.getSyncState().errors).toHaveLength(0);
      
      vi.useRealTimers();
    });
  });
});
