import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#EEF0E8",
        card: "#F8F8F2",
        ink: "#181A15",
        "ink-soft": "#5C5F52",
        line: "#D6D8C9",
        signal: "#2F3DCB",
        "signal-ink": "#1F2A99",
        "signal-tint": "#E3E6FB",
        amber: "#C97F0A",
        "amber-tint": "#FCE9C9",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        content: "1180px",
      },
    },
  },
  plugins: [],
};

export default config;
