import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Legacy (compat)
        brand: {
          DEFAULT: "#0A2342",
          light: "#1B4F8A",
          accent: "#E8C547",
          danger: "#C0392B",
        },
        // WC2026 Dark Theme
        wc: {
          bg:      "#0A0F1E",  // base background
          surface: "#0F1829",  // sections
          card:    "#141F35",  // cards
          border:  "#1E2D4A",  // subtle borders
          text:    "#F0F4FF",  // primary text
          muted:   "#64748B",  // secondary text
          accent:  "#E8C547",  // gold
          red:     "#EF4444",  // énergie
          green:   "#10B981",  // terrain
        },
      },
      fontFamily: {
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-barlow)", "system-ui", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-12px)" },
        },
        "glow-pulse": {
          "0%, 100%": { filter: "drop-shadow(0 0 6px rgba(232,197,71,0.4))" },
          "50%":       { filter: "drop-shadow(0 0 18px rgba(232,197,71,0.8))" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "slide-up": {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        float:      "float 3.5s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2.5s ease-in-out infinite",
        shimmer:    "shimmer 2.5s linear infinite",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "fade-in":  "fade-in 0.4s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
      },
      backgroundImage: {
        "wc-gradient": "linear-gradient(135deg, #0A0F1E 0%, #0F1829 50%, #0A0F1E 100%)",
        "gold-shimmer": "linear-gradient(90deg, transparent 0%, rgba(232,197,71,0.15) 50%, transparent 100%)",
        "hero-radial":  "radial-gradient(ellipse at 50% 50%, rgba(232,197,71,0.08) 0%, transparent 70%)",
      },
      boxShadow: {
        gold:    "0 0 20px rgba(232,197,71,0.3)",
        "gold-lg": "0 0 40px rgba(232,197,71,0.4)",
        card:    "0 4px 24px rgba(0,0,0,0.4)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(232,197,71,0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
