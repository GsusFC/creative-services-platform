import type { Config } from "tailwindcss";
import { colors } from './src/styles/colors'

export default {
  darkMode: 'class',
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-50% - 3rem))' }
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'rotate-rgb': {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        },
        'rotate-glow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'ripple': {
          'to': { transform: 'scale(4)', opacity: '0' },
        },
      },
      animation: {
        scroll: 'scroll 40s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'rotate-rgb': 'rotate-rgb 6s linear infinite',
        'rotate-glow': 'rotate-glow 8s linear infinite',
        'ripple': 'ripple 0.6s linear',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: colors.primary,
        gray: colors.gray,
        'rgb-red': 'rgb(255, 0, 0)',
        'rgb-green': 'rgb(0, 255, 0)',
        'rgb-blue': 'rgb(0, 0, 255)',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Field Mapper V4 - Jerarquía visual refinada
        'notion-bg': '#0F0A0A',
        'notion-active': '#B22222',
        'notion-border': 'rgba(139, 0, 0, 0.3)',
        'notion-shadow': 'rgba(255, 0, 0, 0.1)',
        'notion-hover': '#C24242',
        
        'case-study-bg': '#0A0F0A',
        'case-study-active': '#228B22', 
        'case-study-border': 'rgba(0, 100, 0, 0.3)',
        'case-study-shadow': 'rgba(0, 255, 0, 0.1)',
        'case-study-hover': '#42A442',
        
        'summary-bg': '#0A0A0F',
        'summary-active': '#4169E1',
        'summary-border': 'rgba(0, 0, 139, 0.3)',
        'summary-shadow': 'rgba(0, 0, 255, 0.1)',
        'summary-hover': '#6189E1',
      },
      fontFamily: {
        'geist-mono': ['Geist Mono', 'monospace'],
        'druk': ['var(--font-druk-text-wide)', 'sans-serif'],
        sans: ['Geist', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
} satisfies Config;
