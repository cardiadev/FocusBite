/**
 * Animated Splash Screen with Lottie
 * 
 * Displays a Lottie animation for 3 seconds with fade out effect
 * and animated gradient background before showing the main app interface.
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AnimatedSplashProps {
  onFinish: () => void;
}

export function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  const animationRef = useRef<LottieView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const gradientOpacity1 = useRef(new Animated.Value(1)).current;
  const gradientOpacity2 = useRef(new Animated.Value(0)).current;
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Start the Lottie animation
    animationRef.current?.play();

    // Animate gradient layers with opacity for smooth color transitions
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(gradientOpacity1, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(gradientOpacity2, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(gradientOpacity1, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(gradientOpacity2, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    // After 2.5 seconds, start fade out (0.5s fade + 3s total = shows for ~2.5s)
    const fadeTimer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500, // 0.5 second fade out
        useNativeDriver: true,
      }).start(() => {
        setIsAnimating(false);
        onFinish();
      });
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
    };
  }, [fadeAnim, gradientOpacity1, gradientOpacity2, onFinish]);

  if (!isAnimating) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      {/* Base Gradient Layer */}
      <LinearGradient
        colors={['#9785EB', '#B39DDB', '#7E57C2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      {/* Animated Gradient Layer 1 */}
      <Animated.View style={[styles.gradient, { opacity: gradientOpacity1 }]}>
        <LinearGradient
          colors={['#B39DDB', '#9785EB', '#CE93D8']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>

      {/* Animated Gradient Layer 2 */}
      <Animated.View style={[styles.gradient, { opacity: gradientOpacity2 }]}>
        <LinearGradient
          colors={['#7E57C2', '#9785EB', '#B39DDB']}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>

      {/* Lottie Animation */}
      <View style={styles.animationContainer}>
        <LottieView
          ref={animationRef}
          source={require('@/assets/animations/splash.json')}
          autoPlay={false}
          loop={false}
          style={styles.animation}
          resizeMode="contain"
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  animationContainer: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
});
