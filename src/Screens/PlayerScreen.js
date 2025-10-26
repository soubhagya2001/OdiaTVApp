import React, { useState, useEffect } from "react";
import {
  View,
  useWindowDimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import NetInfo from "@react-native-community/netinfo";
import VideoPlayer from "../components/VideoPlayer";
import ChannelList from "../components/ChannelList";
import localChannels from "../../assets/channels.json";
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  OFFLINE_MESSAGE_EN,
  OFFLINE_MESSAGE_OD,
  CHANNELS_URL,
} from "../constants";

const PlayerScreen = ({ route, navigation }) => {
  const { selectedChannel } = route.params;
  const [currentChannel, setCurrentChannel] = useState(selectedChannel);
  const [isOnline, setIsOnline] = useState(true);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected);
    });
    ScreenOrientation.unlockAsync();
    return () => {
      unsubscribe();
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({ headerShown: !isLandscape });
  }, [isLandscape, navigation]);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 sec timeout

        const response = await fetch(CHANNELS_URL, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error("Failed to fetch channels");

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          let activeChannels = data.filter((ch) => ch.isActive == 1);
          activeChannels = activeChannels.length > 0 ? activeChannels : data;
          setChannels(activeChannels);
        } else {
          let activeLocal = localChannels.filter((ch) => ch.isActive == 1);
          activeLocal = activeLocal.length > 0 ? activeLocal : localChannels;
          setChannels(activeLocal);
        }
      } catch (error) {
        console.warn(
          "⚠️ Using local channels due to fetch issue:",
          error.message
        );
        let activeLocal = localChannels.filter((ch) => ch.isActive == 1);
        activeLocal = activeLocal.length > 0 ? activeLocal : localChannels;
        setChannels(activeLocal);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  if (!isOnline) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.offlineAlert}>
          <Text style={styles.offlineText}>{OFFLINE_MESSAGE_EN}</Text>
          <Text style={styles.offlineText}>{OFFLINE_MESSAGE_OD}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 50 }}
        />
      </SafeAreaView>
    );
  }

  if (channels.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noChannelsContainer}>
          <Text style={styles.noChannelsText}>No channels found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={isLandscape} />
      {isLandscape ? (
        <VideoPlayer
          streamUrl={currentChannel.streamUrl}
          style={styles.fullScreenVideo}
        />
      ) : (
        <View style={styles.portraitContainer}>
          <VideoPlayer
            streamUrl={currentChannel?.streamUrl}
            youtubeUrl={currentChannel?.youtubeUrl}
            style={styles.fullScreenVideo}
          />

          <ChannelList
            channels={channels}
            onSelectChannel={setCurrentChannel}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreenVideo: {
    flex: 1,
  },
  portraitContainer: {
    flex: 1,
  },
  portraitVideo: {
    height: "50%",
  },
  offlineAlert: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: SPACING.medium,
  },
  offlineText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.medium,
    textAlign: "center",
    marginBottom: SPACING.small,
  },
  noChannelsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  noChannelsText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.large,
    fontWeight: "600",
  },
});

export default PlayerScreen;
