import React, { useRef, useState, useEffect } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  useWindowDimensions,
  Animated,
} from "react-native";
import { Video } from "expo-av";
import * as Brightness from "expo-brightness";
import { PanGestureHandler } from "react-native-gesture-handler";
import { COLORS, SPACING ,FONT_SIZES} from "../constants";

const VideoPlayer = ({ streamUrl, style }) => {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [initialBrightness, setInitialBrightness] = useState(0.5);
  const [currentBrightness, setCurrentBrightness] = useState(0.5);
  const [currentVolume, setCurrentVolume] = useState(1.0);
  const [showBrightnessBar, setShowBrightnessBar] = useState(false);
  const [showVolumeBar, setShowVolumeBar] = useState(false);
  const brightnessAnim = useRef(new Animated.Value(0)).current;
  const volumeAnim = useRef(new Animated.Value(0)).current;
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    (async () => {
      const { status } = await Brightness.requestPermissionsAsync();
      if (status === "granted") {
        const brightness = await Brightness.getSystemBrightnessAsync();
        setInitialBrightness(brightness);
        setCurrentBrightness(brightness);
      }
    })();

    return () => {
      Brightness.setSystemBrightnessAsync(initialBrightness);
    };
  }, []);

  useEffect(() => {
    if (showBrightnessBar) {
      Animated.timing(brightnessAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      const timer = setTimeout(() => {
        Animated.timing(brightnessAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => setShowBrightnessBar(false));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showBrightnessBar]);

  useEffect(() => {
    if (showVolumeBar) {
      Animated.timing(volumeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      const timer = setTimeout(() => {
        Animated.timing(volumeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => setShowVolumeBar(false));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showVolumeBar]);

  const onGestureEvent = async ({ nativeEvent }) => {
    const isLeft = nativeEvent.absoluteX < width / 2;
    const delta = (-nativeEvent.translationY / height) * 0.5;

    if (isLeft) {
      const newBrightness = Math.max(0, Math.min(1, currentBrightness + delta));
      await Brightness.setSystemBrightnessAsync(newBrightness);
      setCurrentBrightness(newBrightness);
      setShowBrightnessBar(true);
    } else {
      const newVolume = Math.max(0, Math.min(1, currentVolume + delta));
      await videoRef.current.setVolumeAsync(newVolume);
      setCurrentVolume(newVolume);
      setShowVolumeBar(true);
    }
  };

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <View style={[styles.container, style]}>
        {error ? (
          <Text style={styles.errorText}>
            Failed to load stream. Check connection.
          </Text>
        ) : (
          <>
            <Video
              ref={videoRef}
              source={{ uri: streamUrl }}
              style={StyleSheet.absoluteFill}
              resizeMode="contain"
              useNativeControls
              onLoad={() => setLoading(false)}
              onError={() => setError(true)}
              shouldPlay
              volume={currentVolume}
            />
            {showBrightnessBar && (
              <Animated.View
                style={[
                  styles.barContainer,
                  styles.brightnessBar,
                  { opacity: brightnessAnim },
                ]}
              >
                <View style={styles.barBackground}>
                  <View
                    style={[
                      styles.barFill,
                      { height: `${currentBrightness * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.barText}>
                 Brightness: {Math.round(currentBrightness * 100)}%
                </Text>
              </Animated.View>
            )}
            {showVolumeBar && (
              <Animated.View
                style={[
                  styles.barContainer,
                  styles.volumeBar,
                  { opacity: volumeAnim },
                ]}
              >
                <View style={styles.barBackground}>
                  <View
                    style={[
                      styles.barFill,
                      { height: `${currentVolume * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.barText}>
                 Volume: {Math.round(currentVolume * 100)}%
                </Text>
              </Animated.View>
            )}
          </>
        )}
        {loading && !error && (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={styles.loader}
          />
        )}
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    position: "absolute",
  },
  errorText: {
    color: "#FFF",
    padding: SPACING.medium,
  },
  barContainer: {
    position: "absolute",
    top: SPACING.large,
    bottom: SPACING.large,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  brightnessBar: {
    right: SPACING.medium, // Opposite side (right for brightness)
  },
  volumeBar: {
    left: SPACING.medium, // Opposite side (left for volume)
  },
  barBackground: {
    width: 10,
    height: 100,
    backgroundColor: "#333",
    borderRadius: 5,
    overflow: "hidden",
  },
  barFill: {
    backgroundColor: COLORS.primary,
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  barText: {
    color: "#FFF",
    fontSize: FONT_SIZES.small,
    marginTop: SPACING.small,
    textAlign: "center",
  },
});

export default VideoPlayer;
