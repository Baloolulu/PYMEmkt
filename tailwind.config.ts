import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1240px" },
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B0F19",
          900: "#0B0F19",
          800: "#111726",
          700: "#182033",
          600: "#232D45",
          500: "#3A4560",
        },
        mist: "#F5F7FA",
        electric: {
          DEFAULT: "#2563EB",
          600: "#2563EB",
          500: "#3B82F6",
          400: "#60A5FA",
          300: "#93C5FD",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)",
        "grid-light":
          "linear-gradient(to right, rgba(11,15,25,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,15,25,0.06) 1px, transparent 1px)",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 3.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
