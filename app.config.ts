import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Puls',
  slug: 'puls',
  scheme: 'puls',
  plugins: ['expo-secure-store', 'expo-localization'],
  extra: {
    // IMPORTANT: 'localhost' only resolves on iOS Simulator. For a
    // physical device on the same Wi-Fi, replace this with your
    // machine's LAN IP, e.g. http://192.168.1.42:3089 — find yours with
    // `ipconfig getifaddr en0` on macOS. Consider an env var here once
    // you have a staging/prod backend deployed.
    apiBaseUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3089',
  },
});