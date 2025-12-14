'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

/**
 * Sanitizes user input to prevent XSS attacks
 * Removes potentially dangerous characters while preserving search functionality
 */
function sanitizeInput(input: string): string {
  // Remove HTML tags and special characters that could be used for XSS
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>'"]/g, '') // Remove potentially dangerous characters
    .trim();
}

/**
 * Validates search input
 * Returns true if input is valid for searching
 */
function validateInput(input: string): boolean {
  // Input must be non-empty after trimming and within reasonable length
  const trimmed = input.trim();
  return trimmed.length > 0 && trimmed.length <= 100;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ onSearch, placeholder = 'Buscar filmes, séries, animes...', debounceMs = 300, className = '' }, ref) => {
    const [inputValue, setInputValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const internalInputRef = useRef<HTMLInputElement>(null);

    // Use forwarded ref or internal ref
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalInputRef;

    // Debounced search handler
    const debouncedSearch = useCallback(
      (value: string) => {
        // Clear existing timer
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        // Show searching indicator
        setIsSearching(true);

        // Set new timer
        debounceTimerRef.current = setTimeout(() => {
          const sanitized = sanitizeInput(value);
          
          // If input is empty or invalid, call onSearch with empty string
          if (!validateInput(sanitized)) {
            onSearch('');
          } else {
            onSearch(sanitized);
          }
          
          setIsSearching(false);
        }, debounceMs);
      },
      [onSearch, debounceMs]
    );

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      debouncedSearch(value);
    };

    // Handle clear button click
    const handleClear = () => {
      setInputValue('');
      onSearch('');
      setIsSearching(false);
      
      // Clear debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      // Focus input after clearing
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    }, []);

    const showClearButton = inputValue.length > 0;

    return (
      <div className={`relative w-full ${className}`}>
        <div className="relative flex items-center">
          {/* Search Icon */}
          <div className="absolute left-4 pointer-events-none">
            <Search className="h-5 w-5 text-text-muted" aria-hidden="true" />
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            maxLength={100}
            className={`
              w-full h-12 pl-12 pr-12
              bg-surface border border-surface-light
              text-text-primary placeholder:text-text-muted
              rounded-lg
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              transition-all duration-base
              hover:border-text-muted
              ${isSearching ? 'ring-2 ring-accent-blue ring-opacity-50' : ''}
            `}
            aria-label="Buscar conteúdo"
            aria-describedby={isSearching ? 'search-status' : undefined}
          />

          {/* Loading Indicator or Clear Button */}
          <div className="absolute right-4 flex items-center gap-2">
            {isSearching && (
              <Loader2 
                className="h-5 w-5 text-primary animate-spin" 
                aria-hidden="true"
              />
            )}
            
            {showClearButton && !isSearching && (
              <button
                type="button"
                onClick={handleClear}
                className="
                  p-1 rounded-full
                  text-text-muted hover:text-text-primary
                  hover:bg-surface-light
                  transition-all duration-fast
                  focus:outline-none focus:ring-2 focus:ring-primary
                "
                aria-label="Limpar busca"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Screen reader status */}
        {isSearching && (
          <span id="search-status" className="sr-only" role="status" aria-live="polite">
            Buscando...
          </span>
        )}
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';
