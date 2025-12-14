'use client';

import { useServiceWorker } from '@/lib/hooks/useServiceWorker';
import { useEffect } from 'react';

/**
 * Service Worker Provider
 * Registers the service worker and handles updates
 */
export function ServiceWorkerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { updateAvailable, updateServiceWorker } = useServiceWorker();

  useEffect(() => {
    if (updateAvailable) {
      // Optionally show a notification to the user
      console.log('New version available! Reload to update.');
      // Auto-update after a delay
      setTimeout(() => {
        updateServiceWorker();
      }, 5000);
    }
  }, [updateAvailable, updateServiceWorker]);

  return <>{children}</>;
}
