/** @format */

import * as React from "react";

import { BottomNavBar } from "@/app/components/ui/BottomNavBar";
import { View } from "react-native";
import { useNav } from "@/app/context/nav-context";
import { useRoute } from "@react-navigation/native";

export function AppLayout({
  children,
  navigation,
}: {
  children: React.ReactNode;
  navigation?: any;
}) {
  const { showBottomNav, tabs, activeTab } = useNav();
  const route = useRoute();

  // Do not show the global nav bar on the Checklists screen
  const shouldShowNav = showBottomNav && route.name !== "Checklists";

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{children}</View>
      {shouldShowNav && (
        <BottomNavBar
          tabs={tabs}
          activeTab={activeTab}
          navigation={navigation}
        />
      )}
    </View>
  );
}
