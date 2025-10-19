import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image"; // Use expo-image for caching
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
          cachePolicy="disk" // Persist to disk
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
  },
  disabled: {
    opacity: 0.5,
  },
  gradient: {
    alignItems: "center",
    padding: SPACING.medium,
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
  },
  odiaName: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
  },
});

export default ChannelCard;
