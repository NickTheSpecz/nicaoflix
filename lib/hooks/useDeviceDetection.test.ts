import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDeviceDetection } from './useDeviceDetection';

describe('useDeviceDetection', () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;
  const originalUserAgent = navigator.userAgent;

  beforeEach(() => {
    // Reset window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
  });

  it('detects desktop device', () => {
    const { result } = renderHook(() => useDeviceDetection());
    expect(result.current.type).toBe('desktop');
  });

  it('detects landscape orientation', () => {
    const { result } = renderHook(() => useDeviceDetection());
    expect(result.current.orientation).toBe('landscape');
  });

  it('detects mobile device', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    const { result } = renderHook(() => useDeviceDetection());
    expect(result.current.type).toBe('mobile');
  });

  it('detects portrait orientation', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 667,
    });

    const { result } = renderHook(() => useDeviceDetection());
    expect(result.current.orientation).toBe('portrait');
  });
});
