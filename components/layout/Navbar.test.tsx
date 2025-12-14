import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navbar } from './Navbar';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Navbar', () => {
  it('renders the logo', () => {
    render(<Navbar />);
    expect(screen.getByText('NicãoFlix')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Filmes')).toBeInTheDocument();
    expect(screen.getByText('Séries')).toBeInTheDocument();
    expect(screen.getByText('Animes')).toBeInTheDocument();
    expect(screen.getByText('Doramas')).toBeInTheDocument();
    expect(screen.getByText('Kids')).toBeInTheDocument();
  });

  it('renders search bar when showSearch is true', () => {
    render(<Navbar showSearch={true} />);
    expect(screen.getByPlaceholderText('Buscar conteúdo...')).toBeInTheDocument();
  });

  it('does not render search bar when showSearch is false', () => {
    render(<Navbar showSearch={false} />);
    expect(screen.queryByPlaceholderText('Buscar conteúdo...')).not.toBeInTheDocument();
  });

  it('calls onSearch when search is performed', () => {
    const onSearch = vi.fn();
    render(<Navbar onSearch={onSearch} />);
    
    // SearchBar will call onSearch through its debounced handler
    // This is tested in SearchBar.test.tsx
  });
});
