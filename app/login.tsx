import React, { useState } from 'react';
import { View, Text, Alert, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Request from '../lib/request';
import syncService from '../lib/syncService';
import { useAppStore } from '../store/useAppStore';
import { useLanguage } from '../contexts/LanguageContext';
import { APP_NAME } from '../data';
import { Button, Input } from '../components/ui';
import { theme } from '../theme';

const CACHED_CREDENTIALS_KEY = 'cachedCredentials';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();
  const setAuth = useAppStore((state) => state.setAuth);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error'), t('msg.fillAllFields'));
      return;
    }

    setLoading(true);
    try {
      const isOnline = await syncService.isOnline();

      if (isOnline) {
        // Online: authenticate with server
        const response = await Request.Post('/auth/login', { email, password });

        if (response.error) {
          Alert.alert(t('common.error'), response.error);
        } else {
          // Cache credentials for offline login (hash password for security)
          const hashedCredentials = {
            email: email.toLowerCase(),
            passwordHash: btoa(password), // Simple encoding (in production, use proper hashing)
            token: response.token,
            user: response.user
          };
          await AsyncStorage.setItem(CACHED_CREDENTIALS_KEY, JSON.stringify(hashedCredentials));

          await setAuth(response.token, response.user);
          router.replace('/');
        }
      } else {
        // Offline: check cached credentials
        const cachedData = await AsyncStorage.getItem(CACHED_CREDENTIALS_KEY);

        if (cachedData) {
          const cached = JSON.parse(cachedData);

          // Verify credentials match
          if (cached.email === email.toLowerCase() && cached.passwordHash === btoa(password)) {
            // Credentials match - allow offline login
            await setAuth(cached.token, cached.user);
            router.replace('/');
          } else {
            Alert.alert(t('common.error'), t('msg.invalidCredentials'));
          }
        } else {
          Alert.alert(t('msg.offline'), t('msg.noCachedCredentials'));
        }
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('msg.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoSection}>
          <Image
            source={require('../assets/mine.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.appTitle}>{APP_NAME}</Text>
          <Text style={styles.subtitle}>{t('app.name')}</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label={t('auth.email')}
            placeholder={t('auth.enterEmail')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon="mail-outline"
          />

          <Input
            label={t('auth.password')}
            placeholder={t('auth.enterPassword')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="lock-closed-outline"
          />

          <Button
            title={t('auth.signIn')}
            onPress={handleLogin}
            loading={loading}
            fullWidth
            size="lg"
          />

          <Button
            title={t('auth.createAccount')}
            onPress={() => router.push('/register')}
            variant="ghost"
            fullWidth
            size="md"
          />
        </View>

        <Text style={styles.footer}>{t('auth.poweredBy')}</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // White background
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl * 2,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: theme.spacing.lg,
  },
  appTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  formContainer: {
    width: '100%',
  },
  footer: {
    textAlign: 'center',
    fontSize: theme.fontSize.xs,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xl,
  },
});
