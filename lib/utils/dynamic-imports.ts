/**
 * Dynamic Import Utilities
 * Provides utilities for lazy loading heavy components
 */

import dynamic from 'next/dynamic';

/**
 * Create a dynamically imported component with loading fallback
 */
export function createDynamicComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options?: {
    loading?: () => React.ReactElement | null;
    ssr?: boolean;
  }
) {
  return dynamic(importFn, {
    loading: options?.loading,
    ssr: options?.ssr ?? true,
  });
}

/**
 * Lazy load components that are below the fold
 */
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  return dynamic(importFn, {
    ssr: false, // Don't render on server for below-fold content
  });
}

/**
 * Lazy load modal/dialog components
 */
export function createModalComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  return dynamic(importFn, {
    loading: () => null, // No loading state for modals
    ssr: false, // Modals don't need SSR
  });
}
