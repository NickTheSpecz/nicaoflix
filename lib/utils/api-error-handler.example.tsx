/**
 * Example usage of API error handling utilities
 */

import React from 'react';
import {
  withRetry,
  withCache,
  withRetryAndCache,
  getUserFriendlyErrorMessage,
  APIError,
} from './api-error-handler';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

// Example 1: Using withRetry for a simple API call
async function fetchDataWithRetry() {
  return withRetry(
    async () => {
      const response = await fetch('https://api.example.com/data');
      if (!response.ok) {
        throw new APIError('Failed to fetch', response.status);
      }
      return response.json();
    },
    {
      maxRetries: 3,
      initialDelay: 1000,
      maxDelay: 5000,
      backoffMultiplier: 2,
    }
  );
}

// Example 2: Using withCache for caching API responses
async function fetchDataWithCache() {
  return withCache(
    async () => {
      const response = await fetch('https://api.example.com/data');
      return response.json();
    },
    {
      key: 'example-data',
      ttl: 3600000, // 1 hour
      fallbackToStale: true,
    }
  );
}

// Example 3: Combining retry and cache
async function fetchDataWithRetryAndCache() {
  return withRetryAndCache(
    async () => {
      const response = await fetch('https://api.example.com/data');
      if (!response.ok) {
        throw new APIError('Failed to fetch', response.status);
      }
      return response.json();
    },
    {
      key: 'example-data-cached',
      ttl: 1800000, // 30 minutes
      fallbackToStale: true,
    },
    {
      maxRetries: 3,
      initialDelay: 1000,
    }
  );
}

// Example 4: Component with error handling
export function DataFetchingComponent() {
  const [data, setData] = React.useState<any>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchDataWithRetryAndCache();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load data"
        message={getUserFriendlyErrorMessage(error)}
        type="error"
        onRetry={fetchData}
      />
    );
  }

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

// Example 5: Custom retry logic
async function fetchWithCustomRetry() {
  return withRetry(
    async () => {
      const response = await fetch('https://api.example.com/data');
      if (!response.ok) {
        throw new APIError('Failed to fetch', response.status);
      }
      return response.json();
    },
    {
      maxRetries: 5,
      initialDelay: 500,
      shouldRetry: (error, attempt) => {
        // Custom retry logic
        if (attempt >= 5) return false;
        
        // Only retry on specific status codes
        if (error instanceof APIError) {
          return error.statusCode === 429 || error.statusCode === 503;
        }
        
        return false;
      },
    }
  );
}

// Example 6: Error handling in async component
export async function ServerComponentWithErrorHandling() {
  try {
    const data = await fetchDataWithRetryAndCache();
    
    return (
      <div>
        <h1>Data loaded successfully</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  } catch (error) {
    // In server components, errors will be caught by error.tsx
    throw new Error(getUserFriendlyErrorMessage(error));
  }
}
