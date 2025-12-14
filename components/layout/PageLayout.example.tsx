/**
 * Example usage of PageLayout component
 * 
 * This component automatically adapts to different device types:
 * - Desktop/Tablet: Shows top Navbar with search
 * - Mobile: Shows BottomNav
 * - TV: Shows TV-optimized navigation with D-pad support
 */

import { PageLayout } from './PageLayout';

// Example 1: Basic usage
export function BasicExample() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Welcome to NicãoFlix</h1>
        <p>Your content goes here...</p>
      </div>
    </PageLayout>
  );
}

// Example 2: With search functionality
export function WithSearchExample() {
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Implement your search logic here
  };

  return (
    <PageLayout onSearch={handleSearch} showSearch={true}>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Browse Content</h1>
        {/* Your content grid here */}
      </div>
    </PageLayout>
  );
}

// Example 3: Without search (e.g., player page)
export function WithoutSearchExample() {
  return (
    <PageLayout showSearch={false}>
      <div className="w-full h-screen">
        {/* Video player here */}
      </div>
    </PageLayout>
  );
}

// Example 4: Using individual components
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { TVNavigation } from './TVNavigation';

export function CustomLayoutExample() {
  return (
    <div>
      {/* Use individual components for custom layouts */}
      <Navbar showSearch={true} />
      
      <main className="pt-20 pb-4">
        {/* Your content */}
      </main>
      
      <BottomNav />
    </div>
  );
}

// Example 5: TV Navigation
export function TVExample() {
  const handleNavigate = (href: string) => {
    console.log('Navigating to:', href);
  };

  return (
    <div>
      <TVNavigation onNavigate={handleNavigate} />
      
      <main className="pt-28 pb-8">
        {/* TV-optimized content */}
      </main>
    </div>
  );
}
