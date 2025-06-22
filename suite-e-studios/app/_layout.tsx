/** @format */

import "./services/firebase"; // Initialize Firebase

import * as React from "react";

import {
  ThemeProvider as AppThemeProvider,
  useThemeMode,
} from "./context/theme-context";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import Toast, { BaseToast, ToastConfig } from "react-native-toast-message";

import { ChecklistProvider } from "./context/checklist-context";
import { DrawerNavigator } from "./navigation/drawer-navigator";
import { NavProvider } from "./context/nav-context";
import { PortalProvider } from "@gorhom/portal";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider as StyledThemeProvider } from "styled-components/native";
import { UserProvider } from "./context/user-context";
import themeJson from "../globals.theme.json";

const darkTheme = {
  colors: themeJson.dark,
  global: themeJson.global,
};

const lightTheme = {
  colors: themeJson.light,
  global: themeJson.global,
};

const navDarkTheme = {
  dark: true,
  colors: {
    background: darkTheme.colors.background,
    card: darkTheme.colors.primary,
    text: darkTheme.colors.lightText,
    darkText: darkTheme.colors.darkText,
    border: darkTheme.colors.secondary,
    notification: darkTheme.colors.accent,
    primary: darkTheme.colors.primary,
  },
  fonts: NavigationDarkTheme.fonts,
};

const navLightTheme = {
  dark: false,
  colors: {
    background: lightTheme.colors.background,
    card: lightTheme.colors.primary,
    text: darkTheme.colors.lightText,
    darkText: darkTheme.colors.darkText,
    border: lightTheme.colors.secondary,
    notification: lightTheme.colors.accent,
    primary: lightTheme.colors.primary,
  },
  fonts: NavigationDefaultTheme.fonts,
};

const toastConfig: ToastConfig = {
  success: ({ text1, text2, ...rest }) => (
    <BaseToast
      {...rest}
      style={{ borderLeftColor: themeJson.light.accent }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "600",
      }}
      text2Style={{
        fontSize: 14,
      }}
      text1={text1}
      text2={text2}
    />
  ),
  error: ({ text1, text2, ...rest }) => (
    <BaseToast
      {...rest}
      style={{ borderLeftColor: "#E53935" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "600",
      }}
      text2Style={{
        fontSize: 14,
      }}
      text1={text1}
      text2={text2}
    />
  ),
  info: ({ text1, text2, ...rest }) => (
    <BaseToast
      {...rest}
      style={{ borderLeftColor: themeJson.light.primary }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "600",
      }}
      text2Style={{
        fontSize: 14,
      }}
      text1={text1}
      text2={text2}
    />
  ),
};

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <RootLayoutInner />
      <Toast config={toastConfig} />
    </AppThemeProvider>
  );
}

function RootLayoutInner() {
  const { colorScheme, uiSize } = useThemeMode();
  const theme = {
    ...(colorScheme === "dark" ? darkTheme : lightTheme),
    uiSize,
  };
  const navTheme = {
    ...(colorScheme === "dark" ? navDarkTheme : navLightTheme),
    colors: {
      ...(colorScheme === "dark" ? navDarkTheme.colors : navLightTheme.colors),
      headerTintColor: "#FFFFFF",
    },
  };

  return (
    <PortalProvider>
      <StyledThemeProvider theme={theme}>
        <SafeAreaProvider>
          <UserProvider>
            <ChecklistProvider>
              <NavigationThemeProvider value={navTheme}>
                <NavProvider>
                  <DrawerNavigator />
                </NavProvider>
              </NavigationThemeProvider>
            </ChecklistProvider>
          </UserProvider>
        </SafeAreaProvider>
      </StyledThemeProvider>
    </PortalProvider>
  );
}
