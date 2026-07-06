# Puls — Mobile App

React Native + Expo mobile app for Puls, a Romanian & EU news aggregator
with gamification, personalization, and emoji reactions.

## Tech stack

- **Framework:** React Native + Expo (managed workflow)
- **Navigation:** Expo Router (file-based routing)
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **Data fetching:** TanStack React Query
- **Auth storage:** expo-secure-store (iOS Keychain / Android Keystore)
- **i18n:** i18n-js + expo-localization (English + Romanian)
- **Platforms:** iOS, Android, Web

## Project structure

```
app/
  (tabs)/           Tab screens — Feed, Saved, Profile
  auth/             Login, Signup, Forgot password, Reset password
  article/[id].tsx  Article detail screen
  settings/         Outlet settings screen
api/                API client and endpoint modules
components/         Reusable UI components
context/            AuthContext, LanguageContext
hooks/              React Query hooks
i18n/               EN + RO translations
types/              TypeScript types mirroring the backend
```

## Prerequisites

- Node.js 20+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Xcode) or Android Emulator (Android Studio) for native testing
- The Puls backend running (see [puls-backend](../puls-backend))

## Setup

```bash
npm install
cp .env.example .env  # if applicable, or set EXPO_PUBLIC_API_URL
```

Start the dev server:
```bash
npx expo start
```

Then press:
- `i` — iOS Simulator
- `a` — Android Emulator
- `w` — Web browser
- Scan the QR code with **Expo Go** on your phone

## Environment

The app reads the backend URL from `app.config.ts`:

```typescript
extra: {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3089',
}
```

For local development on a **physical device** (not simulator), set your
machine's LAN IP:
```bash
EXPO_PUBLIC_API_URL=http://192.168.x.x:3089 npx expo start
```

Find your LAN IP on macOS:
```bash
ipconfig getifaddr en0
```

## Features

- **Feed** — RSS-aggregated articles from Romanian and EU outlets
- **Personalized feed** — opt-out outlet muting (everything on by default)
- **Article detail** — summary, reactions, save button, share, read full article
- **Saved articles** — read-later with offline-friendly cache
- **Emoji reactions** — 5 emoji types with live counts
- **Auth** — signup, login, forgot/reset password
- **Gamification** — XP per read (8s dwell time), daily streaks, level system, badges
- **i18n** — English and Romanian, auto-detected from device, switchable in Profile
- **Outlet settings** — toggle individual outlets on/off

## i18n

The app auto-detects the device language on first launch and falls back
to English if neither EN nor RO is detected. Users can switch manually
in Profile → Language.

To add a new language:
1. Create `i18n/[locale].ts` matching the structure of `i18n/en.ts`
2. Import and register it in `i18n/index.ts`
3. Add the locale option to `LanguageContext.tsx`

## Building for distribution

This project uses [EAS Build](https://docs.expo.dev/build/introduction/):

```bash
npm install -g eas-cli
eas login
eas build --platform ios
eas build --platform android
```

Configure `eas.json` with your build profiles before running.

## Scripts

```bash
npx expo start          # Start dev server
npx expo start -c       # Start with cleared cache
npx expo start --ios    # Start and open iOS Simulator
npx expo start --android # Start and open Android Emulator
```