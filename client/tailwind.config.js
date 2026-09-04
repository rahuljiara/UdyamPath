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
          DEFAULT: '#2F8F78',
          hover: '#24715F',
          dark: '#1D5A4C',
          soft: '#E8F5F1',
          50: '#F0F9F6',
          100: '#E8F5F1',
          200: '#C7E7DC',
          300: '#94D0BF',
          400: '#5BB49D',
          500: '#2F8F78',
          600: '#24715F',
          700: '#1D5A4C',
          800: '#18483D',
          900: '#143C33',
        },
        background: '#F8FAFC',
        surface: '#FFFFFF',
        'text-primary': '#0F172A',
        'text-secondary': '#475569',
        'text-muted': '#64748B',
        'border-color': '#E2E8F0',
        status: {
          success: '#16A34A',
          'success-soft': '#DCFCE7',
          warning: '#D97706',
          'warning-soft': '#FEF3C7',
          danger: '#DC2626',
          'danger-soft': '#FEE2E2',
          info: '#0284C7',
          'info-soft': '#E0F2FE',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        dropdown: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
