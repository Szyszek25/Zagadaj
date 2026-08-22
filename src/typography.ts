import { Platform, TextStyle } from 'react-native';

// MyCampus uses bundled Proxima Nova files. Zagadaj keeps the same typography API,
// while remaining runnable in Expo Go even before those licensed font assets are copied in.
const regular = Platform.select({ ios: 'Avenir Next', android: 'sans-serif', default: 'Arial' });
const medium = Platform.select({ ios: 'Avenir Next Medium', android: 'sans-serif-medium', default: 'Arial' });
const semibold = Platform.select({ ios: 'Avenir Next Demi Bold', android: 'sans-serif-medium', default: 'Arial' });
const bold = Platform.select({ ios: 'Avenir Next Bold', android: 'sans-serif', default: 'Arial' });

export const fonts = {
  regular,
  medium,
  semibold,
  bold,
  // Exact family names used by MyCampus once Proxima Nova assets are bundled with expo-font.
  proxima: {
    regular: 'ProximaNova-Regular',
    medium: 'ProximaNova-Medium',
    semibold: 'ProximaNova-Semibold',
    bold: 'ProximaNova-Bold',
  },
} as const;

export const type = {
  body: { fontFamily: regular, fontWeight: '400' } as TextStyle,
  medium: { fontFamily: medium, fontWeight: '500' } as TextStyle,
  semibold: { fontFamily: semibold, fontWeight: '600' } as TextStyle,
  bold: { fontFamily: bold, fontWeight: '700' } as TextStyle,
};
