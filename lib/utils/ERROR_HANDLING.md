# Error Handling System

This document describes the comprehensive error handling system implemented in NicãoFlix.

## Overview

The error handling system provides:

1. **React Error Boundaries** - Catch runtime errors in React components
2. **Global Error Pages** - User-friendly 404 and 500 error pages
3. **Retry Logic** - Automatic retry with exponential backoff for failed API calls
4. **Cache Fallback** - Use stale cached data when API calls fail
5. **User-Friendly Messages** - Convert technical errors to readable messages

## Components

### ErrorBoundary

A React error boundary component that catches errors in the component tree.

```tsx
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}

// With custom fallback
<ErrorBoundary
  fallback={(error, reset) => (
    <div>
      <h1>Custom Error UI</h1>
      <button onClick={reset}>Try Again</button>
    </div>
  )}
  onError={(error, errorInfo) => {
    // Log to error tracking service
    console.error(error, errorInfo);
  }}
>
  <YourComponent />
</ErrorBoundary>
```

### Error Pages

#### app/not-found.tsx
Global 404 page for non-existent routes.

#### app/error.tsx
Global error page for unhandled errors in the app.

#### app/global-error.tsx
Root-level error handler for critical errors.

## API Error Handling

### withRetry

Retry failed API calls with exponential backoff.

```typescript
import { withRetry } from '@/lib/utils/api-error-handler';

const data = await withRetry(
  async () => {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('Failed');
    return response.json();
  },
  {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  }
);
```

### withCache

Cache API responses with TTL and stale fallback.

```typescript
import { withCache } from '@/lib/utils/api-error-handler';

const data = await withCache(
  async () => {
    const response = await fetch('/api/data');
    return response.json();
  },
  {
    key: 'my-data',
    ttl: 3600000, // 1 hour
    fallbackToStale: true,
  }
);
```

### withRetryAndCache

Combine retry and cache mechanisms.

```typescript
import { withRetryAndCache } from '@/lib/utils/api-error-handler';

const data = await withRetryAndCache(
  async () => {
    const response = await fetch('/api/data');
    if (!response.ok) throw new APIError('Failed', response.status);
    return response.json();
  },
  {
    key: 'my-data',
    ttl: 1800000, // 30 minutes
    fallbackToStale: true,
  },
  {
    maxRetries: 3,
    initialDelay: 1000,
  }
);
```

## APIError Class

Custom error class for API-related errors.

```typescript
import { APIError } from '@/lib/utils/api-error-handler';

throw new APIError(
  'Failed to fetch data',
  404, // status code
  originalError // optional original error
);
```

## User-Friendly Error Messages

Convert technical errors to user-friendly messages.

```typescript
import { getUserFriendlyErrorMessage } from '@/lib/utils/api-error-handler';

try {
  await fetchData();
} catch (error) {
  const message = getUserFriendlyErrorMessage(error);
  // Display message to user
}
```

### Error Message Mapping

- **404**: "Conteúdo não encontrado. Ele pode ter sido removido ou o link está incorreto."
- **429**: "Muitas requisições. Por favor, aguarde um momento e tente novamente."
- **5xx**: "Erro no servidor. Por favor, tente novamente mais tarde."
- **Network**: "Erro de conexão. Verifique sua internet e tente novamente."
- **Default**: "Ocorreu um erro inesperado. Por favor, tente novamente."

## SuperFlixAPI Integration

The SuperFlixAPI service automatically uses retry and cache mechanisms:

```typescript
import { superflixAPI } from '@/lib/api/superflix';

// Automatically retries on failure and uses cache
const movies = await superflixAPI.getContentList('movie');
const details = await superflixAPI.getMovieDetails('tt1234567');
```

### Retry Configuration

- **Max Retries**: 3 attempts
- **Initial Delay**: 1000ms
- **Backoff**: Exponential (2x multiplier)
- **Max Delay**: 10000ms

### Cache Configuration

- **Content Lists**: 1 hour TTL
- **Details Pages**: 30 minutes TTL
- **Stale Fallback**: Enabled (uses old data on error)

## Cache Management

```typescript
import { clearAPICache, deleteCacheEntry } from '@/lib/utils/api-error-handler';

// Clear all cached data
clearAPICache();

// Delete specific cache entry
deleteCacheEntry('movie-tt1234567');
```

## Best Practices

1. **Always use retry for external API calls** - Network issues are common
2. **Enable stale fallback for non-critical data** - Better UX than showing errors
3. **Use ErrorBoundary at strategic points** - Prevent entire app crashes
4. **Log errors in production** - Use error tracking services
5. **Show user-friendly messages** - Never expose technical details to users
6. **Provide retry actions** - Let users try again without refreshing

## Error Flow

```
User Action
    ↓
API Call with Retry
    ↓
Attempt 1 → Fail → Wait 1s
    ↓
Attempt 2 → Fail → Wait 2s
    ↓
Attempt 3 → Fail → Check Cache
    ↓
Stale Cache Available? → Yes → Return Stale Data
    ↓
No → Throw Error
    ↓
ErrorBoundary/Error Page
    ↓
User-Friendly Message + Retry Button
```

## Requirements Validation

This implementation satisfies **Requirement 8.5**:

- ✅ Retry logic with exponential backoff
- ✅ Fallback to cached data on failure
- ✅ User-friendly error messages
- ✅ Error logging and tracking
- ✅ Recovery mechanisms (retry buttons)
