/**
 * API Error Handling Utilities
 * Provides retry logic, exponential backoff, and cache fallback mechanisms
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: Error, attempt: number) => boolean;
}

export interface CacheOptions {
  key: string;
  ttl?: number; // Time to live in milliseconds
  fallbackToStale?: boolean; // Use stale cache on error
}

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Sleep utility for delays
 */
const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calculate exponential backoff delay
 */
function calculateBackoff(
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  multiplier: number
): number {
  const delay = initialDelay * Math.pow(multiplier, attempt);
  return Math.min(delay, maxDelay);
}

/**
 * Default retry condition - retry on network errors and 5xx status codes
 */
function defaultShouldRetry(error: Error, attempt: number): boolean {
  if (attempt >= 3) return false;

  // Retry on network errors
  if (error.message.includes('fetch') || error.message.includes('network')) {
    return true;
  }

  // Retry on 5xx server errors
  if (error instanceof APIError && error.statusCode) {
    return error.statusCode >= 500 && error.statusCode < 600;
  }

  return false;
}

/**
 * Execute a function with retry logic and exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    shouldRetry = defaultShouldRetry,
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if we should retry
      if (!shouldRetry(lastError, attempt)) {
        throw lastError;
      }

      // Don't delay on the last attempt
      if (attempt < maxRetries - 1) {
        const delay = calculateBackoff(
          attempt,
          initialDelay,
          maxDelay,
          backoffMultiplier
        );
        console.warn(
          `Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms:`,
          lastError.message
        );
        await sleep(delay);
      }
    }
  }

  throw lastError!;
}

/**
 * Simple in-memory cache for API responses
 */
class SimpleCache {
  private cache = new Map<string, { data: any; timestamp: number }>();

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key: string, ttl?: number): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if cache is still valid
    if (ttl && Date.now() - entry.timestamp > ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  getStale(key: string): any | null {
    const entry = this.cache.get(key);
    return entry ? entry.data : null;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

// Global cache instance
const apiCache = new SimpleCache();

/**
 * Execute a function with caching and fallback to stale data on error
 */
export async function withCache<T>(
  fn: () => Promise<T>,
  options: CacheOptions
): Promise<T> {
  const { key, ttl = 3600000, fallbackToStale = true } = options;

  // Try to get from cache first
  const cached = apiCache.get(key, ttl);
  if (cached !== null) {
    return cached as T;
  }

  try {
    // Execute function and cache result
    const result = await fn();
    apiCache.set(key, result);
    return result;
  } catch (error) {
    // On error, try to use stale cache if enabled
    if (fallbackToStale) {
      const stale = apiCache.getStale(key);
      if (stale !== null) {
        console.warn(
          `Using stale cache for ${key} due to error:`,
          error instanceof Error ? error.message : error
        );
        return stale as T;
      }
    }

    throw error;
  }
}

/**
 * Combine retry and cache mechanisms
 */
export async function withRetryAndCache<T>(
  fn: () => Promise<T>,
  cacheOptions: CacheOptions,
  retryOptions: RetryOptions = {}
): Promise<T> {
  return withCache(
    () => withRetry(fn, retryOptions),
    cacheOptions
  );
}

/**
 * Clear the API cache
 */
export function clearAPICache(): void {
  apiCache.clear();
}

/**
 * Delete a specific cache entry
 */
export function deleteCacheEntry(key: string): void {
  apiCache.delete(key);
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  if (error instanceof APIError) {
    if (error.statusCode === 404) {
      return 'Conteúdo não encontrado. Ele pode ter sido removido ou o link está incorreto.';
    }
    if (error.statusCode === 429) {
      return 'Muitas requisições. Por favor, aguarde um momento e tente novamente.';
    }
    if (error.statusCode && error.statusCode >= 500) {
      return 'Erro no servidor. Por favor, tente novamente mais tarde.';
    }
  }

  if (error instanceof Error) {
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return 'Erro de conexão. Verifique sua internet e tente novamente.';
    }
  }

  return 'Ocorreu um erro inesperado. Por favor, tente novamente.';
}
