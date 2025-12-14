/**
 * Integration Example: How to use PageLayout in actual pages
 * 
 * This shows how to integrate the responsive navigation system
 * into your Next.js pages.
 */

'use client';

import { useState } from 'react';
import { PageLayout } from './PageLayout';
import { ContentGrid } from '@/components/content/ContentGrid';
import { ContentItem } from '@/lib/types';

// Example: Home Page with Navigation
export function HomePageExample() {
  const [searchQuery, setSearchQuery] = useState('');
  const [content, setContent] = useState<ContentItem[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Filter content based on search query
    // This would typically call your API or filter local state
  };

  return (
    <PageLayout onSearch={handleSearch} showSearch={true}>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">
          {searchQuery ? `Resultados para "${searchQuery}"` : 'Início'}
        </h1>
        
        <ContentGrid items={content} loading={false} />
      </div>
    </PageLayout>
  );
}

// Example: Category Page (Movies, Series, etc.)
export function CategoryPageExample() {
  const [content, setContent] = useState<ContentItem[]>([]);

  return (
    <PageLayout showSearch={true}>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Filmes</h1>
        
        <ContentGrid 
          items={content} 
          loading={false}
          columns={{ mobile: 2, tablet: 3, desktop: 5 }}
        />
      </div>
    </PageLayout>
  );
}

// Example: Player Page (No Navigation Search)
export function PlayerPageExample() {
  return (
    <PageLayout showSearch={false}>
      <div className="w-full min-h-screen bg-black">
        {/* Video player component */}
        <div className="aspect-video w-full">
          {/* Player iframe or component */}
        </div>
        
        {/* Player controls and info */}
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">Movie Title</h2>
          <p className="text-text-secondary">Movie description...</p>
        </div>
      </div>
    </PageLayout>
  );
}

// Example: Details Page
export function DetailsPageExample() {
  return (
    <PageLayout showSearch={false}>
      <div className="relative">
        {/* Backdrop image */}
        <div className="absolute inset-0 h-[60vh]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>
        
        {/* Content */}
        <div className="relative container mx-auto px-4 pt-32">
          <h1 className="text-5xl font-bold mb-4">Content Title</h1>
          <p className="text-lg text-text-secondary mb-8">
            Content description and details...
          </p>
          
          <button className="bg-primary hover:bg-primary-dark px-8 py-3 rounded-lg font-semibold transition-colors">
            Assistir Agora
          </button>
        </div>
      </div>
    </PageLayout>
  );
}

// Example: Using device detection for custom behavior
import { useDeviceDetection } from '@/lib/hooks';

export function AdaptiveContentExample() {
  const { type, orientation } = useDeviceDetection();

  return (
    <PageLayout>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Adaptive Content</h1>
        
        {/* Show different layouts based on device */}
        {type === 'tv' && (
          <div className="grid grid-cols-3 gap-8">
            {/* Large cards for TV */}
          </div>
        )}
        
        {type === 'mobile' && orientation === 'portrait' && (
          <div className="grid grid-cols-2 gap-4">
            {/* Compact cards for mobile portrait */}
          </div>
        )}
        
        {type === 'desktop' && (
          <div className="grid grid-cols-5 gap-6">
            {/* Standard cards for desktop */}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
