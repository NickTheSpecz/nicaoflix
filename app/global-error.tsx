'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Global error handler for the root layout
 * This catches errors that occur in the root layout itself
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-6">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">
                Erro Crítico
              </h1>
              
              <p className="text-gray-400 mb-2">
                Desculpe, encontramos um erro crítico. Por favor, recarregue a página.
              </p>
              
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-400">
                    Detalhes do erro (desenvolvimento)
                  </summary>
                  <pre className="mt-2 p-4 bg-gray-800 rounded text-xs text-red-400 overflow-auto max-h-40">
                    {error.message}
                    {error.digest && `\n\nDigest: ${error.digest}`}
                    {error.stack && `\n\n${error.stack}`}
                  </pre>
                </details>
              )}
            </div>

            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              <RefreshCw className="w-5 h-5" />
              Recarregar Página
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
