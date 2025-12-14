import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContentCard } from './ContentCard';

describe('ContentCard', () => {
  const mockProps = {
    id: 'tt1234567',
    type: 'movie' as const,
    title: 'Test Movie',
    posterPath: '/test-poster.jpg',
    year: 2024,
    rating: 8.5,
  };

  it('renders with all required props', () => {
    render(<ContentCard {...mockProps} />);
    
    // Check if title is rendered (multiple instances for responsive design)
    const titles = screen.getAllByText('Test Movie');
    expect(titles.length).toBeGreaterThan(0);
    
    // Check if year is rendered
    expect(screen.getByText('2024')).toBeDefined();
    
    // Check if rating is rendered
    expect(screen.getByText('8.5')).toBeDefined();
  });

  it('renders with minimal props (no year or rating)', () => {
    const minimalProps = {
      id: 'tt1234567',
      type: 'serie' as const,
      title: 'Test Series',
      posterPath: '/test-poster.jpg',
    };
    
    render(<ContentCard {...minimalProps} />);
    
    // Check if title is rendered
    const titles = screen.getAllByText('Test Series');
    expect(titles.length).toBeGreaterThan(0);
  });

  it('creates correct link to details page', () => {
    render(<ContentCard {...mockProps} />);
    
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/detalhes/movie/tt1234567');
  });

  it('renders image with correct alt text', () => {
    render(<ContentCard {...mockProps} />);
    
    const image = screen.getByAltText('Test Movie');
    expect(image).toBeDefined();
  });

  it('handles different content types correctly', () => {
    const animeProps = {
      ...mockProps,
      type: 'anime' as const,
      id: 'anime123',
    };
    
    render(<ContentCard {...animeProps} />);
    
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/detalhes/anime/anime123');
  });
});

