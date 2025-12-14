'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Film, Tv, Sparkles, Heart, Baby } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { useState } from 'react';

export interface NavbarProps {
  onSearch?: (query: string) => void;
  showSearch?: boolean;
}

const navLinks = [
  { href: '/', label: 'Início', icon: Film },
  { href: '/filmes', label: 'Filmes', icon: Film },
  { href: '/series', label: 'Séries', icon: Tv },
  { href: '/animes', label: 'Animes', icon: Sparkles },
  { href: '/doramas', label: 'Doramas', icon: Heart },
  { href: '/kids', label: 'Kids', icon: Baby },
];

export function Navbar({ onSearch, showSearch = true }: NavbarProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-surface-light">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl font-display font-bold text-primary hover:text-primary-light transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded"
            aria-label="NicãoFlix - Página inicial"
          >
            NicãoFlix
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium
                    transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
                    ${active 
                      ? 'text-primary bg-surface-light' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                    }
                  `}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="hidden md:block w-64">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Buscar conteúdo..."
                debounceMs={300}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
