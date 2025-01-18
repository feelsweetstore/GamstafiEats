import { atom } from 'jotai';

export const themeAtom = atom<'light' | 'dark'>('light');

export const colors = {
  primary: {
    light: '#8B5CF6', // Violet
    dark: '#7C3AED',
  },
  secondary: {
    light: '#EF4444', // Rouge
    dark: '#DC2626',
  },
  accent: {
    light: '#10B981', // Vert
    dark: '#059669',
  },
  background: {
    light: '#FFFFFF',
    dark: '#1F2937',
  },
  text: {
    light: '#1F2937',
    dark: '#F9FAFB',
  },
};