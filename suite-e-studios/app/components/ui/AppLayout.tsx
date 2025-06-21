/** @format */

import * as React from "react";

import { View } from "react-native";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}
