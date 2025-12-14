# NicãoFlix

Plataforma de streaming pessoal para filmes, séries, animes e doramas utilizando a SuperFlixAPI.

## Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **Zustand** - Gerenciamento de estado
- **Vitest** - Testes unitários
- **fast-check** - Testes baseados em propriedades

## Começando

Primeiro, instale as dependências:

```bash
npm install
```

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## Configuração Inicial

1. Clone o repositório
2. Instale as dependências: `npm install --legacy-peer-deps`
3. Configure as variáveis de ambiente: `npm run setup`
4. Inicie o servidor: `npm run dev`

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter
- `npm test` - Executa os testes
- `npm run test:watch` - Executa os testes em modo watch
- `npm run setup` - Configura variáveis de ambiente

## Estrutura do Projeto

```
nicaoflix/
├── app/                    # App Router do Next.js
├── components/             # Componentes React
│   ├── ui/                # Componentes de UI reutilizáveis
│   ├── layout/            # Componentes de layout
│   ├── content/           # Componentes de conteúdo
│   └── player/            # Componentes do player
├── lib/                   # Bibliotecas e utilitários
│   ├── api/              # Integração com API
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Funções utilitárias
│   └── types/            # Tipos TypeScript
└── public/               # Arquivos estáticos
```

## Deploy no Vercel

A aplicação está otimizada para deploy no Vercel com configuração automática.

### Deploy Rápido

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/nicaoflix)

### Deploy Manual

1. Crie uma conta no [Vercel](https://vercel.com)
2. Importe o repositório do GitHub
3. Configure as variáveis de ambiente (veja `.env.production.example`)
4. Clique em "Deploy"

### Variáveis de Ambiente Necessárias

```env
NEXT_PUBLIC_API_BASE_URL=https://superflixapi.run
NEXT_PUBLIC_SITE_URL=https://seu-dominio.vercel.app
NODE_ENV=production
```

Para mais detalhes, consulte:
- [VERCEL_QUICKSTART.md](./VERCEL_QUICKSTART.md) - Guia rápido de deploy
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guia completo de deployment
- [MONITORING.md](./MONITORING.md) - Monitoramento e analytics

## Recursos

### Performance
- ⚡ Next.js 14 com App Router
- 🖼️ Otimização automática de imagens
- 📦 Code splitting e lazy loading
- 🔄 Service Worker para cache offline
- 🚀 ISR (Incremental Static Regeneration)

### Acessibilidade
- ♿ WCAG AA compliant
- ⌨️ Navegação completa por teclado
- 📱 Suporte a screen readers
- 🎨 Alto contraste de cores

### Monitoramento
- 📊 Vercel Analytics integrado
- ⚡ Speed Insights para Core Web Vitals
- 🐛 Error tracking e logging
- 📈 Performance monitoring
