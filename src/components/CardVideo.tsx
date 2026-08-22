import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

const MAX_CONCURRENT_PLAYERS = 3;
let mountedPlayers = 0;

export type CardVideoProps = {
  source: string;
  style?: StyleProp<ViewStyle>;
  contentFit?: 'cover' | 'contain' | 'fill';
  muted?: boolean;
  isVisible?: boolean;
  respectNavigationFocus?: boolean;
  posterUri?: string | null;
  onAspectRatio?: (ratio: number) => void;
};

function Player({
  source,
  style,
  contentFit = 'cover',
  muted = true,
  isVisible = true,
  respectNavigationFocus = true,
  posterUri,
  onAspectRatio,
}: CardVideoProps) {
  const [focused, setFocused] = useState(true);
  const [ready, setReady] = useState(false);
  const videoSource = useMemo(() => ({ uri: source }), [source]);
  const player = useVideoPlayer(videoSource, (instance) => {
    instance.loop = true;
    instance.muted = muted;
  });

  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, []),
  );

  useEffect(() => {
    mountedPlayers += 1;
    return () => {
      mountedPlayers = Math.max(0, mountedPlayers - 1);
    };
  }, []);

  useEffect(() => {
    setReady(false);
  }, [source]);

  useEffect(() => {
    player.muted = muted;
  }, [muted, player]);

  useEffect(() => {
    const report = (track = player.videoTrack) => {
      const width = Number(track?.size?.width);
      const height = Number(track?.size?.height);
      if (width > 0 && height > 0) onAspectRatio?.(width / height);
    };
    report();
    const subscription = player.addListener('videoTrackChange', ({ videoTrack }) => report(videoTrack));
    return () => subscription.remove();
  }, [onAspectRatio, player]);

  useEffect(() => {
    const navigationOk = respectNavigationFocus ? focused : true;
    if (navigationOk && isVisible) player.play();
    else player.pause();
  }, [focused, isVisible, player, respectNavigationFocus]);

  return (
    <View style={[styles.video, style]} pointerEvents="none">
      {posterUri && !ready ? (
        <Image
          source={{ uri: posterUri }}
          style={StyleSheet.absoluteFill}
          contentFit={contentFit}
          cachePolicy="memory-disk"
        />
      ) : null}
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        nativeControls={false}
        contentFit={contentFit}
        surfaceType={Platform.OS === 'android' ? 'textureView' : undefined}
        onFirstFrameRender={() => setReady(true)}
      />
    </View>
  );
}

export function CardVideo(props: CardVideoProps) {
  const shouldMount = props.isVisible !== false && mountedPlayers < MAX_CONCURRENT_PLAYERS;
  if (!shouldMount) {
    return (
      <View style={[styles.video, props.style]} pointerEvents="none">
        {props.posterUri ? (
          <Image
            source={{ uri: props.posterUri }}
            style={StyleSheet.absoluteFill}
            contentFit={props.contentFit ?? 'cover'}
            cachePolicy="memory-disk"
          />
        ) : null}
      </View>
    );
  }
  return <Player {...props} />;
}

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#141414',
  },
});
