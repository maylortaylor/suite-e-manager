/** @format */

import { StyleProp, View, ViewStyle } from "react-native";

import { Picker } from "@react-native-picker/picker";
import React from "react";
import { useTheme } from "styled-components/native";

export interface StyledPickerProps {
  value: string;
  onValueChange: (value: string) => void;
  items: { label: string; value: string }[];
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}

export function StyledPicker({
  value,
  onValueChange,
  items,
  placeholder = "Select...",
  style,
}: StyledPickerProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        {
          borderWidth: 1,
          borderColor: theme.colors.divider,
          borderRadius: 6,
          marginBottom: 8,
          backgroundColor: theme.colors.input,
          height: 40,
          justifyContent: "center",
        },
        style,
      ]}
    >
      <Picker
        selectedValue={value}
        onValueChange={onValueChange}
        style={{
          color: theme.colors.text,
          backgroundColor: theme.colors.input,
          height: 40,
          fontSize: 16,
          paddingHorizontal: 8,
        }}
        itemStyle={{ color: theme.colors.lightText, fontSize: 16 }}
        dropdownIconColor={theme.colors.lightText}
      >
        <Picker.Item
          label={placeholder}
          value=""
          color={theme.colors.lightText}
        />
        {items.map((item) => (
          <Picker.Item
            label={item.label}
            value={item.value}
            color={theme.colors.lightText}
          />
        ))}
      </Picker>
    </View>
  );
}
