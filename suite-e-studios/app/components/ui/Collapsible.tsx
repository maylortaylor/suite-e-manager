/** @format */

import React, { PropsWithChildren, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { IconSymbol } from "./IconSymbol";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useTheme } from "styled-components/native";

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  return (
    <ThemedView>
      <TouchableOpacity
        style={[
          styles.heading,
          {
            borderTopWidth: 1,
            borderTopColor: theme.colors.divider,
          },
        ]}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
      >
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={theme.colors.text}
          style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}
        />
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
