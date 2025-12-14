/**
 * Example usage of ContentGrid component
 * 
 * This file demonstrates how to use the ContentGrid component
 * in different scenarios.
 */

import React from 'react';
import { ContentGrid } from './ContentGrid';
import { ContentItem } from '@/lib/types';

// Example 1: Basic usage with default columns
export function BasicContentGrid() {
  const items: ContentItem[] = [
    {
      id: '1',
      type: 'movie',
      title: 'The Matrix',
      posterPath: '/poster1.jpg',
      releaseDate: '1999-03-31',
      rating: 8.7,
    },
    {
      id: '2',
      type: 'serie',
      title: 'Breaking Bad',
      posterPath: '/poster2.jpg',
      releaseDate: '2008-01-20',
      rating: 9.5,
    },
    // ... more items
  ];

  return <ContentGrid items={items} />;
}

// Example 2: Loading state
export function LoadingContentGrid() {
  return <ContentGrid items={[]} loading={true} />;
}

// Example 3: Custom column configuration
export function CustomColumnsGrid() {
  const items: ContentItem[] = [
    // ... items
  ];

  const customColumns = {
    mobile: 1,    // 1 column on mobile
    tablet: 2,    // 2 columns on tablet
    desktop: 4,   // 4 columns on desktop
  };

  return <ContentGrid items={items} columns={customColumns} />;
}

// Example 4: With custom className
export function StyledContentGrid() {
  const items: ContentItem[] = [
    // ... items
  ];

  return (
    <ContentGrid 
      items={items} 
      className="px-4 py-8 max-w-7xl mx-auto"
    />
  );
}

// Example 5: Empty state
export function EmptyContentGrid() {
  return <ContentGrid items={[]} loading={false} />;
}

// Example 6: Real-world usage with data fetching
export function ContentCatalog() {
  // In a real app, you would fetch data here
  const [items, setItems] = React.useState<ContentItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setItems([
        // ... fetched items
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-bold text-text-primary mb-6">
        Catálogo de Filmes
      </h1>
      <ContentGrid items={items} loading={loading} />
    </div>
  );
}
