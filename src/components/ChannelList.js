import React from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, FONT_SIZES, SPACING } from "../constants";

const ChannelList = ({ channels, onSelectChannel }) => {
  const insets = useSafeAreaInsets();

  return (
    <FlatList
      data={channels}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onSelectChannel(item)}
          style={styles.listItem}
        >
          <Image
            source={{ uri: item.logoUrl }}
            style={styles.smallLogo}
            cachePolicy="disk"
            contentFit="contain"
          />
          <View style={styles.textContainer}>
            <Text style={styles.listText}>{item.englishName}</Text>
            <Text style={styles.listSubText}>({item.odiaName})</Text>
          </View>
        </TouchableOpacity>
      )}
      style={styles.list}
      contentContainerStyle={{ paddingBottom: insets.bottom + SPACING.large }}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.medium,
    marginHorizontal: SPACING.small,
    marginVertical: SPACING.small / 2,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  smallLogo: {
    width: 40,
    height: 40,
    marginRight: SPACING.medium,
  },
  textContainer: {
    flex: 1,
  },
  listText: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  listSubText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
  },
});

export default ChannelList;
