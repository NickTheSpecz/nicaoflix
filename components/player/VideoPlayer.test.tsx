import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VideoPlayer } from './VideoPlayer';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    back: vi.fn(),
    push: vi.fn(),
  }),
}));

describe('VideoPlayer', () => {
  it('renders iframe with correct movie URL', () => {
    render(
      <VideoPlayer
        type="movie"
        id="tt1234567"
      />
    );

    const iframe = screen.getByTitle('Movie Player');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', 'https://superflixapi.run/filme/tt1234567');
  });

  it('renders iframe with correct series URL', () => {
    render(
      <VideoPlayer
        type="serie"
        id="12345"
        season={1}
        episode={5}
      />
    );

    const iframe = screen.getByTitle('Episode Player');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', 'https://superflixapi.run/serie/12345/1/5');
  });

  it('applies customization parameters to URL', () => {
    render(
      <VideoPlayer
        type="serie"
        id="12345"
        season={2}
        episode={3}
        customization={{
          hideEpisodeList: true,
          primaryColor: 'ff0000',
          hideLink: true,
        }}
      />
    );

    const iframe = screen.getByTitle('Episode Player');
    const src = iframe.getAttribute('src');
    
    expect(src).toContain('noEpList=true');
    expect(src).toContain('color=ff0000');
    expect(src).toContain('noLink=true');
  });

  it('renders close button', () => {
    render(
      <VideoPlayer
        type="movie"
        id="tt1234567"
      />
    );

    const closeButton = screen.getByLabelText('Close player');
    expect(closeButton).toBeInTheDocument();
  });

  it('has proper iframe attributes for fullscreen and permissions', () => {
    render(
      <VideoPlayer
        type="movie"
        id="tt1234567"
      />
    );

    const iframe = screen.getByTitle('Movie Player');
    expect(iframe).toHaveAttribute('allowFullScreen');
    expect(iframe).toHaveAttribute('allow');
  });
});
