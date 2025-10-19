import React, { useState, useEffect } from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NetInfo from "@react-native-community/netinfo";
import ChannelCard from "../components/ChannelCard";
import channels from "../../assets/channels.json";
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  OFFLINE_MESSAGE_EN,
  OFFLINE_MESSAGE_OD,
} from "../constants";

const HomeScreen = ({ navigation }) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected);
    });
    return unsubscribe;
  }, []);

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
