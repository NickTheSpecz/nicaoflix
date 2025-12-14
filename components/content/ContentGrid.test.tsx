import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContentGrid } from './ContentGrid';
import { ContentItem } from '@/lib/types';

describe('ContentGrid', () => {
  const mockItems: ContentItem[] = [
    {
      id: '1',
      type: 'movie',
      title: 'Test Movie 1',
      posterPath: '/poster1.jpg',
      releaseDate: '2023-01-01',
      rating: 8.5,
    },
    {
      id: '2',
      type: 'serie',
      title: 'Test Series 1',
      posterPath: '/poster2.jpg',
      releaseDate: '2023-02-01',
      rating: 9.0,
    },
    {
      id: '3',
      type: 'anime',
      title: 'Test Anime 1',
      posterPath: '/poster3.jpg',
      releaseDate: '2023-03-01',
      rating: 7.5,
    },
  ];

  it('renders content items correctly', () => {
    render(<ContentGrid items={mockItems} />);
    
    // ContentCard renders titles twice (hover + mobile), so use getAllByText
    expect(screen.getAllByText('Test Movie 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Test Series 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Test Anime 1').length).toBeGreaterThan(0);
  });

  it('displays loading skeletons when loading is true', () => {
    render(<ContentGrid items={[]} loading={true} />);
    
    const loadingElement = screen.getByRole('status', { name: /loading content/i });
    expect(loadingElement).toBeInTheDocument();
  });

  it('displays empty state when no items are provided', () => {
    render(<ContentGrid items={[]} loading={false} />);
    
    expect(screen.getByText('Nenhum conteúdo encontrado')).toBeInTheDocument();
  });

  it('renders with custom column configuration', () => {
    const customColumns = {
      mobile: 1,
      tablet: 2,
      desktop: 4,
    };
    
    const { container } = render(
      <ContentGrid items={mockItems} columns={customColumns} />
    );
    
    const gridElement = container.querySelector('[role="list"]');
    expect(gridElement).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ContentGrid items={mockItems} className="custom-class" />
    );
    
    const gridElement = container.querySelector('.custom-class');
    expect(gridElement).toBeInTheDocument();
  });

  it('renders correct number of items', () => {
    render(<ContentGrid items={mockItems} />);
    
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(mockItems.length);
  });
});
