import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Home from './page';
import { superflixAPI } from '@/lib/api/superflix';

// Mock the API
vi.mock('@/lib/api/superflix', () => ({
  superflixAPI: {
    getContentList: vi.fn(),
  },
}));

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    // Mock API to never resolve
    vi.mocked(superflixAPI.getContentList).mockImplementation(
      () => new Promise(() => {})
    );

    render(<Home />);

    // Should show loading spinner
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('loads and displays content from SuperFlixAPI', async () => {
    // Mock API responses
    vi.mocked(superflixAPI.getContentList).mockImplementation(
      async (category: string) => {
        if (category === 'movie') return ['tt1234567', 'tt2345678'];
        if (category === 'serie') return ['12345', '23456', '34567'];
        if (category === 'anime') return ['98765', '87654'];
        return [];
      }
    );

    render(<Home />);

    // Wait for content to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Should display category sections (appears in both filter and carousel)
    expect(screen.getAllByText('Filmes').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Séries').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Animes').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Doramas').length).toBeGreaterThan(0);
  });

  it('displays search bar and category filter', async () => {
    vi.mocked(superflixAPI.getContentList).mockResolvedValue([]);

    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Should have search input
    expect(
      screen.getByPlaceholderText(/buscar filmes, séries, animes/i)
    ).toBeInTheDocument();

    // Should have category filters
    expect(screen.getByText('Filmes')).toBeInTheDocument();
    expect(screen.getByText('Séries')).toBeInTheDocument();
    expect(screen.getByText('Animes')).toBeInTheDocument();
    expect(screen.getByText('Doramas')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    // Mock API to reject
    vi.mocked(superflixAPI.getContentList).mockRejectedValue(
      new Error('API Error')
    );

    render(<Home />);

    // Wait for error to be displayed
    await waitFor(() => {
      expect(
        screen.getByText(/erro ao carregar conteúdo/i)
      ).toBeInTheDocument();
    });
  });
});
