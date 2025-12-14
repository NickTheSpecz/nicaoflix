# Navigation System Documentation

## Overview

The NicãoFlix navigation system provides a responsive, accessible navigation experience that adapts to different device types including mobile, tablet, desktop, and TV.

## Components

### PageLayout

The main layout wrapper that automatically selects the appropriate navigation based on device type.

```tsx
import { PageLayout } from '@/components/layout';

<PageLayout onSearch={handleSearch} showSearch={true}>
  {/* Your page content */}
</PageLayout>
```

**Props:**
- `children`: ReactNode - Page content
- `showSearch?`: boolean - Whether to show search bar (default: true)
- `onSearch?`: (query: string) => void - Search callback

### Navbar (Desktop/Tablet)

Horizontal navigation bar for desktop and tablet devices.

**Features:**
- Logo with link to home
- Navigation links with icons
- Active page highlighting
- Integrated search bar
- Keyboard accessible
- Focus indicators

### BottomNav (Mobile)

Bottom navigation bar optimized for mobile devices.

**Features:**
- Icon-based navigation
- Active page highlighting
- Touch-optimized tap targets
- Compact design
- Accessibility labels

### TVNavigation

TV-optimized navigation with D-pad support.

**Features:**
- Large, easy-to-read text and icons
- D-pad navigation (arrow keys)
- Visual focus indicators
- Enter key to navigate
- Automatic focus management

## Hooks

### useDeviceDetection

Detects device type and orientation.

```tsx
import { useDeviceDetection } from '@/lib/hooks';

const { type, orientation, isTouchDevice, isTV } = useDeviceDetection();
```

**Returns:**
- `type`: 'mobile' | 'tablet' | 'desktop' | 'tv'
- `orientation`: 'portrait' | 'landscape'
- `isTouchDevice`: boolean
- `isTV`: boolean

### useKeyboardNavigation

Provides keyboard navigation support.

```tsx
import { useKeyboardNavigation } from '@/lib/hooks';

const ref = useKeyboardNavigation({
  onEnter: () => console.log('Enter pressed'),
  onEscape: () => console.log('Escape pressed'),
  onArrowUp: () => console.log('Up pressed'),
  // ... other handlers
});

<div ref={ref}>Content</div>
```

### useFocusManagement

Manages focus within a container for TV/keyboard navigation.

```tsx
import { useFocusManagement } from '@/lib/hooks';

const containerRef = useRef<HTMLDivElement>(null);
useFocusManagement(containerRef);

<div ref={containerRef}>
  {/* Focusable elements */}
</div>
```

## Device-Specific Behavior

### Mobile (< 768px)
- Bottom navigation bar
- No search in navigation (can be added to page content)
- Touch-optimized

### Tablet (768px - 1024px)
- Top navigation bar
- Integrated search
- Hybrid touch/mouse support

### Desktop (> 1024px)
- Full navigation bar
- Integrated search
- Mouse and keyboard support

### TV (detected by user agent or large screen without touch)
- Large navigation elements
- D-pad navigation
- Enhanced focus indicators
- Automatic focus management

## Keyboard Navigation

All navigation components support keyboard navigation:

- **Tab**: Move between focusable elements
- **Enter**: Activate link/button
- **Arrow Keys**: Navigate between items (TV mode)
- **Escape**: Close modals/overlays

## Accessibility

All navigation components follow WCAG 2.1 AA guidelines:

- Semantic HTML elements
- ARIA labels and roles
- Keyboard accessible
- Focus indicators
- Screen reader support
- Sufficient color contrast

## Styling

Navigation components use Tailwind CSS with design tokens from `globals.css`:

- Primary color: `--primary` (#e50914)
- Background: `--background` (#141414)
- Surface: `--surface` (#1f1f1f)
- Text colors: `--text-primary`, `--text-secondary`

## Examples

See `PageLayout.example.tsx` for complete usage examples.

## Requirements Validation

This navigation system validates the following requirements:

- **6.1**: Responsive layout adaptation for mobile devices
- **6.2**: TV-optimized navigation with remote control support
- **6.3**: Desktop layout with expanded space usage
- **6.4**: Automatic orientation detection and layout adjustment
