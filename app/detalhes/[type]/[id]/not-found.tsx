import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, Search } from 'lucide-react';

export default function ContentNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="font-display text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="font-display text-3xl font-semibold text-text-primary mb-2">
            Conteúdo Não Encontrado
          </h2>
          <p className="text-text-secondary">
            Desculpe, não conseguimos encontrar o conteúdo que você está procurando.
            Ele pode ter sido removido ou o link pode estar incorreto.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="primary" className="gap-2 w-full sm:w-auto">
              <Home className="w-5 h-5" />
              Voltar ao Início
            </Button>
          </Link>
          <Link href="/">
            <Button variant="secondary" className="gap-2 w-full sm:w-auto">
              <Search className="w-5 h-5" />
              Buscar Conteúdo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
