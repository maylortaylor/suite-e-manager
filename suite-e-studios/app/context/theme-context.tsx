/** @format */

import React, { createContext, useContext, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useSystemColorScheme } from "react-native";

const THEME_KEY = "user-theme";

type ThemeMode = "system" | "light" | "dark";

const ThemeContext = createContext<{
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  colorScheme: "light" | "dark";
}>({
  mode: "system",
  setMode: () => {},
  colorScheme: "light",
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useSystemColorScheme() ?? "light";
  const [mode, setMode] = useState<ThemeMode>("system");

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((stored) => {
      if (stored === "light" || stored === "dark" || stored === "system")
        setMode(stored);
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(THEME_KEY, mode);
  }, [mode]);

  const colorScheme = mode === "system" ? systemColorScheme : mode;

  return (
    <ThemeContext.Provider value={{ mode, setMode, colorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeContext);
}
