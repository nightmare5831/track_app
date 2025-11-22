import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppStore } from '../store/useAppStore';
import '../global.css';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, checkAuth } = useAppStore();

  useEffect(() => {
    // Check authentication status on mount
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated && segments[0] !== 'login' && segments[0] !== 'register') {
      // Redirect to login if not authenticated
      router.replace('/login');
    } else if (isAuthenticated && (segments[0] === 'login' || segments[0] === 'register')) {
      // Redirect to home after login
      router.replace('/');
    }
  }, [isAuthenticated, segments]);

  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="equipment" />
        <Stack.Screen name="operation" />
      </Stack>
    </>
  );
}

