'use client';

import React, { useState } from 'react';
import { SearchBar } from './SearchBar';

/**
 * Example usage of the SearchBar component
 */
export function SearchBarExample() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Simulate search results
    if (query) {
      setResults([
        `Result 1 for "${query}"`,
        `Result 2 for "${query}"`,
        `Result 3 for "${query}"`,
      ]);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-display text-text-primary mb-8">
          SearchBar Component Example
        </h1>

        <SearchBar onSearch={handleSearch} />

        <div className="mt-8">
          {searchQuery && (
            <p className="text-text-secondary mb-4">
              Searching for: <span className="text-text-primary font-semibold">{searchQuery}</span>
            </p>
          )}

          {results.length > 0 && (
            <div className="space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="p-4 bg-surface rounded-lg text-text-primary hover:bg-surface-light transition-colors"
                >
                  {result}
                </div>
              ))}
            </div>
          )}

          {searchQuery && results.length === 0 && (
            <p className="text-text-muted">No results found</p>
          )}
        </div>
      </div>
    </div>
  );
}
