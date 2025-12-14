'use client';

import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { useDeviceDetection } from '@/lib/hooks/useDeviceDetection';

export interface ResponsiveLayoutProps {
  children: ReactNode;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
}

export function ResponsiveLayout({ 
  children, 
  showSearch = true,
  onSearch 
}: ResponsiveLayoutProps) {
  const { type, orientation } = useDeviceDetection();

  // Calculate padding based on device type
  const getPaddingClasses = () => {
    // Add top padding for navbar (desktop/tablet)
    // Add bottom padding for bottom nav (mobile)
    if (type === 'mobile') {
      return 'pt-4 pb-20'; // Space for bottom nav
    }
    return 'pt-20 pb-4'; // Space for top navbar
  };

  return (
    <div className="min-h-screen">
      {/* Desktop/Tablet Navbar */}
      <div className="hidden md:block">
        <Navbar onSearch={onSearch} showSearch={showSearch} />
      </div>

      {/* Main Content */}
      <main 
        className={getPaddingClasses()}
        data-device-type={type}
        data-orientation={orientation}
      >
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
