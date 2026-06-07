import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AccentColor = 'orange' | 'blue' | 'purple' | 'green' | 'pink';
export type ThemeVariant = 'dark' | 'midnight';
export type SidebarWidth = 'compact' | 'default' | 'wide';

interface ThemeState {
  accent: AccentColor;
  variant: ThemeVariant;
  sidebarWidth: SidebarWidth;
  setAccent: (accent: AccentColor) => void;
  setVariant: (variant: ThemeVariant) => void;
  setSidebarWidth: (w: SidebarWidth) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      accent: 'orange',
      variant: 'dark',
      sidebarWidth: 'default',
      setAccent: (accent) => set({ accent }),
      setVariant: (variant) => set({ variant }),
      setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),
    }),
    { name: 'gymflow-theme' }
  )
);

// CSS variable maps per accent
export const accentVars: Record<AccentColor, Record<string, string>> = {
  orange: {
    '--color-brand-400': '#fb923c',
    '--color-brand-500': '#f97316',
    '--color-brand-600': '#ea580c',
    '--color-brand-700': '#c2410c',
  },
  blue: {
    '--color-brand-400': '#60a5fa',
    '--color-brand-500': '#3b82f6',
    '--color-brand-600': '#2563eb',
    '--color-brand-700': '#1d4ed8',
  },
  purple: {
    '--color-brand-400': '#a78bfa',
    '--color-brand-500': '#8b5cf6',
    '--color-brand-600': '#7c3aed',
    '--color-brand-700': '#6d28d9',
  },
  green: {
    '--color-brand-400': '#34d399',
    '--color-brand-500': '#10b981',
    '--color-brand-600': '#059669',
    '--color-brand-700': '#047857',
  },
  pink: {
    '--color-brand-400': '#f472b6',
    '--color-brand-500': '#ec4899',
    '--color-brand-600': '#db2777',
    '--color-brand-700': '#be185d',
  },
};

export const variantVars: Record<ThemeVariant, Record<string, string>> = {
  dark: {
    '--color-bg-900': '#0a0a0f',
    '--color-bg-800': '#111118',
    '--color-bg-700': '#1a1a24',
    '--color-bg-600': '#22222f',
    '--color-bg-500': '#2d2d3d',
    '--color-bg-400': '#3d3d52',
  },
  midnight: {
    '--color-bg-900': '#050509',
    '--color-bg-800': '#0a0a12',
    '--color-bg-700': '#10101c',
    '--color-bg-600': '#17172a',
    '--color-bg-500': '#202038',
    '--color-bg-400': '#2d2d50',
  },
};

export function applyTheme(accent: AccentColor, variant: ThemeVariant) {
  const root = document.documentElement;
  const vars = { ...accentVars[accent], ...variantVars[variant] };
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}
