import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#e50914",
          dark: "#b20710",
          light: "#ff1a24",
        },
        background: "#141414",
        surface: {
          DEFAULT: "#1f1f1f",
          light: "#2a2a2a",
        },
        text: {
          primary: "#ffffff",
          secondary: "#b3b3b3",
          muted: "#808080",
        },
        accent: {
          blue: "#0071eb",
          green: "#46d369",
          yellow: "#ffd700",
        },
        success: "#46d369",
        error: "#e50914",
        warning: "#ffd700",
        info: "#0071eb",
      },
      fontFamily: {
        primary: ["Inter", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },
      spacing: {
        "1": "0.25rem",
        "2": "0.5rem",
        "3": "0.75rem",
        "4": "1rem",
        "6": "1.5rem",
        "8": "2rem",
        "12": "3rem",
        "16": "4rem",
      },
      transitionDuration: {
        fast: "150ms",
        base: "250ms",
        slow: "350ms",
      },
      transitionTimingFunction: {
        "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
        out: "cubic-bezier(0, 0, 0.2, 1)",
        in: "cubic-bezier(0.4, 0, 1, 1)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      animation: {
        shimmer:
          "shimmer 2s infinite linear",
      },
    },
  },
  plugins: [
    function ({ addUtilities }: any) {
      addUtilities({
        '.scrollbar-hide': {
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    },
  ],
};

export default config;
