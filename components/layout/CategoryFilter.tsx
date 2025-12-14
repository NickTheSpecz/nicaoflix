'use client';

import React from 'react';
import { Category } from '@/lib/types/content';
import { Film, Tv, Sparkles, Heart, Baby } from 'lucide-react';

/**
 * CategoryFilter Component
 * 
 * A responsive filter component for content categories with visual feedback.
 * 
 * Features:
 * - Toggle selection/deselection of categories
 * - Visual highlight for active category with shadow effect
 * - Responsive design with horizontal scroll on mobile
 * - Icons for each category type
 * - Smooth transitions and hover effects
 * - Full keyboard navigation support
 * - ARIA attributes for accessibility
 * 
 * Requirements Satisfied:
 * - 3.1: Displays only selected category content
 * - 3.2: Supports Kids category filtering
 * - 3.3: Updates interface without page reload
 * - 3.4: Visual highlight for active filter
 * - 3.5: Deselection restores all categories
 * 
 * @example
 * ```tsx
 * const [activeCategory, setActiveCategory] = useState<string | null>(null);
 * 
 * <CategoryFilter
 *   categories={categories}
 *   activeCategory={activeCategory}
 *   onCategoryChange={setActiveCategory}
 * />
 * ```
 */
export interface CategoryFilterProps {
  /** Array of category objects to display as filter options */
  categories: Category[];
  /** Currently active category ID, or null if no filter is active */
  activeCategory: string | null;
  /** Callback fired when category selection changes. Receives category ID or null for deselection */
  onCategoryChange: (categoryId: string | null) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  movies: <Film className="w-4 h-4" />,
  series: <Tv className="w-4 h-4" />,
  animes: <Sparkles className="w-4 h-4" />,
  doramas: <Heart className="w-4 h-4" />,
  kids: <Baby className="w-4 h-4" />,
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  const handleCategoryClick = (categoryId: string) => {
    // Toggle: if clicking the active category, deselect it
    if (activeCategory === categoryId) {
      onCategoryChange(null);
    } else {
      onCategoryChange(categoryId);
    }
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex gap-3 py-4 px-4 md:px-0 min-w-max md:min-w-0 md:flex-wrap">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          const icon = categoryIcons[category.slug] || categoryIcons[category.id];

          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-full
                font-medium text-sm transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 
                focus-visible:ring-primary focus-visible:ring-offset-2
                focus-visible:ring-offset-background
                whitespace-nowrap
                ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/50 scale-105'
                    : 'bg-surface text-text-secondary hover:bg-surface-light hover:text-text-primary hover:scale-105'
                }
              `}
              aria-pressed={isActive}
              aria-label={`Filter by ${category.name}`}
            >
              {icon}
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

