'use client';

import React, { useState } from 'react';
import { CategoryFilter } from './CategoryFilter';
import { Category } from '@/lib/types/content';

/**
 * Example usage of CategoryFilter component
 * This demonstrates the component in action with state management
 */
export default function CategoryFilterExample() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories: Category[] = [
    { id: 'movies', name: 'Filmes', slug: 'movies' },
    { id: 'series', name: 'Séries', slug: 'series' },
    { id: 'animes', name: 'Animes', slug: 'animes' },
    { id: 'doramas', name: 'Doramas', slug: 'doramas' },
    { id: 'kids', name: 'Kids', slug: 'kids' },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-display font-bold text-text-primary mb-8">
          CategoryFilter Component Example
        </h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Interactive Filter
          </h2>
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        <div className="bg-surface p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Current State
          </h3>
          <p className="text-text-secondary">
            Active Category:{' '}
            <span className="text-primary font-medium">
              {activeCategory || 'None (showing all)'}
            </span>
          </p>
        </div>

        <div className="mt-8 bg-surface p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Features Demonstrated
          </h3>
          <ul className="space-y-2 text-text-secondary">
            <li>✓ Click a category to filter content</li>
            <li>✓ Click the active category again to deselect and show all</li>
            <li>✓ Visual highlight for active category with shadow effect</li>
            <li>✓ Hover effects on all buttons</li>
            <li>✓ Responsive design with horizontal scroll on mobile</li>
            <li>✓ Icons for each category type</li>
            <li>✓ Keyboard navigation support</li>
            <li>✓ ARIA attributes for accessibility</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

