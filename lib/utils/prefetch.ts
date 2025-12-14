/**
 * Prefetch Utilities
 * Provides utilities for prefetching important routes and data
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Prefetch routes on component mount
 */
export function usePrefetchRoutes(routes: string[]) {
  const router = useRouter();

  useEffect(() => {
    // Prefetch routes after a short delay to avoid blocking initial render
    const timeoutId = setTimeout(() => {
      routes.forEach((route) => {
        router.prefetch(route);
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [routes, router]);
}

/**
 * Prefetch route on hover
 */
export function usePrefetchOnHover(route: string) {
  const router = useRouter();

  const handleMouseEnter = () => {
    router.prefetch(route);
  };

  return { onMouseEnter: handleMouseEnter };
}

/**
 * Prefetch multiple routes on hover
 */
export function usePrefetchMultipleOnHover(routes: string[]) {
  const router = useRouter();

  const handleMouseEnter = () => {
    routes.forEach((route) => {
      router.prefetch(route);
    });
  };

  return { onMouseEnter: handleMouseEnter };
}

/**
 * Prefetch content details based on content items
 */
export function usePrefetchContentDetails(
  contentItems: Array<{ type: string; id: string }>,
  limit: number = 5
) {
  const router = useRouter();

  useEffect(() => {
    // Only prefetch the first few items to avoid overwhelming the network
    const itemsToPrefetch = contentItems.slice(0, limit);

    const timeoutId = setTimeout(() => {
      itemsToPrefetch.forEach((item) => {
        router.prefetch(`/detalhes/${item.type}/${item.id}`);
      });
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [contentItems, limit, router]);
}
