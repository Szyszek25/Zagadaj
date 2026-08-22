import fs from 'node:fs/promises';
import path from 'node:path';
import { Snack } from 'snack-sdk';

const root = process.env.GITHUB_WORKSPACE || process.cwd();

const projectFiles = [
  'app/_layout.tsx',
  'app/(tabs)/_layout.tsx',
  'app/(tabs)/index.tsx',
  'app/(tabs)/reels.tsx',
  'app/(tabs)/coach.tsx',
  'app/(tabs)/progress.tsx',
  'src/contexts/ZagadajSessionContext.tsx',
  'src/screens/TodayScreen.tsx',
  'src/screens/ReelsScreen.tsx',
  'src/screens/CoachScreen.tsx',
  'src/screens/ProgressScreen.tsx',
  'src/components/Stat.tsx',
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
  name: 'Zagadaj — Expo Router',
  description: 'Wieloplikowy prototyp Zagadaj: Expo Router, tabs, safe area i pionowe rolki.',
  sdkVersion: '57.0.0',
  files,
  dependencies: {
    '@react-native-async-storage/async-storage': { version: '2.2.0' },
    'expo-haptics': { version: '~57.0.1' },
    'expo-router': { version: '~57.0.13' },
    'expo-splash-screen': { version: '~57.0.6' },
    'expo-status-bar': { version: '~57.0.1' },
    'react-native-safe-area-context': { version: '~5.7.0' },
    'react-native-screens': { version: '~4.26.0' },
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
