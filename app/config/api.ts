import { Platform } from 'react-native';

export const API_CONFIG = {
  BASE_URL: Platform.select({
    android: 'https://track-app-backend-0njr.onrender.com/api',
    ios: 'https://track-app-backend-0njr.onrender.com/api',
    web: 'https://track-app-backend-0njr.onrender.com/api',
    default: 'https://track-app-backend-0njr.onrender.com/api',
  }),
  TIMEOUT: 10000,
};
