# Zagadaj — Expo SDK 57

Mobilny prototyp **Zagadaj** działający w Expo Go i zorganizowany jak normalna aplikacja Expo Router.

## Uruchomienie

```bash
npm install
npx expo start
```

Następnie zeskanuj QR w Expo Go.

## Architektura

```text
app/
  _layout.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    reels.tsx
    coach.tsx
    progress.tsx
src/
  contexts/
  screens/
  theme.ts
  typography.ts
```

- `app/_layout.tsx` — root `Stack`, `SafeAreaProvider`, globalne providery
- `app/(tabs)/_layout.tsx` — bottom tabs i `animation: 'shift'`
- ekrany korzystają z `SafeAreaView` / `useSafeAreaInsets`
- Rolki są edge-to-edge i uwzględniają notch oraz dolny inset
- wspólny stan XP/serii jest w `ZagadajSessionProvider`

## Stack

- Expo SDK 57
- React Native 0.86
- React 19.2
- Expo Router 57
- TypeScript
- react-native-safe-area-context

Typografia jest przygotowana pod API Proxima Nova używane w MyCampus. Dopóki pliki fontów nie są skopiowane do tego repo, używany jest bezpieczny systemowy fallback, aby projekt nadal uruchamiał się w Expo Go.
