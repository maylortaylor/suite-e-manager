/** @format */

import * as React from "react";

import {
  Container,
  Label,
  Row,
  SectionTitle,
} from "@/app/components/ui/styled.components";
import { getSetting, saveSetting } from "../../../utils/storage";

import { UserMenu } from "@/app/components/ui/UserMenu";
import { Switch } from "react-native";
import { useColorScheme } from "react-native";
import { useTheme } from "styled-components/native";

const UI_SIZE_KEY = "ui-size";
const DARK_MODE_KEY = "dark-mode";

type UiSize = "comfy" | "large";

export function SettingsScreen() {
  const systemColorScheme = useColorScheme();
  const theme = useTheme();
  const [isDarkMode, setIsDarkMode] = React.useState(
    systemColorScheme === "dark"
  );
  const [uiSize, setUiSize] = React.useState<UiSize>("comfy");

  React.useEffect(() => {
    getSetting(DARK_MODE_KEY).then((value) => {
      if (value === "true") setIsDarkMode(true);
      if (value === "false") setIsDarkMode(false);
    });
    getSetting(UI_SIZE_KEY).then((value) => {
      if (value === "large" || value === "comfy") setUiSize(value);
    });
  }, []);

  function handleDarkModeToggle(value: boolean) {
    setIsDarkMode(value);
    saveSetting(DARK_MODE_KEY, value ? "true" : "false");
  }

  function handleUiSizeToggle() {
    const newSize = uiSize === "comfy" ? "large" : "comfy";
    setUiSize(newSize);
    saveSetting(UI_SIZE_KEY, newSize);
  }

  return (
    <Container>
      <SectionTitle>User Settings</SectionTitle>
      <Row>
        <Label>Dark Mode</Label>
        <Switch
          value={isDarkMode}
          onValueChange={handleDarkModeToggle}
          trackColor={{ false: theme.colors.input, true: theme.colors.input }}
        />
      </Row>
      <Row>
        <Label>UI Size: {uiSize === "large" ? "Large" : "Comfy"}</Label>
        <Switch
          value={uiSize === "large"}
          onValueChange={handleUiSizeToggle}
          trackColor={{ false: theme.colors.input, true: theme.colors.input }}
        />
      </Row>
    </Container>
  );
}
