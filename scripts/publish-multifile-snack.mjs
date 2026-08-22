import fs from 'node:fs/promises';
import path from 'node:path';
import { Snack } from 'snack-sdk';

const root = process.env.GITHUB_WORKSPACE || process.cwd();

const projectFiles = [
  'app/index.tsx',
  'app/login.tsx',
  'app/onboarding.tsx',
  'app/practice-session.tsx',
  'app/_layout.tsx',
  'app/(tabs)/_layout.tsx',
  'app/(tabs)/index.tsx',
  'app/(tabs)/reels.tsx',
  'app/(tabs)/coach.tsx',
  'app/(tabs)/progress.tsx',
  'src/components/CardVideo.tsx',
  'src/components/Stat.tsx',
  'src/contexts/AuthContext.tsx',
  'src/contexts/ZagadajSessionContext.tsx',
  'src/domain/challenges.ts',
  'src/domain/practiceSession.ts',
  'src/screens/LoginScreen.tsx',
  'src/screens/OnboardingScreen.tsx',
  'src/screens/PracticeSessionScreen.tsx',
  'src/screens/TodayScreen.tsx',
  'src/screens/ReelsScreen.tsx',
  'src/screens/CoachScreen.tsx',
  'src/screens/ProgressScreen.tsx',
  'src/theme.ts',
  'src/typography.ts',
];

const files = {
  'App.tsx': {
    type: 'CODE',
    contents: `import React from 'react';\nimport { ExpoRoot } from 'expo-router';\n\nconst ctx = require.context('./app');\n\nexport default function App() {\n  return <ExpoRoot context={ctx} />;\n}\n`,
  },
};

for (const file of projectFiles) {
  files[file] = {
    type: 'CODE',
    contents: await fs.readFile(path.join(root, file), 'utf8'),
  };
}

const snack = new Snack({
  name: 'Zagadaj — product flow',
  description: 'Expo Router SDK 54: login, onboarding, functional tabs, timer questions, CardVideo, Coach and progress.',
  sdkVersion: '54.0.0',
  files,
  dependencies: {
    '@expo/vector-icons': { version: '^15.0.3' },
    '@react-native-async-storage/async-storage': { version: '2.2.0' },
    'expo-haptics': { version: '~15.0.8' },
    'expo-image': { version: '~3.0.11' },
    'expo-router': { version: '~6.0.24' },
    'expo-splash-screen': { version: '~31.0.13' },
    'expo-status-bar': { version: '~3.0.9' },
    'expo-video': { version: '~3.0.16' },
    'react-native-safe-area-context': { version: '~5.6.0' },
    'react-native-screens': { version: '~4.16.0' },
  },
});

const result = await snack.saveAsync({ ignoreUser: true });
const editorUrl = `https://snack.expo.dev/${result.id}`;
const expoGoUrl = result.url || '';

await fs.writeFile(
  path.join(root, 'SNACK_URL.txt'),
  `Editor: ${editorUrl}\nExpo Go: ${expoGoUrl}\nSnack ID: ${result.id}\n`,
  'utf8',
);

console.log(`SNACK_EDITOR_URL=${editorUrl}`);
console.log(`EXPO_GO_URL=${expoGoUrl}`);
console.log(`SNACK_ID=${result.id}`);
