/** @format */

import * as React from "react";

import {
  Container,
  Label,
  Row,
  SectionTitle,
} from "@/app/components/ui/styled.components";
import { getSetting, saveSetting } from "../../../utils/storage";

import { Switch } from "react-native";
import { UserMenu } from "@/app/components/ui/UserMenu";
import { useColorScheme } from "react-native";
import { useTheme } from "styled-components/native";
import { useThemeMode } from "../../context/theme-context";

const UI_SIZE_KEY = "ui-size";
const DARK_MODE_KEY = "dark-mode";

type UiSize = "comfy" | "large";

export function SettingsScreen() {
  const { mode, setMode } = useThemeMode();
  const theme = useTheme();
  const [uiSize, setUiSize] = React.useState<UiSize>("comfy");

  React.useEffect(() => {
    getSetting(UI_SIZE_KEY).then((value) => {
      if (value === "large" || value === "comfy") setUiSize(value);
    });
  }, []);

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
          value={mode === "dark"}
          onValueChange={(val) => setMode(val ? "dark" : "light")}
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
