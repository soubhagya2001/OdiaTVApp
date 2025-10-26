import React, { useRef, useState, useEffect } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  useWindowDimensions,
  Platform,
  Linking,
} from "react-native";
import { Video } from "expo-av";
import { WebView } from "react-native-webview";
import { COLORS, SPACING, FONT_SIZES } from "../constants";

const VideoPlayer = ({
  streamUrl,
  youtubeUrl,
  // useYoutube,
  // setUseYoutube,
  style,
}) => {
  const videoRef = useRef(null);
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isUsingYoutube, setIsUsingYoutube] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    videoId: null,
    webViewLoaded: false,
    lastError: null,
    webViewState: null,
  });
  const { width, height } = useWindowDimensions();

  // Extract YouTube video ID
  const getVideoId = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };

  // Reset error and loading on channel change
  useEffect(() => {
    console.log("Debug: Resetting VideoPlayer for new channel", {
      streamUrl,
      youtubeUrl,
      isUsingYoutube,
    });
    setError(false);
    setLoading(true);
    setIsUsingYoutube(false);
    setDebugInfo({
      videoId: null,
      webViewLoaded: false,
      lastError: null,
      webViewState: null,
    });
  }, [streamUrl, youtubeUrl]);

  // Validate YouTube URL only when useYoutube is explicitly true
  useEffect(() => {
    if (isUsingYoutube) {
      if (youtubeUrl) {
        const videoId = getVideoId(youtubeUrl);
        if (!videoId) {
          console.error("Debug: Invalid YouTube URL", { youtubeUrl });
          setError(true);
          setDebugInfo((prev) => ({
            ...prev,
            lastError: `Invalid YouTube URL: ${youtubeUrl}`,
            videoId: null,
          }));
        } else {
          // console.log("Debug: Valid YouTube video ID", { videoId });
          setDebugInfo((prev) => ({ ...prev, videoId, lastError: null }));
        }
      } else {
        console.error("Debug: No YouTube URL provided");
        setError(true);
        setDebugInfo((prev) => ({
          ...prev,
          lastError: "No YouTube URL available for this channel",
          videoId: null,
        }));
      }
    }
  }, [isUsingYoutube, youtubeUrl]);

  // Log debug info
  // useEffect(() => {
  //   console.log("Debug Info:", {
  //     videoId: debugInfo.videoId,
  //     webViewLoaded: debugInfo.webViewLoaded,
  //     lastError: debugInfo.lastError,
  //     webViewState: debugInfo.webViewState,
  //     platform: Platform.OS,
  //     platformVersion: Platform.Version,
  //     useYoutube: isUsingYoutube,
  //     error,
  //   });
  // }, [debugInfo, isUsingYoutube, error]);

  // Handle streamUrl error
  const handleVideoError = (error) => {
    console.warn("Debug: Stream failed — switching to YouTube player", error);
    setDebugInfo((prev) => ({
      ...prev,
      lastError: `Stream error: ${JSON.stringify(error)}`,
    }));
    if (youtubeUrl) {
      console.log("Debug: Attempting YouTube URL", { youtubeUrl });
      setIsUsingYoutube(true);
      setLoading(true);
    } else {
      console.error("Debug: No YouTube URL available, showing error");
      setError(true);
      setDebugInfo((prev) => ({
        ...prev,
        lastError: "No YouTube URL available for this channel",
      }));
    }
  };

  // If error state
  if (error) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.errorText}>
          Failed to fetch video. Please try again later.
        </Text>
        {youtubeUrl && getVideoId(youtubeUrl) && (
          <Text
            style={styles.fallbackLink}
            onPress={() => Linking.openURL(youtubeUrl)}
          >
            Watch on YouTube
          </Text>
        )}
      </View>
    );
  }

  // If YouTube mode
  if (isUsingYoutube && youtubeUrl) {
    const videoId = getVideoId(youtubeUrl);
    if (!videoId) {
      return null; // Error handled in useEffect
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0&playsinline=1`;

    return (
      <View style={[styles.container, style]}>
        <WebView
          ref={webViewRef}
          source={{ uri: embedUrl }}
          style={{ width, height }}
          containerStyle={{ width, height }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          allowsFullscreenVideo={true}
          mediaPlaybackRequiresUserAction={false}
          androidLayerType="hardware"
          userAgent="Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
          injectedJavaScript={`
            window.addEventListener('error', (e) => {
              window.ReactNativeWebView.postMessage('JS Error: ' + e.message);
            });
            window.addEventListener('unhandledrejection', (e) => {
              window.ReactNativeWebView.postMessage('Promise Rejection: ' + e.reason);
            });
            true;
          `}
          onMessage={(event) => {
            console.error("Debug: WebView JS error:", event.nativeEvent.data);
            setDebugInfo((prev) => ({
              ...prev,
              lastError: `WebView JS error: ${event.nativeEvent.data}`,
            }));
            setError(true);
          }}
          onLoadStart={() => {
            console.log("Debug: WebView loading started");
            setDebugInfo((prev) => ({ ...prev, webViewLoaded: false }));
          }}
          onLoad={() => {
            console.log("Debug: WebView loaded");
            setDebugInfo((prev) => ({ ...prev, webViewLoaded: true }));
            setLoading(false);
          }}
          onError={(e) => {
            console.error("Debug: WebView error:", e);
            setDebugInfo((prev) => ({
              ...prev,
              lastError: `WebView error: ${JSON.stringify(e)}`,
            }));
            setError(true);
          }}
          onHttpError={(e) => {
            console.error("Debug: WebView HTTP error:", e);
            setDebugInfo((prev) => ({
              ...prev,
              lastError: `WebView HTTP error: ${JSON.stringify(e)}`,
            }));
            setError(true);
          }}
          onNavigationStateChange={(navState) => {
            console.log("Debug: WebView navigation state:", navState);
            setDebugInfo((prev) => ({ ...prev, webViewState: navState }));
          }}
        />
        {loading && (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={styles.loader}
          />
        )}
      </View>
    );
  }

  // Default Video mode (streamUrl)
  console.log("Debug: Attempting streamUrl", { streamUrl });
  return (
    <View style={[styles.container, style]}>
      <Video
        ref={videoRef}
        source={{ uri: streamUrl }}
        style={StyleSheet.absoluteFill}
        resizeMode="contain"
        useNativeControls
        onLoad={() => {
          console.log("Debug: Video loaded");
          setLoading(false);
          setDebugInfo((prev) => ({ ...prev, lastError: null }));
        }}
        onError={handleVideoError}
        shouldPlay
      />
      {loading && (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={styles.loader}
        />
      )}
    </View>
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
  fallbackLink: {
    color: COLORS.primary,
    padding: SPACING.medium,
    textAlign: "center",
    fontSize: FONT_SIZES.medium,
    textDecorationLine: "underline",
  },
});

export default VideoPlayer;
