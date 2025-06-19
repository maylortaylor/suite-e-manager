/** @format */

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

import { ChecklistProvider } from "./context/checklist-context";
import { MainStack } from "./navigation/main-stack";
import { PortalProvider } from "@gorhom/portal";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider as StyledThemeProvider } from "styled-components/native";
import { UserProvider } from "./context/user-context";
import themeJson from "../globals.theme.json";
import { useColorScheme } from "react-native";

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

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <RootLayoutInner />
    </AppThemeProvider>
  );
}

function RootLayoutInner() {
  const { colorScheme, uiSize } = useThemeMode();
  const theme = {
    ...(colorScheme === "dark" ? darkTheme : lightTheme),
    uiSize,
  };
  const navTheme = colorScheme === "dark" ? navDarkTheme : navLightTheme;

  return (
    <PortalProvider>
      <StyledThemeProvider theme={theme}>
        <SafeAreaProvider>
          <UserProvider>
            <ChecklistProvider>
              <NavigationThemeProvider value={navTheme}>
                <MainStack />
              </NavigationThemeProvider>
            </ChecklistProvider>
          </UserProvider>
        </SafeAreaProvider>
      </StyledThemeProvider>
    </PortalProvider>
  );
}
