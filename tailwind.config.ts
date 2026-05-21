import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1320px" },
    },
    extend: {
      colors: {
        bg: {
          DEFAULT: "hsl(var(--bg))",
          subtle: "hsl(var(--bg-subtle))",
          elevated: "hsl(var(--bg-elevated))",
        },
        ink: {
          DEFAULT: "hsl(var(--ink))",
          muted: "hsl(var(--ink-muted))",
          subtle: "hsl(var(--ink-subtle))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          muted: "hsl(var(--gold-muted))",
          dim: "hsl(var(--gold-dim))",
        },
        line: "hsl(var(--line))",
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        danger: "hsl(var(--danger))",
        info: "hsl(var(--info))",
        // shadcn-compatible aliases
        border: "hsl(var(--line))",
        input: "hsl(var(--line))",
        ring: "hsl(var(--gold))",
        background: "hsl(var(--bg))",
        foreground: "hsl(var(--ink))",
        primary: {
          DEFAULT: "hsl(var(--gold))",
          foreground: "hsl(var(--bg))",
        },
        secondary: {
          DEFAULT: "hsl(var(--bg-elevated))",
          foreground: "hsl(var(--ink))",
        },
        muted: {
          DEFAULT: "hsl(var(--bg-subtle))",
          foreground: "hsl(var(--ink-muted))",
        },
        accent: {
          DEFAULT: "hsl(var(--gold-dim))",
          foreground: "hsl(var(--ink))",
        },
        destructive: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(0 0% 100%)",
        },
        card: {
          DEFAULT: "hsl(var(--bg-elevated))",
          foreground: "hsl(var(--ink))",
        },
        popover: {
          DEFAULT: "hsl(var(--bg-elevated))",
          foreground: "hsl(var(--ink))",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "serif"],
        sans: ["var(--font-sans)", "DM Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, hsl(var(--gold)) 0%, hsl(45 70% 70%) 50%, hsl(var(--gold)) 100%)",
        "mesh-gold": "radial-gradient(ellipse 80% 50% at 50% -20%, hsla(43, 55%, 54%, 0.3), transparent), radial-gradient(ellipse 60% 50% at 80% 50%, hsla(43, 55%, 54%, 0.15), transparent)",
        "grain": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.25'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(40px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
        shimmer: "shimmer 2.5s linear infinite",
        marquee: "marquee 40s linear infinite",
        "pulse-ring": "pulse-ring 1.6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "gradient-x": "gradient-x 6s ease infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
