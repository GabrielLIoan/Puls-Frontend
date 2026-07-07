/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Light mode
        brand: '#FF5A5F',
        ink: '#1A1A1A',
        muted: '#6B7280',
        // Dark mode overrides
        'brand-dark': '#FF7A7F',   // slightly lighter for dark backgrounds
        'ink-dark': '#F9FAFB',     // near-white for dark mode text
        'muted-dark': '#9CA3AF',   // lighter muted for dark mode
        // Dark surfaces
        'surface-dark': '#1F2937', // card/panel background in dark mode
        'bg-dark': '#111827',      // page background in dark mode (gray-900)
        'border-dark': '#374151',  // borders in dark mode
      },
    },
  },
  plugins: [],
};