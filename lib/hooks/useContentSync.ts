/**
 * React hook for content synchronization
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { contentSyncService } from '../api/sync';
import type { SyncResult } from '../api/sync';

export interface UseSyncOptions {
  autoStart?: boolean;
  intervalMs?: number;
  onSyncComplete?: (result: SyncResult) => void;
}

export function useContentSync(options: UseSyncOptions = {}) {
  const { autoStart = false, intervalMs, onSyncComplete } = options;

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncStats, setSyncStats] = useState(() =>
    contentSyncService.getSyncStats()
  );

  // Manual sync trigger
  const sync = useCallback(async () => {
    setIsSyncing(true);
    try {
      const result = await contentSyncService.syncContent();
      setLastSync(result.timestamp);
      setSyncStats(contentSyncService.getSyncStats());
      
      if (onSyncComplete) {
        onSyncComplete(result);
      }
      
      return result;
    } finally {
      setIsSyncing(false);
    }
  }, [onSyncComplete]);

  // Start/stop auto-sync
  const startAutoSync = useCallback(() => {
    contentSyncService.startAutoSync(intervalMs);
  }, [intervalMs]);

  const stopAutoSync = useCallback(() => {
    contentSyncService.stopAutoSync();
  }, []);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart) {
      startAutoSync();
    }

    return () => {
      if (autoStart) {
        stopAutoSync();
      }
    };
  }, [autoStart, startAutoSync, stopAutoSync]);

  // Update stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncStats(contentSyncService.getSyncStats());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    sync,
    startAutoSync,
    stopAutoSync,
    isSyncing,
    lastSync,
    stats: syncStats,
  };
}
