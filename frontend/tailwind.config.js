// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--sidebar-background) / <alpha-value>)",
        foreground: "hsl(var(--sidebar-foreground) / <alpha-value>)",
        primary: "hsl(var(--sidebar-primary) / <alpha-value>)",
        "primary-foreground":
          "hsl(var(--sidebar-primary-foreground) / <alpha-value>)",
        accent: "hsl(var(--sidebar-accent) / <alpha-value>)",
        "accent-foreground":
          "hsl(var(--sidebar-accent-foreground) / <alpha-value>)",
        border: "hsl(var(--sidebar-border) / <alpha-value>)",
        ring: "hsl(var(--sidebar-ring) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
