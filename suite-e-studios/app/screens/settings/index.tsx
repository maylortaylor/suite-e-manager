/** @format */

import {
  ActionButton,
  ActionButtonText,
  Container,
  Input,
  ItemBox,
  Label,
  Row,
  SectionTitle,
} from "@/app/components/ui/styled.components";
import {
  Alert,
  Dimensions,
  FlatList,
  ScrollView,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getSetting, saveSetting } from "../../../utils/storage";

import { UserMenu } from "@/app/components/ui/UserMenu";
import { useTheme } from "styled-components/native";
import { useThemeMode } from "../../context/theme-context";

const UI_SIZE_KEY = "ui-size";
const DARK_MODE_KEY = "dark-mode";
const CATEGORY_KEY = "task-categories";
const ROLE_KEY = "task-roles";

const DEFAULT_CATEGORIES = ["pre-event", "during-event", "post-event"];
const DEFAULT_ROLES = [
  "sound-engineer",
  "event-producer",
  "door-person",
  "bar-person",
];

type UiSize = "comfy" | "large";

export function SettingsScreen() {
  const { mode, setMode } = useThemeMode();
  const theme = useTheme();
  const [uiSize, setUiSize] = useState<UiSize>("comfy");

  // Categories and roles state
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [roles, setRoles] = useState<string[]>(DEFAULT_ROLES);
  const [newCategory, setNewCategory] = useState("");
  const [newRole, setNewRole] = useState("");
  const [saving, setSaving] = useState(false);

  const maxListHeight = Dimensions.get("window").height * 0.25;

  useEffect(() => {
    getSetting(UI_SIZE_KEY).then((value) => {
      if (value === "large" || value === "comfy") setUiSize(value);
    });
    getSetting(CATEGORY_KEY).then((value) => {
      if (value) {
        try {
          setCategories(JSON.parse(value));
        } catch {}
      }
    });
    getSetting(ROLE_KEY).then((value) => {
      if (value) {
        try {
          setRoles(JSON.parse(value));
        } catch {}
      }
    });
  }, []);

  function handleUiSizeToggle() {
    const newSize = uiSize === "comfy" ? "large" : "comfy";
    setUiSize(newSize);
    saveSetting(UI_SIZE_KEY, newSize);
  }

  function addCategory() {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      Alert.alert("Duplicate", "Category already exists.");
      return;
    }
    setCategories([...categories, trimmed]);
    setNewCategory("");
  }

  function removeCategory(cat: string) {
    setCategories(categories.filter((c: string) => c !== cat));
  }

  function addRole() {
    const trimmed = newRole.trim();
    if (!trimmed) return;
    if (roles.includes(trimmed)) {
      Alert.alert("Duplicate", "Role already exists.");
      return;
    }
    setRoles([...roles, trimmed]);
    setNewRole("");
  }

  function removeRole(role: string) {
    setRoles(roles.filter((r: string) => r !== role));
  }

  async function handleSaveSettings() {
    setSaving(true);
    try {
      await saveSetting(CATEGORY_KEY, JSON.stringify(categories));
      await saveSetting(ROLE_KEY, JSON.stringify(roles));
      Alert.alert("Saved", "Settings saved successfully.");
    } catch (e) {
      Alert.alert("Error", "Failed to save settings.");
    }
    setSaving(false);
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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

        {/* Categories Section */}
        <SectionTitle style={{ marginTop: 32 }}>Task Categories</SectionTitle>
        <Row>
          <Input
            value={newCategory}
            onChangeText={setNewCategory}
            placeholder="Add new category"
            theme={theme}
            style={{ flex: 1 }}
          />
          <ActionButton
            onPress={addCategory}
            theme={theme}
            backgroundColor={theme.colors.accent}
            style={{ marginLeft: 8 }}
          >
            <ActionButtonText theme={theme}>Add</ActionButtonText>
          </ActionButton>
        </Row>
        <ItemBox theme={theme} style={{ maxHeight: maxListHeight }}>
          <FlatList
            data={categories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Row>
                <Label style={{ flex: 1 }}>{item}</Label>
                <TouchableOpacity onPress={() => removeCategory(item)}>
                  <ActionButtonText
                    theme={theme}
                    style={{ color: theme.colors.highlight }}
                  >
                    Remove
                  </ActionButtonText>
                </TouchableOpacity>
              </Row>
            )}
            scrollEnabled={true}
          />
        </ItemBox>

        {/* Roles Section */}
        <SectionTitle style={{ marginTop: 32 }}>Task Roles</SectionTitle>
        <Row>
          <Input
            value={newRole}
            onChangeText={setNewRole}
            placeholder="Add new role"
            theme={theme}
            style={{ flex: 1 }}
          />
          <ActionButton
            onPress={addRole}
            theme={theme}
            style={{ marginLeft: 8 }}
          >
            <ActionButtonText theme={theme}>Add</ActionButtonText>
          </ActionButton>
        </Row>
        <ItemBox theme={theme} style={{ maxHeight: maxListHeight }}>
          <FlatList
            data={roles}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Row>
                <Label style={{ flex: 1 }}>{item}</Label>
                <TouchableOpacity onPress={() => removeRole(item)}>
                  <ActionButtonText
                    theme={theme}
                    style={{ color: theme.colors.highlight }}
                  >
                    Remove
                  </ActionButtonText>
                </TouchableOpacity>
              </Row>
            )}
            scrollEnabled={true}
          />
        </ItemBox>

        {/* Save Settings Button */}
        <ActionButton
          onPress={handleSaveSettings}
          theme={theme}
          style={{
            marginTop: 32,
            width: "100%",
            height: 48,
            alignSelf: "center",
          }}
          disabled={saving}
        >
          <ActionButtonText theme={theme} style={{ fontWeight: "bold" }}>
            {saving ? "Saving..." : "Save Settings"}
          </ActionButtonText>
        </ActionButton>
      </Container>
    </ScrollView>
  );
}
