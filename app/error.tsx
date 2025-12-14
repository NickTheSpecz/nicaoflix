'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

/**
 * Global error page for Next.js App Router
 * Catches errors in server components and provides recovery UI
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-error/10 mb-6">
            <AlertTriangle className="w-10 h-10 text-error" />
          </div>
          
          <h1 className="font-display text-3xl font-bold text-text-primary mb-4">
            Algo deu errado
          </h1>
          
          <p className="text-text-secondary mb-2">
            Desculpe, encontramos um erro inesperado. Tente recarregar a página ou voltar ao início.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-text-muted hover:text-text-secondary">
                Detalhes do erro (desenvolvimento)
              </summary>
              <pre className="mt-2 p-4 bg-surface rounded text-xs text-error overflow-auto max-h-40">
                {error.message}
                {error.digest && `\n\nDigest: ${error.digest}`}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            variant="primary"
            className="gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Tentar Novamente
          </Button>
          
          <Link href="/">
            <Button variant="secondary" className="gap-2 w-full">
              <Home className="w-5 h-5" />
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
