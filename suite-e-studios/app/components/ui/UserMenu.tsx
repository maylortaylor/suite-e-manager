/** @format */

import {
  MenuButton,
  MenuButtonText,
  MenuContainer,
  MenuModal,
  UserIcon,
  UserIconText,
} from "./styled.components";
import { Pressable, View } from "react-native";
import React, { useState } from "react";

import type { MainStackParamList } from "@/app/navigation/main-stack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "@/app/context/user-context";

export function UserMenu() {
  const { state, dispatch } = useUser();
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [menuVisible, setMenuVisible] = useState(false);

  if (!state.user) return null;

  function handleLogout() {
    setMenuVisible(false);
    dispatch({ type: "LOGOUT" });
  }

  function handleSettings() {
    setMenuVisible(false);
    navigation.navigate("Settings");
  }

  function handleHome() {
    setMenuVisible(false);
    navigation.navigate("Home");
  }

  return (
    <>
      <UserIcon
        onPress={() => setMenuVisible(true)}
        accessibilityRole="button"
        accessibilityLabel="Open user menu"
      >
        <UserIconText>
          {state.user?.name?.[0]?.toUpperCase() || "U"}
        </UserIconText>
      </UserIcon>
      <MenuModal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={{ flex: 1 }} onPress={() => setMenuVisible(false)}>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-start",
              alignItems: "flex-end",
            }}
          >
            <Pressable
              onPress={(e) => e.stopPropagation()}
              style={{ zIndex: 2 }}
            >
              <MenuContainer>
              <MenuButton onPress={handleHome} accessibilityRole="button">
                  <MenuButtonText>Home</MenuButtonText>
                </MenuButton>
                <MenuButton
                  onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate("Checklists");
                  }}
                  accessibilityRole="button"
                >
                  <MenuButtonText>Checklists</MenuButtonText>
                </MenuButton>
                <MenuButton onPress={handleSettings} accessibilityRole="button">
                  <MenuButtonText>Settings</MenuButtonText>
                </MenuButton>
                <MenuButton onPress={handleLogout} accessibilityRole="button">
                  <MenuButtonText>Logout</MenuButtonText>
                </MenuButton>
              </MenuContainer>
            </Pressable>
          </View>
        </Pressable>
      </MenuModal>
    </>
  );
}
