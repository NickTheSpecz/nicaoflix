/**
 * VideoPlayer Component Examples
 * 
 * This file demonstrates various usage patterns for the VideoPlayer component.
 * These examples are for documentation purposes and are not executed.
 */

import { VideoPlayer } from './VideoPlayer';

// Example 1: Basic movie player
export function MoviePlayerExample() {
  return (
    <VideoPlayer
      type="movie"
      id="tt1234567" // IMDb ID
    />
  );
}

// Example 2: Series episode player
export function SeriesPlayerExample() {
  return (
    <VideoPlayer
      type="serie"
      id="12345" // TMDB ID
      season={1}
      episode={5}
    />
  );
}

// Example 3: Player with customization options
export function CustomizedPlayerExample() {
  return (
    <VideoPlayer
      type="serie"
      id="12345"
      season={2}
      episode={3}
      customization={{
        hideEpisodeList: true,
        primaryColor: 'e50914', // Netflix red
        hideLink: true,
        transparent: false,
        hideBackground: false,
      }}
    />
  );
}

// Example 4: Player with custom close handler
export function PlayerWithCustomCloseExample() {
  const handleClose = () => {
    console.log('Player closed');
    // Custom close logic here
  };

  return (
    <VideoPlayer
      type="movie"
      id="tt9999999"
      onClose={handleClose}
    />
  );
}

// Example 5: Minimal episode list player
export function MinimalPlayerExample() {
  return (
    <VideoPlayer
      type="serie"
      id="67890"
      season={1}
      episode={1}
      customization={{
        hideEpisodeList: true,
        hideLink: true,
      }}
    />
  );
}

// Example 6: Themed player
export function ThemedPlayerExample() {
  return (
    <VideoPlayer
      type="movie"
      id="tt1111111"
      customization={{
        primaryColor: '0071eb', // Blue theme
        transparent: true,
      }}
    />
  );
}
