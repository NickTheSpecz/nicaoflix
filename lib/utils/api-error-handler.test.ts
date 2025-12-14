import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  withRetry,
  withCache,
  withRetryAndCache,
  APIError,
  getUserFriendlyErrorMessage,
  clearAPICache,
} from './api-error-handler';

describe('API Error Handler', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    clearAPICache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('APIError', () => {
    it('creates error with status code', () => {
      const error = new APIError('Test error', 404);
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(404);
      expect(error.name).toBe('APIError');
    });

    it('creates error with original error', () => {
      const originalError = new Error('Original');
      const error = new APIError('Test error', 500, originalError);
      expect(error.originalError).toBe(originalError);
    });
  });

  describe('withRetry', () => {
    it('returns result on first success', async () => {
      const fn = vi.fn().mockResolvedValue('success');
      const result = await withRetry(fn);
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('retries on failure and eventually succeeds', async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockRejectedValueOnce(new Error('fail 2'))
        .mockResolvedValue('success');

      const promise = withRetry(fn, { maxRetries: 3, initialDelay: 100 });

      // Advance timers for retries
      await vi.advanceTimersByTimeAsync(100);
      await vi.advanceTimersByTimeAsync(200);

      const result = await promise;
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('throws after max retries', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('persistent failure'));

      const promise = withRetry(fn, { maxRetries: 2, initialDelay: 100 });

      // Advance timers for retries
      await vi.advanceTimersByTimeAsync(100);

      await expect(promise).rejects.toThrow('persistent failure');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('does not retry on non-retryable errors', async () => {
      const error = new APIError('Not found', 404);
      const fn = vi.fn().mockRejectedValue(error);

      await expect(
        withRetry(fn, {
          shouldRetry: (err) => err instanceof APIError && err.statusCode !== 404,
        })
      ).rejects.toThrow('Not found');

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('withCache', () => {
    it('caches successful results', async () => {
      const fn = vi.fn().mockResolvedValue('data');

      const result1 = await withCache(fn, { key: 'test-key' });
      const result2 = await withCache(fn, { key: 'test-key' });

      expect(result1).toBe('data');
      expect(result2).toBe('data');
      expect(fn).toHaveBeenCalledTimes(1); // Only called once
    });

    it('respects TTL', async () => {
      const fn = vi.fn().mockResolvedValue('data');

      await withCache(fn, { key: 'test-key', ttl: 1000 });

      // Advance time past TTL
      vi.advanceTimersByTime(1001);

      await withCache(fn, { key: 'test-key', ttl: 1000 });

      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('falls back to stale cache on error', async () => {
      const fn = vi
        .fn()
        .mockResolvedValueOnce('fresh data')
        .mockRejectedValueOnce(new Error('API error'));

      // First call succeeds and caches
      const result1 = await withCache(fn, {
        key: 'test-key',
        ttl: 1000,
        fallbackToStale: true,
      });
      expect(result1).toBe('fresh data');

      // Advance time past TTL
      vi.advanceTimersByTime(1001);

      // Second call fails but returns stale cache
      const result2 = await withCache(fn, {
        key: 'test-key',
        ttl: 1000,
        fallbackToStale: true,
      });
      expect(result2).toBe('fresh data');
    });

    it('throws error when no stale cache available', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('API error'));

      await expect(
        withCache(fn, { key: 'test-key', fallbackToStale: true })
      ).rejects.toThrow('API error');
    });
  });

  describe('withRetryAndCache', () => {
    it('combines retry and cache mechanisms', async () => {
      const fn = vi.fn().mockResolvedValue('data');

      const result1 = await withRetryAndCache(
        fn,
        { key: 'test-key' },
        { maxRetries: 3 }
      );
      const result2 = await withRetryAndCache(
        fn,
        { key: 'test-key' },
        { maxRetries: 3 }
      );

      expect(result1).toBe('data');
      expect(result2).toBe('data');
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserFriendlyErrorMessage', () => {
    it('returns message for 404 errors', () => {
      const error = new APIError('Not found', 404);
      const message = getUserFriendlyErrorMessage(error);
      expect(message).toContain('não encontrado');
    });

    it('returns message for 429 errors', () => {
      const error = new APIError('Too many requests', 429);
      const message = getUserFriendlyErrorMessage(error);
      expect(message).toContain('Muitas requisições');
    });

    it('returns message for 5xx errors', () => {
      const error = new APIError('Server error', 500);
      const message = getUserFriendlyErrorMessage(error);
      expect(message).toContain('Erro no servidor');
    });

    it('returns message for network errors', () => {
      const error = new Error('fetch failed');
      const message = getUserFriendlyErrorMessage(error);
      expect(message).toContain('Erro de conexão');
    });

    it('returns default message for unknown errors', () => {
      const error = new Error('Unknown error');
      const message = getUserFriendlyErrorMessage(error);
      expect(message).toContain('erro inesperado');
    });
  });
});
