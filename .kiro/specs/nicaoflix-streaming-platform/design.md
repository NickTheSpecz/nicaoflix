# Design Document - NicãoFlix

## Overview

NicãoFlix é uma aplicação web moderna de streaming construída com Next.js 14, React e TypeScript, utilizando a SuperFlixAPI como backend. A arquitetura prioriza performance, responsividade e experiência visual premium, com deploy otimizado para Vercel.

A aplicação seguirá o padrão de SPA (Single Page Application) com Server-Side Rendering (SSR) para SEO e performance inicial, utilizando App Router do Next.js 14 para roteamento e Tailwind CSS para estilização.

## Architecture

### Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS + CSS Modules
- **State Management**: React Context API + Zustand (para estado global leve)
- **Data Fetching**: Native Fetch API com cache do Next.js
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel

### Application Structure

```
nicaoflix/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   ├── filmes/
│   │   └── page.tsx              # Movies catalog
│   ├── series/
│   │   └── page.tsx              # Series catalog
│   ├── animes/
│   │   └── page.tsx              # Animes catalog
│   ├── doramas/
│   │   └── page.tsx              # Doramas catalog
│   ├── kids/
│   │   └── page.tsx              # Kids content
│   ├── detalhes/
│   │   └── [type]/[id]/
│   │       └── page.tsx          # Content details
│   └── assistir/
│       └── [type]/[id]/
│           └── page.tsx          # Player page
├── components/
│   ├── ui/                        # Reusable UI components
│   ├── layout/                    # Layout components
│   ├── content/                   # Content-specific components
│   └── player/                    # Video player components
├── lib/
│   ├── api/                       # API integration
│   ├── hooks/                     # Custom React hooks
│   ├── utils/                     # Utility functions
│   └── types/                     # TypeScript types
└── public/
    └── assets/                    # Static assets
```

## Components and Interfaces

### Core Components

#### 1. ContentCard
Exibe um item de conteúdo (filme, série, anime, dorama) com poster, título e informações básicas.

**Props:**
```typescript
interface ContentCardProps {
  id: string;
  type: 'movie' | 'serie' | 'anime' | 'dorama';
  title: string;
  posterPath: string;
  year?: number;
  rating?: number;
}
```

#### 2. ContentGrid
Grid responsivo que organiza múltiplos ContentCards.

**Props:**
```typescript
interface ContentGridProps {
  items: ContentItem[];
  loading?: boolean;
  columns?: { mobile: number; tablet: number; desktop: number };
}
```

#### 3. SearchBar
Barra de pesquisa com filtro em tempo real.

**Props:**
```typescript
interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}
```

#### 4. CategoryFilter
Filtros de categoria com visual moderno.

**Props:**
```typescript
interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}
```

#### 5. VideoPlayer
Wrapper para o iframe da SuperFlixAPI com controles customizados.

**Props:**
```typescript
interface VideoPlayerProps {
  type: 'movie' | 'serie';
  id: string;
  season?: number;
  episode?: number;
  customization?: PlayerCustomization;
}
```

#### 6. ContentDetails
Página de detalhes com informações completas do conteúdo.

**Props:**
```typescript
interface ContentDetailsProps {
  content: ContentDetail;
  seasons?: Season[];
  onPlay: () => void;
}
```

#### 7. EpisodeList
Lista de episódios para séries/animes.

**Props:**
```typescript
interface EpisodeListProps {
  episodes: Episode[];
  currentEpisode?: number;
  onEpisodeSelect: (episode: number) => void;
}
```

#### 8. HeroSection
Banner hero na página inicial com conteúdo em destaque.

**Props:**
```typescript
interface HeroSectionProps {
  featuredContent: ContentItem;
  onPlayClick: () => void;
}
```

## Data Models

### ContentItem
```typescript
interface ContentItem {
  id: string;
  tmdbId?: string;
  imdbId?: string;
  type: 'movie' | 'serie' | 'anime' | 'dorama';
  title: string;
  originalTitle?: string;
  posterPath: string;
  backdropPath?: string;
  overview?: string;
  releaseDate?: string;
  rating?: number;
  genres?: string[];
  isKidsFriendly?: boolean;
}
```

### ContentDetail
```typescript
interface ContentDetail extends ContentItem {
  runtime?: number;
  status?: string;
  tagline?: string;
  cast?: CastMember[];
  director?: string;
  seasons?: Season[];
  totalSeasons?: number;
  totalEpisodes?: number;
}
```

### Season
```typescript
interface Season {
  seasonNumber: number;
  name: string;
  episodeCount: number;
  airDate?: string;
  posterPath?: string;
  episodes?: Episode[];
}
```

### Episode
```typescript
interface Episode {
  episodeNumber: number;
  seasonNumber: number;
  name: string;
  overview?: string;
  airDate?: string;
  stillPath?: string;
  runtime?: number;
}
```

### CastMember
```typescript
interface CastMember {
  name: string;
  character?: string;
  profilePath?: string;
}
```

### Category
```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}
```

### PlayerCustomization
```typescript
interface PlayerCustomization {
  hideEpisodeList?: boolean;
  primaryColor?: string;
  hideLink?: boolean;
  transparent?: boolean;
  hideBackground?: boolean;
}
```

## API Integration

### SuperFlixAPI Service

```typescript
class SuperFlixAPIService {
  private baseURL = 'https://superflixapi.run';
  
  // Get all IDs for a category
  async getContentList(category: 'movie' | 'serie' | 'anime', type: 'tmdb' | 'imdb' = 'tmdb'): Promise<string[]>
  
  // Get movie details
  async getMovieDetails(imdbId: string): Promise<ContentDetail>
  
  // Get series details
  async getSeriesDetails(tmdbId: string): Promise<ContentDetail>
  
  // Get season details
  async getSeasonDetails(tmdbId: string, seasonNumber: number): Promise<Season>
  
  // Get episode details
  async getEpisodeDetails(tmdbId: string, seasonNumber: number, episodeNumber: number): Promise<Episode>
  
  // Get calendar data
  async getCalendar(): Promise<CalendarItem[]>
  
  // Generate player URL
  generatePlayerURL(type: 'movie' | 'serie', id: string, season?: number, episode?: number, customization?: PlayerCustomization): string
}
```

### Caching Strategy

- **Static Generation**: Páginas de catálogo com revalidação a cada 1 hora
- **Incremental Static Regeneration (ISR)**: Páginas de detalhes com revalidação a cada 30 minutos
- **Client-side Cache**: Zustand persist para dados frequentemente acessados
- **API Route Caching**: Next.js cache headers para otimizar requisições

## Design System

### Color Palette

```css
/* Primary Colors */
--primary: #e50914;        /* Netflix-inspired red */
--primary-dark: #b20710;
--primary-light: #ff1a24;

/* Neutral Colors */
--background: #141414;
--surface: #1f1f1f;
--surface-light: #2a2a2a;
--text-primary: #ffffff;
--text-secondary: #b3b3b3;
--text-muted: #808080;

/* Accent Colors */
--accent-blue: #0071eb;
--accent-green: #46d369;
--accent-yellow: #ffd700;

/* Semantic Colors */
--success: #46d369;
--error: #e50914;
--warning: #ffd700;
--info: #0071eb;
```

### Typography

```css
/* Font Family */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-display: 'Poppins', sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

### Spacing System

```css
/* Spacing Scale (Tailwind-based) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Breakpoints

```css
/* Responsive Breakpoints */
--mobile: 640px;
--tablet: 768px;
--desktop: 1024px;
--wide: 1280px;
--ultrawide: 1536px;
```

### Animation Tokens

```css
/* Transitions */
--transition-fast: 150ms ease-in-out;
--transition-base: 250ms ease-in-out;
--transition-slow: 350ms ease-in-out;

/* Easing Functions */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
```

## User Interface Patterns

### Navigation

- **Desktop**: Horizontal navbar com logo, links de categoria e busca
- **Mobile**: Bottom navigation bar com ícones principais
- **TV**: Navegação otimizada para D-pad com foco visual claro

### Content Discovery

- **Hero Banner**: Conteúdo em destaque com backdrop full-width
- **Carrosséis Horizontais**: Scroll horizontal por categoria
- **Grid View**: Grid responsivo para páginas de categoria
- **Infinite Scroll**: Carregamento progressivo de conteúdo

### Visual Effects

- **Hover States**: Scale up (1.05) + shadow elevation
- **Loading States**: Skeleton screens com shimmer effect
- **Transitions**: Fade in/out para mudanças de página
- **Parallax**: Efeito parallax no hero banner
- **Blur Effects**: Backdrop blur em modals e overlays



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Content display completeness
*For any* content item rendered in the UI, the display SHALL include poster image, title, and basic information fields.
**Validates: Requirements 1.2**

### Property 2: Search result accuracy
*For any* search query string, all displayed results SHALL contain the query string in their title or metadata.
**Validates: Requirements 2.1**

### Property 3: Search clear restoration
*For any* catalog state, performing a search followed by clearing the search field SHALL restore the original catalog state.
**Validates: Requirements 2.4**

### Property 4: Cross-category search coverage
*For any* search query, the results SHALL include matches from all content categories (movies, series, animes, doramas) when matches exist.
**Validates: Requirements 2.5**

### Property 5: Category filter exclusivity
*For any* selected category filter, all displayed content items SHALL belong exclusively to that category.
**Validates: Requirements 3.1**

### Property 6: Kids content safety
*For any* content displayed in the Kids section, the isKidsFriendly property SHALL be true.
**Validates: Requirements 3.2**

### Property 7: Filter removal restoration
*For any* filtered catalog state, removing the active filter SHALL restore the display of all categories.
**Validates: Requirements 3.5**

### Property 8: Details page completeness
*For any* content item, the details page SHALL display synopsis, cast, year, and rating information.
**Validates: Requirements 4.1**

### Property 9: Series season display
*For any* series content type, the details page SHALL include the list of available seasons and episodes.
**Validates: Requirements 4.2**

### Property 10: API ID correctness
*For any* content details request, the system SHALL construct the SuperFlixAPI URL using the appropriate ID type (TMDB for series/animes, IMDb for movies).
**Validates: Requirements 4.3**

### Property 11: Season navigation availability
*For any* series with multiple seasons, the details page SHALL provide navigation controls between seasons.
**Validates: Requirements 4.5**

### Property 12: Movie player URL correctness
*For any* movie content, the generated player URL SHALL follow the format `https://superflixapi.run/filme/{imdbId}`.
**Validates: Requirements 5.1**

### Property 13: Episode player URL correctness
*For any* episode selection with season S and episode E, the generated player URL SHALL follow the format `https://superflixapi.run/serie/{tmdbId}/{S}/{E}`.
**Validates: Requirements 5.2**

### Property 14: Player URL format validation
*For any* generated player URL, the format SHALL match the SuperFlixAPI specification pattern.
**Validates: Requirements 5.3**

### Property 15: Content synchronization detection
*For any* new content ID returned by the SuperFlixAPI /lista endpoint, the content SHALL appear in the catalog after synchronization completes.
**Validates: Requirements 8.1**

### Property 16: Episode update reflection
*For any* series with new episodes added to the API, the catalog SHALL reflect the updated episode count after synchronization.
**Validates: Requirements 8.4**

### Property 17: Loading state visibility
*For any* content loading operation, a loading indicator SHALL be visible in the UI during the fetch operation.
**Validates: Requirements 1.4**

## Error Handling

### API Error Handling

1. **Network Failures**
   - Implement exponential backoff retry logic (3 attempts)
   - Display user-friendly error messages
   - Fallback to cached data when available

2. **Invalid Content IDs**
   - Validate IDs before making API requests
   - Return 404 page for non-existent content
   - Log invalid ID attempts for monitoring

3. **Rate Limiting**
   - Implement request queuing
   - Cache responses aggressively
   - Display loading states during throttling

4. **Malformed API Responses**
   - Validate response structure with Zod schemas
   - Provide default values for missing fields
   - Log schema validation errors

### User Input Validation

1. **Search Input**
   - Sanitize search queries to prevent XSS
   - Limit query length to 100 characters
   - Debounce input to reduce API calls

2. **Navigation Parameters**
   - Validate route parameters (type, id, season, episode)
   - Redirect to home on invalid parameters
   - Type-check all URL parameters

### State Management Errors

1. **Hydration Mismatches**
   - Use suppressHydrationWarning for dynamic content
   - Ensure server and client render consistency
   - Handle client-only features gracefully

2. **State Corruption**
   - Implement state validation on updates
   - Provide reset mechanisms for corrupted state
   - Use TypeScript strict mode for type safety

## Testing Strategy

### Unit Testing

**Framework**: Vitest + React Testing Library

**Coverage Areas**:
- Component rendering with various props
- User interaction handlers (clicks, inputs)
- Utility functions (URL generation, data transformation)
- API service methods with mocked responses
- Custom hooks behavior

**Example Tests**:
- ContentCard renders with all required props
- SearchBar debounces input correctly
- generatePlayerURL creates correct URLs for movies and series
- CategoryFilter highlights active category

### Property-Based Testing

**Framework**: fast-check (JavaScript property-based testing library)

**Configuration**: Each property test SHALL run a minimum of 100 iterations to ensure comprehensive coverage across the input space.

**Test Tagging**: Each property-based test MUST include a comment tag in the format:
`// Feature: nicaoflix-streaming-platform, Property {number}: {property_text}`

**Coverage Areas**:
- Search filtering with random query strings
- Category filtering with random content sets
- URL generation with random IDs and parameters
- Content display with random content items
- State transitions (filter → unfilter, search → clear)

### Integration Testing

**Framework**: Playwright

**Coverage Areas**:
- End-to-end user flows (browse → details → watch)
- Navigation between pages
- Responsive behavior across viewports
- API integration with real endpoints (staging)

### Visual Regression Testing

**Framework**: Playwright + Percy

**Coverage Areas**:
- Component visual consistency
- Responsive layouts at different breakpoints
- Theme and color application
- Animation states

### Performance Testing

**Tools**: Lighthouse CI, Web Vitals

**Metrics**:
- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- Time to Interactive (TTI) < 3.5s
- Cumulative Layout Shift (CLS) < 0.1

## Deployment Strategy

### Vercel Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

### Environment Variables

```
NEXT_PUBLIC_API_BASE_URL=https://superflixapi.run
NEXT_PUBLIC_SITE_URL=https://nicaoflix.vercel.app
```

### Build Optimization

- Enable Next.js Image Optimization
- Configure SWC minification
- Enable gzip/brotli compression
- Implement code splitting by route
- Use dynamic imports for heavy components

### Caching Strategy

- Static pages: Cache-Control: public, max-age=3600, s-maxage=3600
- API routes: Cache-Control: public, max-age=1800, stale-while-revalidate=3600
- Images: Cache-Control: public, max-age=31536000, immutable

### Monitoring

- Vercel Analytics for performance metrics
- Error tracking with console logging
- API response time monitoring
- User interaction tracking (privacy-respecting)

## Security Considerations

1. **Content Security Policy (CSP)**
   - Allow iframe embeds only from superflixapi.run
   - Restrict script sources to self and CDN
   - Implement nonce-based inline script execution

2. **API Key Protection**
   - No API keys required (public API)
   - Rate limiting on client-side to prevent abuse
   - Server-side API routes for sensitive operations

3. **XSS Prevention**
   - Sanitize all user inputs
   - Use React's built-in XSS protection
   - Validate and escape dynamic content

4. **HTTPS Enforcement**
   - Enforce HTTPS in production
   - Set Strict-Transport-Security headers
   - Redirect HTTP to HTTPS

## Accessibility

1. **Keyboard Navigation**
   - All interactive elements accessible via keyboard
   - Visible focus indicators
   - Logical tab order

2. **Screen Reader Support**
   - Semantic HTML elements
   - ARIA labels for dynamic content
   - Alt text for all images

3. **Color Contrast**
   - WCAG AA compliance (4.5:1 for normal text)
   - High contrast mode support
   - Color-blind friendly palette

4. **Responsive Text**
   - Scalable font sizes (rem units)
   - Readable line lengths (45-75 characters)
   - Sufficient line height (1.5+)
