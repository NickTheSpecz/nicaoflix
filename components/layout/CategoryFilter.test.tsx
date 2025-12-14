import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CategoryFilter } from './CategoryFilter';
import { Category } from '@/lib/types/content';

describe('CategoryFilter', () => {
  const mockCategories: Category[] = [
    { id: 'movies', name: 'Filmes', slug: 'movies' },
    { id: 'series', name: 'Séries', slug: 'series' },
    { id: 'animes', name: 'Animes', slug: 'animes' },
    { id: 'doramas', name: 'Doramas', slug: 'doramas' },
    { id: 'kids', name: 'Kids', slug: 'kids' },
  ];

  it('renders all category buttons', () => {
    const onCategoryChange = vi.fn();
    render(
      <CategoryFilter
        categories={mockCategories}
        activeCategory={null}
        onCategoryChange={onCategoryChange}
      />
    );

    mockCategories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });

  it('highlights the active category', () => {
    const onCategoryChange = vi.fn();
    render(
      <CategoryFilter
        categories={mockCategories}
        activeCategory="movies"
        onCategoryChange={onCategoryChange}
      />
    );

    const moviesButton = screen.getByText('Filmes').closest('button');
    expect(moviesButton).toHaveClass('bg-primary');
    expect(moviesButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onCategoryChange when a category is clicked', () => {
    const onCategoryChange = vi.fn();
    render(
      <CategoryFilter
        categories={mockCategories}
        activeCategory={null}
        onCategoryChange={onCategoryChange}
      />
    );

    const seriesButton = screen.getByText('Séries');
    fireEvent.click(seriesButton);

    expect(onCategoryChange).toHaveBeenCalledWith('series');
  });

  it('deselects category when clicking the active category', () => {
    const onCategoryChange = vi.fn();
    render(
      <CategoryFilter
        categories={mockCategories}
        activeCategory="animes"
        onCategoryChange={onCategoryChange}
      />
    );

    const animesButton = screen.getByText('Animes');
    fireEvent.click(animesButton);

    expect(onCategoryChange).toHaveBeenCalledWith(null);
  });

  it('applies correct styling to inactive categories', () => {
    const onCategoryChange = vi.fn();
    render(
      <CategoryFilter
        categories={mockCategories}
        activeCategory="movies"
        onCategoryChange={onCategoryChange}
      />
    );

    const seriesButton = screen.getByText('Séries').closest('button');
    expect(seriesButton).toHaveClass('bg-surface');
    expect(seriesButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders with no active category', () => {
    const onCategoryChange = vi.fn();
    render(
      <CategoryFilter
        categories={mockCategories}
        activeCategory={null}
        onCategoryChange={onCategoryChange}
      />
    );

    mockCategories.forEach((category) => {
      const button = screen.getByText(category.name).closest('button');
      expect(button).toHaveClass('bg-surface');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });
  });

  it('has proper accessibility attributes', () => {
    const onCategoryChange = vi.fn();
    render(
      <CategoryFilter
        categories={mockCategories}
        activeCategory="kids"
        onCategoryChange={onCategoryChange}
      />
    );

    const kidsButton = screen.getByLabelText('Filter by Kids');
    expect(kidsButton).toBeInTheDocument();
    expect(kidsButton).toHaveAttribute('aria-pressed', 'true');
  });
});

