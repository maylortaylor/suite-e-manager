/** @format */

import * as React from "react";

import { ActionButton, ActionButtonText, BottomBar } from "./styled.components";

import { Divider } from "./Divider";
import { useNav } from "@/app/context/nav-context";
import { useTheme } from "styled-components/native";

export interface NavTab {
  name: string;
  onPress: () => void;
  target: string;
}

interface BottomNavBarProps {
  tabs: NavTab[];
  activeTab: string;
  navigation?: any;
}

export function BottomNavBar({
  tabs,
  activeTab,
  navigation,
}: BottomNavBarProps) {
  const theme = useTheme();
  const { setActiveTab } = useNav();

  const handlePress = (tab: NavTab) => {
    setActiveTab(tab.target);
    if (
      navigation &&
      tab.target !== "checklists" &&
      tab.target !== "tasklists" &&
      tab.target !== "tasks"
    ) {
      navigation.navigate(tab.target);
    } else {
      tab.onPress();
    }
  };

  return (
    <BottomBar>
      {tabs.map((tab, index) => (
        <React.Fragment key={tab.name}>
          <ActionButton
            onPress={() => handlePress(tab)}
            active={activeTab === tab.target}
          >
            <ActionButtonText active={activeTab === tab.target}>
              {tab.name}
            </ActionButtonText>
          </ActionButton>
          {index < tabs.length - 1 && (
            <Divider
              orientation="vertical"
              thickness={1}
              length={8}
              marginHorizontal={8}
              color={theme.colors.divider}
            />
          )}
        </React.Fragment>
      ))}
    </BottomBar>
  );
}
