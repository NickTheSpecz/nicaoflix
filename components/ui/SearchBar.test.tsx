import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Basic Rendering', () => {
    it('renders with default placeholder', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);
      
      const input = screen.getByRole('textbox', { name: /buscar conteúdo/i });
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'Buscar filmes, séries, animes...');
    });

    it('renders with custom placeholder', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} placeholder="Custom placeholder" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('placeholder', 'Custom placeholder');
    });

    it('renders search icon', () => {
      const onSearch = vi.fn();
      const { container } = render(<SearchBar onSearch={onSearch} />);
      
      // Search icon should be present
      const searchIcon = container.querySelector('svg');
      expect(searchIcon).toBeInTheDocument();
    });
  });

  describe('Debounce Functionality', () => {
    it('debounces search with default 300ms delay', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);
      
      const input = screen.getByRole('textbox');
      
      // Type quickly using fireEvent
      fireEvent.change(input, { target: { value: 'test' } });
      
      // Should not call immediately
      expect(onSearch).not.toHaveBeenCalled();
      
      // Fast-forward time
      vi.advanceTimersByTime(300);
      
      // Should call after debounce
      expect(onSearch).toHaveBeenCalledWith('test');
      expect(onSearch).toHaveBeenCalledTimes(1);
    });

    it('debounces search with custom delay', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} debounceMs={500} />);
      
      const input = screen.getByRole('textbox');
      
      fireEvent.change(input, { target: { value: 'test' } });
      
      // Should not call before custom delay
      vi.advanceTimersByTime(300);
      expect(onSearch).not.toHaveBeenCalled();
      
      // Should call after custom delay
      vi.advanceTimersByTime(200);
      expect(onSearch).toHaveBeenCalledWith('test');
    });

    it('resets debounce timer on new input', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);
      
      const input = screen.getByRole('textbox');
      
      // Type first character
      fireEvent.change(input, { target: { value: 't' } });
      vi.advanceTimersByTime(200);
      
      // Type second character before debounce completes
      fireEvent.change(input, { target: { value: 'te' } });
      vi.advanceTimersByTime(200);
      
      // Should not have called yet
      expect(onSearch).not.toHaveBeenCalled();
      
      // Complete the debounce
      vi.advanceTimersByTime(100);
      
      // Should call with full text
      expect(onSearch).toHaveBeenCalledWith('te');
      expect(onSearch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Input Sanitization', () => {
    it('sanitizes HTML tags from input', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);
      
      const input = screen.getByRole('textbox');
      
      fireEvent.change(input, { target: { value: '<script>alert("xss")</script>' } });
      vi.advanceTimersByTime(300);
      
      // Should remove HTML tags
      expect(onSearch).toHaveBeenCalledWith('scriptalertxss/script');
    });

    it('sanitizes dangerous characters from input', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);
      
      const input = screen.getByRole('textbox');
      
      fireEvent.change(input, { target: { value: 'test<>"\'' } });
      vi.advanceTimersByTime(300);
      
      // Should remove dangerous characters
      expect(onSearch).toHaveBeenCalledWith('test');
    });

    it('trims whitespace from input', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);
      
      const input = screen.getByRole('textbox');
      
      fireEvent.change(input, { target: { value: '  test  ' } });
      vi.advanceTimersByTime(300);
      
      // Should trim whitespace
      expect(onSearch).toHaveBeenCalledWith('test');
    });
  });

  describe('Input Validation', () => {
    it('calls onSearch with empty string for whitespace-only input', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);
      
      const input = screen.getByRole('textbox');
      
      fireEvent.change(input, { target: { value: '   ' } });
      vi.advanceTimersByTime(300);
      
      // Should call with empty string for invalid input
      expect(onSearch).toHaveBeenCalledWith('');
    });

    it('enforces maximum length of 100 characters', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);
      
      const input = screen.getByRole('textbox') as HTMLInputElement;
      
      expect(input).toHaveAttribute('maxLength', '100');
    });
  });

  describe('Clear Button', () => {
    it('shows clear button when input has value', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);
      
      const input = screen.getByRole('textbox');
      
      // Initially no clear button
      expect(screen.queryByRole('button', { name: /limpar busca/i })).not.toBeInTheDocument();
      
      // Type something
      fireEvent.change(input, { target: { value: 'test' } });
      
      // Wait for debounce to show clear button (not loading)
      vi.advanceTimersByTime(300);
      
      // Clear button should appear
      expect(screen.getByRole('button', { name: /limpar busca/i })).toBeInTheDocument();
    });

    it('clears input when clear button is clicked', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);
      
      const input = screen.getByRole('textbox') as HTMLInputElement;
      
      // Type something
      fireEvent.change(input, { target: { value: 'test' } });
      vi.advanceTimersByTime(300);
      
      // Click clear button
      const clearButton = screen.getByRole('button', { name: /limpar busca/i });
      fireEvent.click(clearButton);
      
      // Input should be cleared
      expect(input.value).toBe('');
    });

    it('calls onSearch with empty string when cleared', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);
      
      const input = screen.getByRole('textbox');
      
      // Type something
      fireEvent.change(input, { target: { value: 'test' } });
      vi.advanceTimersByTime(300);
      
      onSearch.mockClear();
      
      // Click clear button
      const clearButton = screen.getByRole('button', { name: /limpar busca/i });
      fireEvent.click(clearButton);
      
      // Should call onSearch with empty string immediately
      expect(onSearch).toHaveBeenCalledWith('');
    });

    it('focuses input after clearing', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);
      
      const input = screen.getByRole('textbox');
      
      // Type something
      fireEvent.change(input, { target: { value: 'test' } });
      vi.advanceTimersByTime(300);
      
      // Click clear button
      const clearButton = screen.getByRole('button', { name: /limpar busca/i });
      fireEvent.click(clearButton);
      
      // Input should be focused
      expect(input).toHaveFocus();
    });

    it('hides clear button after clearing', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);
      
      const input = screen.getByRole('textbox');
      
      // Type something
      fireEvent.change(input, { target: { value: 'test' } });
      vi.advanceTimersByTime(300);
      
      // Click clear button
      const clearButton = screen.getByRole('button', { name: /limpar busca/i });
      fireEvent.click(clearButton);
      
      // Clear button should be hidden
      expect(screen.queryByRole('button', { name: /limpar busca/i })).not.toBeInTheDocument();
    });
  });

  describe('Visual Feedback', () => {
    it('shows loading indicator during search', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);
      
      const input = screen.getByRole('textbox');
      
      // Type something
      fireEvent.change(input, { target: { value: 'test' } });
      
      // Loading indicator should be visible (check by text content)
      const loadingIndicator = screen.getByText(/buscando/i);
      expect(loadingIndicator).toBeInTheDocument();
      
      // Complete debounce
      vi.advanceTimersByTime(300);
      
      // Loading indicator should be hidden
      expect(screen.queryByText(/buscando/i)).not.toBeInTheDocument();
    });

    it('hides loading indicator when search completes', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);
      
      const input = screen.getByRole('textbox');
      
      fireEvent.change(input, { target: { value: 'test' } });
      
      // Advance timers to complete debounce
      vi.advanceTimersByTime(300);
      
      // Loading indicator should be hidden
      expect(screen.queryByText(/buscando/i)).not.toBeInTheDocument();
    });

    it('does not show clear button while searching', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);
      
      const input = screen.getByRole('textbox');
      
      fireEvent.change(input, { target: { value: 'test' } });
      
      // While searching, clear button should not be visible (loading indicator is shown instead)
      expect(screen.queryByRole('button', { name: /limpar busca/i })).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);
      
      const input = screen.getByRole('textbox', { name: /buscar conteúdo/i });
      expect(input).toBeInTheDocument();
    });

    it('provides screen reader feedback during search', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);
      
      const input = screen.getByRole('textbox');
      
      fireEvent.change(input, { target: { value: 'test' } });
      
      // Screen reader status should be present
      const status = screen.getByText(/buscando/i);
      expect(status).toHaveAttribute('aria-live', 'polite');
      expect(status).toHaveAttribute('role', 'status');
    });

    it('clear button has proper aria-label', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });
      vi.advanceTimersByTime(300);
      
      const clearButton = screen.getByRole('button', { name: /limpar busca/i });
      expect(clearButton).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports keyboard input', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);
      
      const input = screen.getByRole('textbox');
      
      // Focus and type
      input.focus();
      fireEvent.change(input, { target: { value: 'test' } });
      
      vi.advanceTimersByTime(300);
      
      expect(onSearch).toHaveBeenCalledWith('test');
    });

    it('clear button is keyboard accessible', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });
      vi.advanceTimersByTime(300);
      
      const clearButton = screen.getByRole('button', { name: /limpar busca/i });
      
      // Tab to clear button and press Enter
      clearButton.focus();
      fireEvent.click(clearButton);
      
      expect(input).toHaveValue('');
    });
  });
});
