import { useColorScheme as useRNColorScheme } from 'react-native';
import { useThemeStore } from '@/lib/store/useThemeStore';

export function useColorScheme() {
  const systemColorScheme = useRNColorScheme();
  const { theme } = useThemeStore();

  if (theme === 'system') {
    return systemColorScheme;
  }

  return theme;
}
