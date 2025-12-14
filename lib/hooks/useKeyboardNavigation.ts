'use client';

import { useEffect, useRef, RefObject } from 'react';

export interface KeyboardNavigationOptions {
  enabled?: boolean;
  onEnter?: () => void;
  onEscape?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  focusOnMount?: boolean;
}

export function useKeyboardNavigation<T extends HTMLElement>(
  options: KeyboardNavigationOptions = {}
): RefObject<T> {
  const {
    enabled = true,
    onEnter,
    onEscape,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    focusOnMount = false,
  } = options;

  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const element = elementRef.current;
    if (!element) return;

    // Focus on mount if requested
    if (focusOnMount) {
      element.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Enter':
          if (onEnter) {
            event.preventDefault();
            onEnter();
          }
          break;
        case 'Escape':
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;
        case 'ArrowUp':
          if (onArrowUp) {
            event.preventDefault();
            onArrowUp();
          }
          break;
        case 'ArrowDown':
          if (onArrowDown) {
            event.preventDefault();
            onArrowDown();
          }
          break;
        case 'ArrowLeft':
          if (onArrowLeft) {
            event.preventDefault();
            onArrowLeft();
          }
          break;
        case 'ArrowRight':
          if (onArrowRight) {
            event.preventDefault();
            onArrowRight();
          }
          break;
      }
    };

    element.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, onEnter, onEscape, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, focusOnMount]);

  return elementRef;
}

/**
 * Hook to manage focus within a container for TV/keyboard navigation
 */
export function useFocusManagement(containerRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    let currentFocusIndex = 0;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (focusableElements.length === 0) return;

      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault();
          currentFocusIndex = (currentFocusIndex + 1) % focusableElements.length;
          focusableElements[currentFocusIndex].focus();
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault();
          currentFocusIndex = (currentFocusIndex - 1 + focusableElements.length) % focusableElements.length;
          focusableElements[currentFocusIndex].focus();
          break;
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef]);
}
