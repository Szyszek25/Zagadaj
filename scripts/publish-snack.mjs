import fs from 'node:fs/promises';
import path from 'node:path';
import { Snack } from 'snack-sdk';

const root = process.env.GITHUB_WORKSPACE;
if (!root) throw new Error('GITHUB_WORKSPACE is missing');

const projectFiles = [
  'App.tsx',
  'src/theme.ts',
  'src/components/BottomNav.tsx',
  'src/components/Stat.tsx',
  'src/screens/TodayScreen.tsx',
  'src/screens/ReelsScreen.tsx',
  'src/screens/CoachScreen.tsx',
  'src/screens/ProgressScreen.tsx',
];

const files = {};
for (const file of projectFiles) {
  files[file] = {
    type: 'CODE',
    contents: await fs.readFile(path.join(root, file), 'utf8'),
  };
}

const snack = new Snack({
  name: 'Zagadaj',
  description: 'Zagadaj — publiczny prototyp Expo Go',
  sdkVersion: '57.0.0',
  files,
  dependencies: {
    'expo-status-bar': { version: '~57.0.0' },
  },
});

const result = await snack.saveAsync({ ignoreUser: true });
const editorUrl = `https://snack.expo.dev/${result.id}`;

console.log(`SNACK_RESULT=${JSON.stringify(result)}`);
console.log(`EXPO_GO_URL=${result.url}`);
console.log(`SNACK_EDITOR_URL=${editorUrl}`);

await fs.writeFile(
  path.join(root, 'SNACK.md'),
  `# Zagadaj — Expo Go\n\nPubliczny build uruchamiany w Expo Go.\n\n- Expo Go: ${result.url}\n- Snack: ${editorUrl}\n- SDK: 57.0.0\n`,
  'utf8',
);
