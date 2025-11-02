import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, FONT_SIZES, SPACING } from "../constants";

const ChannelCard = ({ channel, onPress, disabled }) => {
  return (
    <TouchableOpacity
      onPress={disabled ? null : onPress}
      style={[styles.card, disabled && styles.disabled]}
    >
      <LinearGradient colors={["#FFFFFF", "#F0F0F0"]} style={styles.gradient}>
        <Image
          source={{ uri: channel.logoUrl }}
          style={styles.logo}
          cachePolicy="disk"
          contentFit="contain"
        />
        <Text style={styles.englishName}>{channel.englishName}</Text>
        <Text style={styles.odiaName}>{channel.odiaName}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: SPACING.small,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    // Remove aspectRatio: 1
    minHeight: 160, // Ensures space for logo + 2 lines + padding
  },
  disabled: {
    opacity: 0.5,
  },
  gradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.medium,
    minHeight: 160, // Match card
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: SPACING.small,
  },
  englishName: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginTop: SPACING.xsmall,
  },
  odiaName: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});

export default ChannelCard;
