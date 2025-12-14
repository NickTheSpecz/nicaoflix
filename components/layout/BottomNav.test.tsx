import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BottomNav } from './BottomNav';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('BottomNav', () => {
  it('renders all navigation items', () => {
    render(<BottomNav />);
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Filmes')).toBeInTheDocument();
    expect(screen.getByText('Séries')).toBeInTheDocument();
    expect(screen.getByText('Animes')).toBeInTheDocument();
    expect(screen.getByText('Kids')).toBeInTheDocument();
  });

  it('highlights the active page', () => {
    render(<BottomNav />);
    const homeLink = screen.getByText('Início').closest('a');
    expect(homeLink).toHaveClass('text-primary');
  });

  it('has proper ARIA labels', () => {
    render(<BottomNav />);
    expect(screen.getByLabelText('Navegação principal mobile')).toBeInTheDocument();
  });
});
