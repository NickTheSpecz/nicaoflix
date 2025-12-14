# Error Handling Integration Guide

This guide shows how all error handling components work together in NicãoFlix.

## Complete Error Handling Flow

```
User Action
    ↓
Component (wrapped in ErrorBoundary)
    ↓
API Call (with retry + cache)
    ↓
Network Request
    ↓
[Success] → Cache → Display Data
    ↓
[Failure] → Retry (3x with backoff)
    ↓
[Still Failing] → Check Stale Cache
    ↓
[Has Stale] → Return Stale Data + Warning
    ↓
[No Stale] → Throw APIError
    ↓
Component Error Handler
    ↓
ErrorMessage Component (with retry button)
    ↓
[User Clicks Retry] → Start Over
    ↓
[Critical Error] → ErrorBoundary
    ↓
Error Page (with navigation options)
```

## Integration Example: Content Details Page

```tsx
// app/detalhes/[type]/[id]/page.tsx
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { superflixAPI } from '@/lib/api/superflix';
import { getUserFriendlyErrorMessage } from '@/lib/utils';
import { notFound } from 'next/navigation';

export default async function ContentDetailsPage({
  params,
}: {
  params: { type: string; id: string };
}) {
  try {
    // API call with automatic retry and cache
    const content =
      params.type === 'movie'
        ? await superflixAPI.getMovieDetails(params.id)
        : await superflixAPI.getSeriesDetails(params.id);

    if (!content) {
      notFound(); // Triggers app/detalhes/[type]/[id]/not-found.tsx
    }

    return (
      <ErrorBoundary>
        <ContentDetailsComponent content={content} />
      </ErrorBoundary>
    );
  } catch (error) {
    // If error is 404, show not-found page
    if (error instanceof APIError && error.statusCode === 404) {
      notFound();
    }

    // For other errors, show error UI
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorMessage
          title="Erro ao carregar detalhes"
          message={getUserFriendlyErrorMessage(error)}
          type="error"
          onRetry={() => {
            // Refresh the page to retry
            window.location.reload();
          }}
        />
      </div>
    );
  }
}
```

## Integration Example: Client Component with State

```tsx
'use client';

import { useState, useEffect } from 'react';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { superflixAPI } from '@/lib/api/superflix';
import { getUserFriendlyErrorMessage } from '@/lib/utils';

export function ContentListComponent() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadContent = async () => {
    setLoading(true);
    setError(null);

    try {
      // Automatic retry and cache
      const ids = await superflixAPI.getContentList('movie');
      setContent(ids);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar conteúdo"
        message={getUserFriendlyErrorMessage(error)}
        type="error"
        onRetry={loadContent}
      />
    );
  }

  return (
    <ErrorBoundary>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {content.map((id) => (
          <ContentCard key={id} id={id} />
        ))}
      </div>
    </ErrorBoundary>
  );
}
```

## Error Handling Layers

### Layer 1: API Service (Automatic)
- **Location**: `lib/api/superflix.ts`
- **Handles**: Network errors, timeouts, 5xx errors
- **Strategy**: Retry with exponential backoff, stale cache fallback
- **User Impact**: Transparent - users don't see these errors if retry succeeds

### Layer 2: Component Error Handling (Manual)
- **Location**: Individual components
- **Handles**: Expected errors (404, validation, etc.)
- **Strategy**: Try-catch blocks, error state
- **User Impact**: Shows ErrorMessage component with retry option

### Layer 3: ErrorBoundary (Automatic)
- **Location**: Wraps component trees
- **Handles**: Unexpected runtime errors, render errors
- **Strategy**: Catch and display error UI
- **User Impact**: Shows error page with retry and navigation options

### Layer 4: Global Error Pages (Automatic)
- **Location**: `app/error.tsx`, `app/not-found.tsx`, `app/global-error.tsx`
- **Handles**: Unhandled errors, missing routes, critical errors
- **Strategy**: Next.js error boundaries
- **User Impact**: Full-page error UI with navigation options

## Error Types and Handling

### Network Errors
```typescript
// Automatically retried 3 times
// Falls back to stale cache if available
// Shows: "Erro de conexão. Verifique sua internet e tente novamente."
```

### 404 Not Found
```typescript
// No retry (client error)
// Triggers not-found.tsx page
// Shows: "Conteúdo não encontrado..."
```

### 429 Rate Limiting
```typescript
// Retried with exponential backoff
// Shows: "Muitas requisições. Por favor, aguarde um momento..."
```

### 5xx Server Errors
```typescript
// Retried 3 times
// Falls back to stale cache
// Shows: "Erro no servidor. Por favor, tente novamente mais tarde."
```

### Runtime Errors
```typescript
// Caught by ErrorBoundary
// Shows error page with retry button
// Logs to console for debugging
```

## Best Practices

### 1. Always Wrap Critical Components
```tsx
<ErrorBoundary>
  <CriticalComponent />
</ErrorBoundary>
```

### 2. Use API Service (Don't Fetch Directly)
```tsx
// ✅ Good - has retry and cache
const data = await superflixAPI.getMovieDetails(id);

// ❌ Bad - no error handling
const data = await fetch(`/api/movie/${id}`).then(r => r.json());
```

### 3. Show User-Friendly Messages
```tsx
// ✅ Good
<ErrorMessage
  message={getUserFriendlyErrorMessage(error)}
  onRetry={handleRetry}
/>

// ❌ Bad
<div>Error: {error.message}</div>
```

### 4. Provide Recovery Options
```tsx
// ✅ Good - user can retry or navigate
<ErrorMessage
  message="Erro ao carregar"
  onRetry={loadData}
  onDismiss={() => router.push('/')}
/>

// ❌ Bad - user is stuck
<div>Error occurred</div>
```

### 5. Log Errors for Debugging
```tsx
<ErrorBoundary
  onError={(error, errorInfo) => {
    console.error('Component error:', error, errorInfo);
    // In production: send to error tracking service
  }}
>
  <Component />
</ErrorBoundary>
```

## Testing Error Handling

### Test Network Errors
```typescript
// Temporarily break API
const originalFetch = global.fetch;
global.fetch = () => Promise.reject(new Error('Network error'));

// Verify retry logic works
// Verify stale cache fallback works
// Verify user sees friendly message

global.fetch = originalFetch;
```

### Test Component Errors
```typescript
// Create component that throws
function BuggyComponent() {
  throw new Error('Test error');
}

// Verify ErrorBoundary catches it
render(
  <ErrorBoundary>
    <BuggyComponent />
  </ErrorBoundary>
);

expect(screen.getByText(/algo deu errado/i)).toBeInTheDocument();
```

### Test Error Recovery
```typescript
// Verify retry button works
const retryButton = screen.getByText(/tentar novamente/i);
fireEvent.click(retryButton);

// Verify component recovers
expect(screen.getByText(/success/i)).toBeInTheDocument();
```

## Monitoring and Debugging

### Development Mode
- Error details shown in UI
- Full stack traces in console
- Error boundaries show error info

### Production Mode
- User-friendly messages only
- Errors logged to console
- Consider adding error tracking service (Sentry, etc.)

### Console Logs
```
✅ Success: No logs
⚠️  Retry: "Retry attempt 1/3 after 1000ms: Network error"
❌ Error: "Error fetching movie details for tt1234567: Network error"
```

## Summary

The error handling system provides:
- **Automatic retry** for transient failures
- **Cache fallback** to prevent data loss
- **User-friendly messages** in Portuguese
- **Recovery options** (retry, navigate)
- **Multiple layers** of protection
- **Developer tools** for debugging

All components work together to ensure users have a smooth experience even when errors occur.
