'use client';

import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'tv';
export type Orientation = 'portrait' | 'landscape';

export interface DeviceInfo {
  type: DeviceType;
  orientation: Orientation;
  isTouchDevice: boolean;
  isTV: boolean;
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    type: 'desktop',
    orientation: 'landscape',
    isTouchDevice: false,
    isTV: false,
  });

  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Detect TV (typically large screens with specific user agents or no touch)
      const isTV = 
        /TV|SmartTV|GoogleTV|AppleTV|BRAVIA|NetCast|Tizen/i.test(navigator.userAgent) ||
        (width >= 1920 && !isTouchDevice);

      // Detect device type
      let type: DeviceType = 'desktop';
      if (isTV) {
        type = 'tv';
      } else if (width < 768) {
        type = 'mobile';
      } else if (width < 1024) {
        type = 'tablet';
      }

      // Detect orientation
      const orientation: Orientation = height > width ? 'portrait' : 'landscape';

      setDeviceInfo({
        type,
        orientation,
        isTouchDevice,
        isTV,
      });
    };

    // Initial detection
    detectDevice();

    // Listen for resize and orientation changes
    window.addEventListener('resize', detectDevice);
    window.addEventListener('orientationchange', detectDevice);

    return () => {
      window.removeEventListener('resize', detectDevice);
      window.removeEventListener('orientationchange', detectDevice);
    };
  }, []);

  return deviceInfo;
}
