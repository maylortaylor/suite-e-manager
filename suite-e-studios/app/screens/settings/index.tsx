/** @format */

import {
  Alert,
  Dimensions,
  FlatList,
  ScrollView,
  Switch,
  View,
} from "react-native";
import {
  Container,
  Input,
  ItemBox,
  Label,
  Row,
  SectionTitle,
} from "@/app/components/ui/styled.components";
import React, { useEffect, useState } from "react";
import { getSetting, saveSetting } from "../../../utils/storage";

import { AppLayout } from "@/app/components/ui/AppLayout";
import { Button } from "@/app/components/ui/Button";
import { Divider } from "@/app/components/ui/Divider";
import { MainStackParamList } from "../../navigation/main-stack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { auth } from "../../services/firebase";
import { signOut } from "firebase/auth";
import { toast } from "../../../utils/toast";
import { useTheme } from "styled-components/native";
import { useThemeMode } from "../../context/theme-context";
import { useUser } from "../../context/user-context";

const CATEGORY_KEY = "task-categories";
const ROLE_KEY = "task-roles";

const DEFAULT_CATEGORIES = ["pre-event", "during-event", "post-event"];
const DEFAULT_ROLES = [
  "sound-engineer",
  "event-producer",
  "door-person",
  "bar-person",
];

type Props = NativeStackScreenProps<MainStackParamList, "Settings">;

export function SettingsScreen({ navigation }: Props) {
  const { mode, setMode, uiSize, setUISize } = useThemeMode();
  const theme = useTheme();
  const { dispatch: userDispatch } = useUser();

  // Categories and roles state
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [roles, setRoles] = useState<string[]>(DEFAULT_ROLES);
  const [newCategory, setNewCategory] = useState("");
  const [newRole, setNewRole] = useState("");
  const [saving, setSaving] = useState(false);

  const maxListHeight = Dimensions.get("window").height * 0.25;

  useEffect(() => {
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
    setUISize(uiSize === "comfy" ? "large" : "comfy");
  }

  function addCategory() {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      toast.error("Category already exists");
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
      toast.error("Role already exists");
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
      toast.success("Settings saved successfully");
    } catch (e) {
      toast.error("Failed to save settings");
    }
    setSaving(false);
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      userDispatch({ type: "LOGOUT" });
      toast.success("You have been logged out.");
    } catch (error) {
      toast.error("Failed to log out.");
      console.error("Logout Error:", error);
    }
  }

  return (
    <AppLayout navigation={navigation}>
      <ScrollView contentContainerStyle={{ paddingBottom: 1000 }}>
        <Container>
          <SectionTitle>User Settings</SectionTitle>
          <Row>
            <Label>Dark Mode</Label>
            <Switch
              value={mode === "dark"}
              onValueChange={(val) => setMode(val ? "dark" : "light")}
              trackColor={{
                false: theme.colors.input,
                true: theme.colors.input,
              }}
            />
          </Row>
          <Row>
            <Label>UI Size: {uiSize === "large" ? "Large" : "Comfy"}</Label>
            <Switch
              value={uiSize === "large"}
              onValueChange={handleUiSizeToggle}
              trackColor={{
                false: theme.colors.input,
                true: theme.colors.input,
              }}
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
            <Button
              variant="accent"
              size="small"
              onPress={addCategory}
              style={{ marginLeft: 8 }}
            >
              Add
            </Button>
          </Row>
          <ItemBox theme={theme} style={{ maxHeight: maxListHeight }}>
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Row>
                  <Label style={{ flex: 1 }} fontSize={24}>
                    {item}
                  </Label>
                  <Button
                    variant="highlight"
                    size="small"
                    onPress={() => removeCategory(item)}
                  >
                    Remove
                  </Button>
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
            <Button
              variant="accent"
              size="small"
              onPress={addRole}
              style={{ marginLeft: 8 }}
            >
              Add
            </Button>
          </Row>
          <ItemBox theme={theme} style={{ maxHeight: maxListHeight }}>
            <FlatList
              data={roles}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Row>
                  <Label style={{ flex: 1 }} fontSize={24}>
                    {item}
                  </Label>
                  <Button
                    variant="highlight"
                    size="small"
                    onPress={() => removeRole(item)}
                  >
                    Remove
                  </Button>
                </Row>
              )}
              scrollEnabled={true}
            />
          </ItemBox>

          {/* Save Settings Button */}
          <Button
            variant="primary"
            size="large"
            onPress={handleSaveSettings}
            disabled={saving}
            fullWidth
            style={{ marginTop: 32 }}
          >
            {saving ? "Saving..." : "Save Settings"}
          </Button>

          {/* Logout Button */}
          <Divider
            orientation="horizontal"
            thickness={1}
            length={8}
            marginVertical={40}
            marginHorizontal={40}
            color={theme.colors.divider}
          />
          <Button
            variant="highlight"
            size="large"
            onPress={handleLogout}
            fullWidth
          >
            Logout
          </Button>
        </Container>
      </ScrollView>
    </AppLayout>
  );
}
