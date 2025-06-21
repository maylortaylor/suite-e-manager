/** @format */
import * as React from "react";

import {useTheme } from "styled-components/native";
import { TabButton, TabText, TabsContainer } from "./styled.components";

export interface Tab<T extends string> {
  name: string;
  target: T;
}

interface TabsProps<T extends string> {
  tabs: Tab<T>[];
  activeTab: T;
  onTabPress: (target: T) => void;
}

export function Tabs<T extends string>({
  tabs,
  activeTab,
  onTabPress,
}: TabsProps<T>) {
  const theme = useTheme();
  return (
    <TabsContainer theme={theme}>
      {tabs.map((tab) => (
        <TabButton
          key={tab.target}
          active={activeTab === tab.target}
          onPress={() => onTabPress(tab.target)}
          theme={theme}
        >
          <TabText active={activeTab === tab.target} theme={theme}>
            {tab.name}
          </TabText>
        </TabButton>
      ))}
    </TabsContainer>
  );
}
