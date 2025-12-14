# Content Synchronization Service

The Content Synchronization Service automatically keeps the NicãoFlix catalog up-to-date with the SuperFlixAPI by periodically fetching and detecting new content.

## Features

- **Automatic Synchronization**: Runs at configurable intervals (default: 1 hour)
- **New Content Detection**: Identifies newly added movies, series, and animes
- **Retry Logic**: Implements exponential backoff for failed requests (up to 3 attempts)
- **Error Logging**: Tracks and logs synchronization errors
- **Background Operation**: Runs without interrupting active users
- **Statistics**: Provides detailed sync statistics and status

## Usage

### Basic Usage

```typescript
import { contentSyncService } from '@/lib/api';

// Start automatic synchronization (runs every 1 hour by default)
contentSyncService.startAutoSync();

// Stop automatic synchronization
contentSyncService.stopAutoSync();

// Manually trigger a sync
const result = await contentSyncService.syncContent();
console.log(`New content: ${result.newMovies.length} movies, ${result.newSeries.length} series`);
```

### React Hook

```typescript
import { useContentSync } from '@/lib/hooks';

function MyComponent() {
  const { sync, startAutoSync, stopAutoSync, isSyncing, stats } = useContentSync({
    autoStart: true, // Start sync on mount
    intervalMs: 60 * 60 * 1000, // 1 hour
    onSyncComplete: (result) => {
      console.log('Sync completed:', result);
    },
  });

  return (
    <div>
      <button onClick={sync} disabled={isSyncing}>
        {isSyncing ? 'Syncing...' : 'Sync Now'}
      </button>
      <p>Total Content: {stats.totalContent}</p>
      <p>Last Sync: {stats.lastSync?.toLocaleString()}</p>
    </div>
  );
}
```

### Auto-Sync Provider

Wrap your app to enable automatic synchronization:

```typescript
import { AutoSyncProvider } from '@/lib/api/sync.example';

function App() {
  return (
    <AutoSyncProvider>
      <YourApp />
    </AutoSyncProvider>
  );
}
```

## API Reference

### ContentSyncService

#### Methods

##### `startAutoSync(intervalMs?: number): void`
Start automatic synchronization at the specified interval.

- **Parameters:**
  - `intervalMs` (optional): Sync interval in milliseconds (default: 3600000 = 1 hour)

##### `stopAutoSync(): void`
Stop automatic synchronization.

##### `syncContent(): Promise<SyncResult>`
Manually trigger content synchronization.

- **Returns:** `SyncResult` object containing:
  - `success`: Whether the sync completed successfully
  - `newMovies`: Array of new movie IDs detected
  - `newSeries`: Array of new series IDs detected
  - `newAnimes`: Array of new anime IDs detected
  - `errors`: Array of errors encountered
  - `timestamp`: Sync completion timestamp

##### `getSyncState(): Readonly<SyncState>`
Get the current synchronization state.

- **Returns:** `SyncState` object containing:
  - `lastSync`: Last successful sync timestamp
  - `isRunning`: Whether a sync is currently in progress
  - `movieIds`: Set of all known movie IDs
  - `serieIds`: Set of all known series IDs
  - `animeIds`: Set of all known anime IDs
  - `errors`: Array of recent errors

##### `getSyncStats()`
Get synchronization statistics.

- **Returns:** Object containing:
  - `lastSync`: Last sync timestamp
  - `isRunning`: Current sync status
  - `totalMovies`: Total number of movies
  - `totalSeries`: Total number of series
  - `totalAnimes`: Total number of animes
  - `totalContent`: Total content count
  - `errorCount`: Number of logged errors
  - `recentErrors`: Last 5 errors

##### `clearErrors(): void`
Clear the error log.

##### `reset(): void`
Reset the sync service to initial state (useful for testing).

## Configuration

### Sync Interval
Default: 1 hour (3,600,000 ms)

```typescript
// Custom interval: 30 minutes
contentSyncService.startAutoSync(30 * 60 * 1000);
```

### Retry Configuration
- **Max Retries**: 3 attempts per category
- **Initial Backoff**: 1 second
- **Backoff Strategy**: Exponential (1s, 2s, 4s)

### Error Log Size
Maximum: 100 errors (automatically truncated)

## How It Works

1. **Initialization**: Service starts with empty content sets
2. **Sync Trigger**: Either automatic (interval) or manual
3. **Fetch Content**: Calls SuperFlixAPI `/lista` endpoint for each category
4. **Detect New**: Compares fetched IDs with existing IDs
5. **Update State**: Adds new IDs to internal sets
6. **Error Handling**: Retries failed requests with exponential backoff
7. **Logging**: Records errors and updates statistics

## Error Handling

The service implements robust error handling:

- **Network Failures**: Automatic retry with exponential backoff
- **API Errors**: Logged and reported in sync results
- **Concurrent Syncs**: Prevents multiple simultaneous syncs
- **Error Logging**: Maintains recent error history

## Requirements Validation

This implementation satisfies the following requirements:

- **8.1**: Detects new content from SuperFlixAPI automatically
- **8.2**: Uses the `/lista` endpoint for synchronization
- **8.3**: Updates catalog without interrupting active users
- **8.4**: Reflects new episodes and content in the catalog
- **8.5**: Logs errors and implements retry logic

## Testing

Run the test suite:

```bash
npm test -- lib/api/sync.test.ts --run
```

The test suite covers:
- New content detection
- Duplicate prevention
- Error handling and retry logic
- State management
- Auto-sync functionality

## Example Integration

```typescript
// In your root layout or app component
'use client';

import { useEffect } from 'react';
import { contentSyncService } from '@/lib/api';

export function RootLayout({ children }) {
  useEffect(() => {
    // Start auto-sync when app loads
    contentSyncService.startAutoSync();

    // Cleanup on unmount
    return () => {
      contentSyncService.stopAutoSync();
    };
  }, []);

  return <>{children}</>;
}
```

## Performance Considerations

- **Background Operation**: Syncs run asynchronously without blocking UI
- **Caching**: Maintains in-memory sets for fast duplicate detection
- **Efficient Updates**: Only processes new content, not entire catalog
- **Rate Limiting**: Respects API limits with retry backoff

## Troubleshooting

### Sync Not Running
- Check if auto-sync is started: `contentSyncService.getSyncStats().isRunning`
- Verify no errors in console logs

### High Error Count
- Check network connectivity
- Verify SuperFlixAPI availability
- Review error messages: `contentSyncService.getSyncStats().recentErrors`

### Missing New Content
- Manually trigger sync: `await contentSyncService.syncContent()`
- Check sync timestamp: `contentSyncService.getSyncStats().lastSync`
- Verify API is returning new IDs
