import { describe, it, expect } from 'vitest';
import {
  getContrastRatio,
  meetsWCAGAA,
  formatDurationForScreenReader,
  formatRatingForScreenReader,
} from './accessibility';

describe('Accessibility Utilities', () => {
  describe('getContrastRatio', () => {
    it('should calculate correct contrast ratio for primary colors', () => {
      // Primary red on background - actual ratio is ~3.84:1
      // Note: This is below WCAG AA for normal text (4.5:1) but acceptable for large text (3:1)
      const ratio = getContrastRatio('#e50914', '#141414');
      expect(ratio).toBeGreaterThan(3.8);
      expect(ratio).toBeLessThan(4.0);
    });

    it('should calculate correct contrast ratio for white on black', () => {
      const ratio = getContrastRatio('#ffffff', '#000000');
      expect(ratio).toBe(21); // Maximum contrast ratio
    });

    it('should calculate correct contrast ratio for text colors', () => {
      // Text primary on background
      const ratio1 = getContrastRatio('#ffffff', '#141414');
      expect(ratio1).toBeGreaterThan(15);

      // Text secondary on background
      const ratio2 = getContrastRatio('#b3b3b3', '#141414');
      expect(ratio2).toBeGreaterThan(7);

      // Text muted on background
      const ratio3 = getContrastRatio('#808080', '#141414');
      expect(ratio3).toBeGreaterThan(4.5);
    });
  });

  describe('meetsWCAGAA', () => {
    it('should validate primary color meets WCAG AA for large text only', () => {
      // Primary red doesn't meet 4.5:1 for normal text, but meets 3:1 for large text
      expect(meetsWCAGAA('#e50914', '#141414', false)).toBe(false);
      expect(meetsWCAGAA('#e50914', '#141414', true)).toBe(true);
    });

    it('should validate text colors meet WCAG AA', () => {
      expect(meetsWCAGAA('#ffffff', '#141414', false)).toBe(true);
      expect(meetsWCAGAA('#b3b3b3', '#141414', false)).toBe(true);
      expect(meetsWCAGAA('#808080', '#141414', false)).toBe(true);
    });

    it('should validate accent colors', () => {
      expect(meetsWCAGAA('#ffd700', '#141414', false)).toBe(true); // Yellow - passes
      expect(meetsWCAGAA('#0071eb', '#141414', false)).toBe(false); // Blue - fails normal text
      expect(meetsWCAGAA('#0071eb', '#141414', true)).toBe(true); // Blue - passes large text
      expect(meetsWCAGAA('#46d369', '#141414', false)).toBe(true); // Green - passes
    });

    it('should use correct threshold for large text', () => {
      // A color that meets 3:1 but not 4.5:1
      const result = meetsWCAGAA('#959595', '#141414', true);
      expect(result).toBe(true);
    });

    it('should reject insufficient contrast', () => {
      // Very low contrast
      expect(meetsWCAGAA('#1a1a1a', '#141414', false)).toBe(false);
    });
  });

  describe('formatDurationForScreenReader', () => {
    it('should format minutes only', () => {
      expect(formatDurationForScreenReader(45)).toBe('45 minutos');
      expect(formatDurationForScreenReader(1)).toBe('1 minuto');
    });

    it('should format hours and minutes', () => {
      expect(formatDurationForScreenReader(125)).toBe('2 horas e 5 minutos');
      expect(formatDurationForScreenReader(60)).toBe('1 hora e 0 minutos');
      expect(formatDurationForScreenReader(61)).toBe('1 hora e 1 minuto');
    });

    it('should handle plural forms correctly', () => {
      expect(formatDurationForScreenReader(1)).toContain('minuto');
      expect(formatDurationForScreenReader(2)).toContain('minutos');
      expect(formatDurationForScreenReader(60)).toContain('hora');
      expect(formatDurationForScreenReader(120)).toContain('horas');
    });
  });

  describe('formatRatingForScreenReader', () => {
    it('should format rating with one decimal place', () => {
      expect(formatRatingForScreenReader(8.5)).toBe('Avaliação 8.5 de 10');
      expect(formatRatingForScreenReader(7.0)).toBe('Avaliação 7.0 de 10');
      expect(formatRatingForScreenReader(9.9)).toBe('Avaliação 9.9 de 10');
    });

    it('should handle integer ratings', () => {
      expect(formatRatingForScreenReader(8)).toBe('Avaliação 8.0 de 10');
      expect(formatRatingForScreenReader(10)).toBe('Avaliação 10.0 de 10');
    });
  });
});
