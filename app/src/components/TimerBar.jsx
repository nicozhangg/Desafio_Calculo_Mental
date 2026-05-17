import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export default function TimerBar({ duration, running, onExpire, resetKey }) {
  const progress = useRef(new Animated.Value(1)).current;
  const anim = useRef(null);
  const expired = useRef(false);

  useEffect(() => {
    progress.setValue(1);
    expired.current = false;
    if (running) {
      anim.current = Animated.timing(progress, {
        toValue: 0,
        duration,
        useNativeDriver: false,
      });
      anim.current.start(({ finished }) => {
        if (finished && !expired.current) {
          expired.current = true;
          onExpire();
        }
      });
    }
    return () => anim.current?.stop();
  }, [resetKey, running]);

  const backgroundColor = progress.interpolate({
    inputRange: [0, 0.25, 0.5, 1],
    outputRange: ['#e74c3c', '#e74c3c', '#f39c12', '#2ecc71'],
  });

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { width, backgroundColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 10,
    backgroundColor: '#dfe6e9',
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 8,
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
});
