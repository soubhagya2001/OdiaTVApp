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
import { WebView } from "react-native-webview";
import * as Brightness from "expo-brightness";
import { PanGestureHandler } from "react-native-gesture-handler";
import { COLORS, SPACING, FONT_SIZES } from "../constants";

const VideoPlayer = ({ streamUrl, youtubeUrl, style }) => {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [useYoutube, setUseYoutube] = useState(false);

  const [initialBrightness, setInitialBrightness] = useState(0.5);
  const [currentBrightness, setCurrentBrightness] = useState(0.5);
  const [currentVolume, setCurrentVolume] = useState(1.0);
  const [showBrightnessBar, setShowBrightnessBar] = useState(false);
  const [showVolumeBar, setShowVolumeBar] = useState(false);
  const brightnessAnim = useRef(new Animated.Value(0)).current;
  const volumeAnim = useRef(new Animated.Value(0)).current;
  const { width, height } = useWindowDimensions();

  // Initialize brightness safely for Android
  useEffect(() => {
    let originalBrightness = 0.5;

    (async () => {
      try {
        const { status } = await Brightness.requestPermissionsAsync();
        if (status === "granted") {
          // Get app brightness instead of system brightness (more accurate)
          const brightness = await Brightness.getBrightnessAsync();
          originalBrightness = brightness;

          // Don't override screen brightness immediately
          setInitialBrightness(brightness);
          setCurrentBrightness(brightness);
        }
      } catch (error) {
        console.warn("Brightness permission or fetch failed:", error);
      }
    })();

    // On cleanup, restore original brightness
    return () => {
      Brightness.setBrightnessAsync(originalBrightness).catch(() => {});
    };
  }, []);

  // Handle fade animations
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
      if (videoRef.current) await videoRef.current.setVolumeAsync(newVolume);
      setCurrentVolume(newVolume);
      setShowVolumeBar(true);
    }
  };

  // When video fails, try YouTube
  const handleVideoError = () => {
    if (youtubeUrl) {
      console.warn("Stream failed — switching to YouTube player");
      setUseYoutube(true);
    } else {
      setError(true);
    }
  };

  // If YouTube mode
  if (useYoutube) {
    return (
      <View style={[styles.container, style]}>
        <WebView
          source={{
            uri: `${youtubeUrl}?autoplay=1&controls=0&modestbranding=1&showinfo=0`,
          }}
          style={StyleSheet.absoluteFill}
          allowsFullscreenVideo
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          renderLoading={() => (
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
              style={styles.loader}
            />
          )}
          onError={() => setError(true)}
        />
      </View>
    );
  }

  // If error in both sources
  if (error) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.errorText}>
          Failed to load video. Please try again later.
        </Text>
      </View>
    );
  }

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <View style={[styles.container, style]}>
        <Video
          ref={videoRef}
          source={{ uri: streamUrl }}
          style={StyleSheet.absoluteFill}
          resizeMode="contain"
          useNativeControls
          onLoad={() => setLoading(false)}
          onError={handleVideoError}
          shouldPlay
          volume={currentVolume}
        />

        {loading && (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={styles.loader}
          />
        )}

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
                style={[styles.barFill, { height: `${currentVolume * 100}%` }]}
              />
            </View>
            <Text style={styles.barText}>
              Volume: {Math.round(currentVolume * 100)}%
            </Text>
          </Animated.View>
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
    textAlign: "center",
    fontSize: FONT_SIZES.medium,
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
    right: SPACING.medium,
  },
  volumeBar: {
    left: SPACING.medium,
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
