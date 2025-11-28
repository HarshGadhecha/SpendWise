import { create } from 'zustand';
import { ThemePreference } from '@/lib/types';
import { storage, STORAGE_KEYS } from '@/lib/store/storage';

interface ThemeState {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'system',

  setTheme: async (theme: ThemePreference) => {
    set({ theme });
    await storage.set(STORAGE_KEYS.THEME, theme);
  },

  loadTheme: async () => {
    const savedTheme = await storage.get<ThemePreference>(STORAGE_KEYS.THEME);
    if (savedTheme) {
      set({ theme: savedTheme });
    }
  },
}));
