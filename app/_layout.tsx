import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { authService } from '@/services/authService';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isOnboardingCompleted, isLoading, setIsLoading } = useAuthStore();

  useEffect(() => {
    // Initialize auth listener
    const unsubscribe = authService.initAuthListener();

    // Set loading to false after initial check
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/auth');
      } else if (!isOnboardingCompleted) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, isOnboardingCompleted, isLoading]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="wallets" />
        <Stack.Screen name="income" />
        <Stack.Screen name="expenses" />
        <Stack.Screen name="budgets" />
        <Stack.Screen name="goals" />
        <Stack.Screen name="emi-bills" />
        <Stack.Screen name="split-bills" />
        <Stack.Screen name="investments" />
        <Stack.Screen name="insurance" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="secret-wallet" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
