import React, { useState, useEffect } from "react";
import {
  View,
  useWindowDimensions,
  SafeAreaView,
  StyleSheet,
  Text,
} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import NetInfo from "@react-native-community/netinfo";
import VideoPlayer from "../components/VideoPlayer";
import ChannelList from "../components/ChannelList";
import channels from "../../assets/channels.json";
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  OFFLINE_MESSAGE_EN,
  OFFLINE_MESSAGE_OD,
} from "../constants";

const PlayerScreen = ({ route, navigation }) => {
  const { selectedChannel } = route.params;
  const [currentChannel, setCurrentChannel] = useState(selectedChannel);
  const [isOnline, setIsOnline] = useState(true);
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
            streamUrl={currentChannel.streamUrl}
            style={styles.portraitVideo}
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
});

export default PlayerScreen;
