import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./scenes/**/*.{ts,tsx}", "./preview/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        stone: {
          50: "#faf8f4",
          100: "#f3efe6",
          200: "#e6dfd1",
          300: "#cfc4af",
          400: "#a8997f",
          500: "#7f705a",
          600: "#5f5343",
          700: "#463d32",
          800: "#2e2822",
          900: "#1c1915",
        },
        copper: {
          300: "#e9b98a",
          400: "#dc9a5e",
          500: "#c97f3d",
          600: "#a9652c",
        },
        pine: {
          500: "#4f6b4a",
          700: "#2f4330",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
