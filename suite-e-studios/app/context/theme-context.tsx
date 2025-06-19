/** @format */

import React, { createContext, useContext, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useSystemColorScheme } from "react-native";

const THEME_KEY = "user-theme";
const UI_SIZE_KEY = "ui-size";

type ThemeMode = "system" | "light" | "dark";
type UISize = "comfy" | "large";

const ThemeContext = createContext<{
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  colorScheme: "light" | "dark";
  uiSize: UISize;
  setUISize: (size: UISize) => void;
}>({
  mode: "system",
  setMode: () => {},
  colorScheme: "light",
  uiSize: "comfy",
  setUISize: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useSystemColorScheme() ?? "light";
  const [mode, setMode] = useState<ThemeMode>("system");
  const [uiSize, setUISize] = useState<UISize>("comfy");

  useEffect(() => {
    // Load theme preference
    AsyncStorage.getItem(THEME_KEY).then((stored) => {
      if (stored === "light" || stored === "dark" || stored === "system")
        setMode(stored);
    });

    // Load UI size preference
    AsyncStorage.getItem(UI_SIZE_KEY).then((stored) => {
      if (stored === "comfy" || stored === "large") setUISize(stored);
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(THEME_KEY, mode);
  }, [mode]);

  useEffect(() => {
    AsyncStorage.setItem(UI_SIZE_KEY, uiSize);
  }, [uiSize]);

  const colorScheme = mode === "system" ? systemColorScheme : mode;

  return (
    <ThemeContext.Provider
      value={{ mode, setMode, colorScheme, uiSize, setUISize }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeContext);
}
