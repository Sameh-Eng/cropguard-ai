/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "secondary-fixed": "#b9f296",
        "on-primary": "#ffffff",
        "primary-fixed-dim": "#b5cdb0",
        "on-error": "#ffffff",
        "on-tertiary": "#ffffff",
        "primary-fixed": "#d0e9cb",
        "inverse-surface": "#32302b",
        "on-tertiary-fixed-variant": "#2f4f00",
        "primary": "#061907",
        "surface-container-highest": "#e7e2da",
        "on-background": "#1d1c17",
        "on-primary-container": "#7f977c",
        "on-error-container": "#93000a",
        "surface-tint": "#4e644c",
        "tertiary-fixed": "#c0f282",
        "on-primary-fixed": "#0c200d",
        "primary-container": "#1a2e1a",
        "tertiary": "#0b1900",
        "on-secondary-fixed-variant": "#215106",
        "on-secondary-container": "#3d6e23",
        "tertiary-fixed-dim": "#a4d569",
        "error": "#ba1a1a",
        "surface-container": "#f2ede5",
        "on-tertiary-fixed": "#102000",
        "inverse-on-surface": "#f5f0e8",
        "error-container": "#ffdad6",
        "surface-container-low": "#f8f3eb",
        "secondary-container": "#b6f094",
        "secondary": "#396a1f",
        "on-tertiary-container": "#719e38",
        "on-surface": "#1d1c17",
        "on-primary-fixed-variant": "#374c36",
        "surface-variant": "#e7e2da",
        "on-secondary": "#ffffff",
        "outline-variant": "#c3c8bf",
        "tertiary-container": "#1a2f00",
        "surface-dim": "#ded9d2",
        "on-secondary-fixed": "#082100",
        "outline": "#747871",
        "surface-container-high": "#ece8e0",
        "surface-bright": "#fef9f1",
        "surface-container-lowest": "#ffffff",
        "on-surface-variant": "#434841",
        "background": "#fef9f1",
        "inverse-primary": "#b5cdb0",
        "surface": "#fef9f1",
        "secondary-fixed-dim": "#9ed67d"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "unit": "8px",
        "container-max": "1280px",
        "gutter": "24px",
        "margin-mobile": "16px",
        "margin-desktop": "40px"
      },
      fontFamily: {
        "body-lg": ["Manrope"],
        "h1": ["Newsreader"],
        "label-caps": ["Manrope"],
        "h2": ["Newsreader"],
        "h3": ["Newsreader"],
        "body-md": ["Manrope"]
      },
      fontSize: {
        "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "h1": ["48px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "600"}],
        "label-caps": ["12px", {"lineHeight": "1.2", "letterSpacing": "0.05em", "fontWeight": "700"}],
        "h2": ["32px", {"lineHeight": "1.2", "fontWeight": "500"}],
        "h3": ["24px", {"lineHeight": "1.3", "fontWeight": "500"}],
        "body-md": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
