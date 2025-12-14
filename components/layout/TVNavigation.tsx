'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Film, Tv, Sparkles, Heart, Baby, Home } from 'lucide-react';

export interface TVNavigationProps {
  onNavigate?: (href: string) => void;
}

const navItems = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/filmes', label: 'Filmes', icon: Film },
  { href: '/series', label: 'Séries', icon: Tv },
  { href: '/animes', label: 'Animes', icon: Sparkles },
  { href: '/doramas', label: 'Doramas', icon: Heart },
  { href: '/kids', label: 'Kids', icon: Baby },
];

export function TVNavigation({ onNavigate }: TVNavigationProps) {
  const pathname = usePathname();
  const [focusedIndex, setFocusedIndex] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    // Set initial focus to current page
    const currentIndex = navItems.findIndex(item => {
      if (item.href === '/') {
        return pathname === '/';
      }
      return pathname.startsWith(item.href);
    });
    if (currentIndex !== -1) {
      setFocusedIndex(currentIndex);
    }
  }, [pathname]);

  useEffect(() => {
    // Focus the current item
    itemRefs.current[focusedIndex]?.focus();
  }, [focusedIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          setFocusedIndex(prev => (prev - 1 + navItems.length) % navItems.length);
          break;
        case 'ArrowRight':
          event.preventDefault();
          setFocusedIndex(prev => (prev + 1) % navItems.length);
          break;
        case 'Enter':
          event.preventDefault();
          const item = navItems[focusedIndex];
          if (item) {
            onNavigate?.(item.href);
            // The link will handle navigation
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, onNavigate]);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav 
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b-4 border-primary"
      aria-label="Navegação principal TV"
    >
      <div className="container mx-auto px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <div className="text-4xl font-display font-bold text-primary">
            NicãoFlix
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const focused = focusedIndex === index;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  ref={el => { itemRefs.current[index] = el; }}
                  className={`
                    flex flex-col items-center justify-center
                    px-6 py-4 rounded-lg text-lg font-medium
                    transition-all duration-200
                    focus:outline-none
                    ${focused 
                      ? 'bg-primary text-white scale-110 ring-4 ring-primary-light' 
                      : active
                        ? 'bg-surface-light text-primary'
                        : 'text-text-secondary hover:text-text-primary'
                    }
                  `}
                  aria-current={active ? 'page' : undefined}
                  tabIndex={focused ? 0 : -1}
                >
                  <Icon className="w-8 h-8 mb-2" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
