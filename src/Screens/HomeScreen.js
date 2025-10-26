import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NetInfo from "@react-native-community/netinfo";
import ChannelCard from "../components/ChannelCard";
import localChannels from "../../assets/channels.json";
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  OFFLINE_MESSAGE_EN,
  OFFLINE_MESSAGE_OD,
  CHANNELS_URL
} from "../constants";


const HomeScreen = ({ navigation }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected);
    });
    return unsubscribe;
  }, []);

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
          const activeChannels = data.filter((ch) => ch.isActive == 1);
          console.log("Using fetched channels", activeChannels);
          setChannels(activeChannels);
        } else {
          // fallback if data is not valid
          const activeLocal = localChannels.filter((ch) => ch.isActive == 1);
          console.log("Using saved channels");
          setChannels(activeLocal);
        }
      } catch (error) {
        console.warn(
          "⚠️ Using local channels due to fetch issue:",
          error.message
        );
        const activeLocal = localChannels.filter((ch) => ch.isActive == 1);
        setChannels(activeLocal);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

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

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {!isOnline && (
        <View style={styles.offlineAlert}>
          <Text style={styles.offlineText}>{OFFLINE_MESSAGE_EN}</Text>
          <Text style={styles.offlineText}>{OFFLINE_MESSAGE_OD}</Text>
        </View>
      )}
      <FlatList
        data={channels}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ChannelCard
            channel={item}
            onPress={
              isOnline
                ? () => navigation.navigate("Player", { selectedChannel: item })
                : null
            }
            disabled={!isOnline}
          />
        )}
        numColumns={2}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: SPACING.large * 2 },
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.small,
  },
  offlineAlert: {
    backgroundColor: COLORS.alert,
    padding: SPACING.medium,
    alignItems: "center",
  },
  offlineText: {
    color: "#FFF",
    fontSize: FONT_SIZES.medium,
    textAlign: "center",
  },
});

export default HomeScreen;
