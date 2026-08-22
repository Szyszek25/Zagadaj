import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';

type Props = {
  level?: number;
};

function Tree({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <View style={[styles.tree, { left: x, top: y, transform: [{ scale }] }]}>
      <View style={styles.trunk} />
      <View style={[styles.crown, styles.crownTop]} />
      <View style={[styles.crown, styles.crownLeft]} />
      <View style={[styles.crown, styles.crownRight]} />
    </View>
  );
}

function Flower({ x, y, icon = 'flower-outline' }: { x: number; y: number; icon?: 'flower-outline' | 'leaf-outline' }) {
  return (
    <View style={[styles.flower, { left: x, top: y }]}>
      <Ionicons name={icon} size={24} color={colors.garden} />
    </View>
  );
}

export function GardenScene({ level = 0 }: Props) {
  const grown = Math.max(0, level);

  return (
    <View style={styles.scene} accessible accessibilityLabel={`Twój ogród. Poziom rozwoju ${grown}.`}>
      <View style={styles.gridA} />
      <View style={styles.gridB} />
      <View style={styles.pond}>
        <View style={styles.pondShine} />
      </View>
      <Tree x={138} y={58} scale={grown >= 1 ? 1 : 0.74} />
      {grown >= 2 ? <Tree x={238} y={94} scale={0.72} /> : null}
      {grown >= 3 ? <Tree x={62} y={112} scale={0.62} /> : null}
      <Flower x={92} y={76} />
      <Flower x={205} y={66} icon="leaf-outline" />
      {grown >= 2 ? <Flower x={266} y={148} /> : null}
      {grown >= 4 ? <Flower x={44} y={166} icon="leaf-outline" /> : null}
      <View style={[styles.stone, { left: 78, top: 152 }]} />
      <View style={[styles.stone, styles.stoneSmall, { left: 232, top: 168 }]} />
      {grown >= 5 ? <View style={[styles.stone, styles.stoneRing, { left: 170, top: 176 }]} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    height: 260,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F1ECE2',
    borderRadius: 30,
  },
  gridA: {
    position: 'absolute',
    width: 330,
    height: 1,
    backgroundColor: 'rgba(4,27,50,0.07)',
    left: 14,
    top: 130,
    transform: [{ rotate: '22deg' }],
  },
  gridB: {
    position: 'absolute',
    width: 330,
    height: 1,
    backgroundColor: 'rgba(4,27,50,0.07)',
    left: 18,
    top: 132,
    transform: [{ rotate: '-22deg' }],
  },
  pond: {
    position: 'absolute',
    left: 128,
    top: 138,
    width: 92,
    height: 55,
    borderRadius: 30,
    backgroundColor: colors.navy,
    transform: [{ rotate: '-5deg' }],
  },
  pondShine: {
    position: 'absolute',
    left: 20,
    top: 12,
    width: 30,
    height: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  tree: { position: 'absolute', width: 64, height: 92, alignItems: 'center' },
  trunk: { position: 'absolute', bottom: 0, width: 8, height: 42, borderRadius: 5, backgroundColor: '#80634B' },
  crown: { position: 'absolute', borderRadius: 40, backgroundColor: colors.navy },
  crownTop: { width: 38, height: 40, top: 3, left: 13 },
  crownLeft: { width: 34, height: 34, top: 25, left: 2 },
  crownRight: { width: 36, height: 36, top: 23, right: 0 },
  flower: { position: 'absolute', width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  stone: { position: 'absolute', width: 32, height: 22, borderRadius: 10, borderWidth: 2, borderColor: colors.navy, backgroundColor: '#E4DED3', transform: [{ rotate: '-15deg' }] },
  stoneSmall: { width: 22, height: 16, borderRadius: 8 },
  stoneRing: { width: 38, height: 24, borderRadius: 20, backgroundColor: 'transparent' },
});
