'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Film, Tv, Sparkles, Baby } from 'lucide-react';

export interface BottomNavProps {
  className?: string;
}

const navItems = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/filmes', label: 'Filmes', icon: Film },
  { href: '/series', label: 'Séries', icon: Tv },
  { href: '/animes', label: 'Animes', icon: Sparkles },
  { href: '/kids', label: 'Kids', icon: Baby },
];

export function BottomNav({ className = '' }: BottomNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav 
      className={`fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-sm border-t border-surface-light md:hidden ${className}`}
      aria-label="Navegação principal mobile"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center flex-1 h-full
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset
                ${active 
                  ? 'text-primary' 
                  : 'text-text-secondary hover:text-text-primary'
                }
              `}
              aria-current={active ? 'page' : undefined}
              aria-label={item.label}
            >
              <Icon 
                className={`w-6 h-6 mb-1 transition-transform ${active ? 'scale-110' : ''}`}
                aria-hidden="true"
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
