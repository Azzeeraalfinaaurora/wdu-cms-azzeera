/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "inverse-primary": "#78dc77",
        "secondary-container": "#c3eec0",
        "primary": "#006e1c",
        "surface": "var(--surface)",
        "tertiary": "#a63360",
        "primary-container": "var(--primary-container)",
        "inverse-on-surface": "#eff1ef",
        "secondary-fixed": "#c3eec0",
        "on-secondary-fixed-variant": "#2b4f2d",
        "on-surface": "var(--on-surface)",
        "secondary-fixed-dim": "#a8d1a5",
        "outline-variant": "var(--outline-variant)",
        "on-primary": "#ffffff",
        "surface-container-low": "var(--surface-container-low)",
        "primary-fixed": "#94f990",
        "inverse-surface": "#2e3130",
        "surface-bright": "#f8faf8",
        "surface-dim": "#d8dad9",
        "surface-tint": "#006e1c",
        "on-tertiary": "#ffffff",
        "on-surface-variant": "var(--on-surface-variant)",
        "error": "#ba1a1a",
        "tertiary-container": "#f26f9d",
        "on-secondary-container": "#486d48",
        "on-primary-fixed": "#002204",
        "on-tertiary-container": "#690034",
        "on-tertiary-fixed-variant": "#861948",
        "outline": "var(--outline)",
        "on-secondary-fixed": "#002106",
        "on-background": "#191c1b",
        "error-container": "#ffdad6",
        "surface-container-lowest": "var(--surface-container-lowest)",
        "surface-container-highest": "#e1e3e1",
        "surface-container-high": "var(--surface-container-high)",
        "surface-container": "#eceeec",
        "tertiary-fixed-dim": "#ffb1c7",
        "primary-fixed-dim": "#78dc77",
        "on-error": "#ffffff",
        "surface-variant": "#e1e3e1",
        "on-secondary": "#ffffff",
        "on-error-container": "#93000a",
        "on-primary-container": "#ffffff",
        "on-tertiary-fixed": "#3e001c",
        "tertiary-fixed": "#ffd9e2",
        "secondary": "#426743",
        "on-primary-fixed-variant": "#005313",
        "background": "#f8faf8"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      fontFamily: {
        "headline": ["Inter", "Manrope", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"],
        "inter": ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
}