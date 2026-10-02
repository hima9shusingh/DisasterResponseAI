/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E40AF', // Primary Blue
          light: '#3B82F6',
          dark: '#1E3A8A',
        },
        emergency: {
          DEFAULT: '#EF4444', // Emergency Red
          light: '#F87171',
          dark: '#B91C1C',
        },
        warning: {
          DEFAULT: '#F59E0B', // Warning Orange
          light: '#FBBF24',
          dark: '#D97706',
        },
        success: {
          DEFAULT: '#10B981', // Success Green
          light: '#34D399',
          dark: '#047857',
        },
        neutral: {
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280', // Neutral Gray
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        }
      },
      boxShadow: {
        soft: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      }
    },
  },
  plugins: [],
}
