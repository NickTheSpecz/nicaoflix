'use client';

import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { TVNavigation } from './TVNavigation';
import { useDeviceDetection } from '@/lib/hooks/useDeviceDetection';

export interface PageLayoutProps {
  children: ReactNode;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
}

export function PageLayout({ 
  children, 
  showSearch = true,
  onSearch 
}: PageLayoutProps) {
  const { type, orientation } = useDeviceDetection();

  // Calculate padding based on device type
  const getPaddingClasses = () => {
    if (type === 'tv') {
      return 'pt-28 pb-8'; // Extra space for larger TV nav
    }
    if (type === 'mobile') {
      return 'pt-4 pb-20'; // Space for bottom nav
    }
    return 'pt-20 pb-4'; // Space for top navbar
  };

  return (
    <>
      {/* TV Navigation */}
      {type === 'tv' && <TVNavigation />}

      {/* Desktop/Tablet Navbar */}
      {type !== 'tv' && type !== 'mobile' && (
        <Navbar onSearch={onSearch} showSearch={showSearch} />
      )}

      {/* Main Content */}
      <main 
        className={getPaddingClasses()}
        data-device-type={type}
        data-orientation={orientation}
      >
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      {type === 'mobile' && <BottomNav />}
    </>
  );
}
