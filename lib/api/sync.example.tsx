/**
 * Example usage of Content Sync Service
 */

'use client';

import { useContentSync } from '../hooks/useContentSync';

export function SyncExample() {
  const { sync, startAutoSync, stopAutoSync, isSyncing, stats } = useContentSync({
    autoStart: false,
    onSyncComplete: (result) => {
      console.log('Sync completed:', result);
      if (result.success) {
        console.log(`New content: ${result.newMovies.length + result.newSeries.length + result.newAnimes.length}`);
      }
    },
  });

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Content Sync Service</h2>
      
      <div className="space-x-2">
        <button
          onClick={() => sync()}
          disabled={isSyncing}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </button>
        
        <button
          onClick={startAutoSync}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Start Auto-Sync
        </button>
        
        <button
          onClick={stopAutoSync}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Stop Auto-Sync
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-semibold mb-2">Sync Statistics</h3>
        <ul className="space-y-1 text-sm">
          <li>Last Sync: {stats.lastSync ? stats.lastSync.toLocaleString() : 'Never'}</li>
          <li>Status: {stats.isRunning ? 'Running' : 'Idle'}</li>
          <li>Total Movies: {stats.totalMovies}</li>
          <li>Total Series: {stats.totalSeries}</li>
          <li>Total Animes: {stats.totalAnimes}</li>
          <li>Total Content: {stats.totalContent}</li>
          <li>Errors: {stats.errorCount}</li>
        </ul>
        
        {stats.recentErrors.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold text-red-600">Recent Errors:</h4>
            <ul className="text-xs space-y-1 mt-2">
              {stats.recentErrors.map((error, idx) => (
                <li key={idx} className="text-red-500">
                  [{error.category}] {error.message} (attempt {error.attempt})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Example: Auto-sync on app initialization
 */
export function AutoSyncProvider({ children }: { children: React.ReactNode }) {
  // Start auto-sync when component mounts
  useContentSync({
    autoStart: true,
    intervalMs: 60 * 60 * 1000, // 1 hour
    onSyncComplete: (result) => {
      if (result.success) {
        const totalNew = result.newMovies.length + result.newSeries.length + result.newAnimes.length;
        if (totalNew > 0) {
          console.log(`✅ Sync complete: ${totalNew} new items detected`);
        }
      } else {
        console.error('❌ Sync failed:', result.errors);
      }
    },
  });

  return <>{children}</>;
}

/**
 * Example: Manual sync button
 */
export function SyncButton() {
  const { sync, isSyncing } = useContentSync();

  return (
    <button
      onClick={() => sync()}
      disabled={isSyncing}
      className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50"
    >
      {isSyncing ? '⟳ Syncing...' : '⟳ Sync Content'}
    </button>
  );
}
