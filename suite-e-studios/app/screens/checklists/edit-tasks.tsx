/** @format */

import * as Clipboard from "expo-clipboard";

import { Alert, Button, ScrollView, View } from "react-native";
import {
  Container,
  Input,
  ItemBox,
  ItemLabel,
  Label,
} from "@/app/components/ui/styled.components";
import React, { useCallback, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Collapsible } from "../../components/ui/Collapsible";
import { Divider } from "@/app/components/ui/Divider";
import { IconSymbol } from "@/app/components/ui/IconSymbol";
import { StyledPicker } from "@/app/components/ui/StyledPicker";
import { TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components/native";

const globalChecklists = require("../../../global.checklists.json");
const CATEGORY_KEY = "task-categories";
const ROLE_KEY = "task-roles";
const DEFAULT_CATEGORIES = ["pre-event", "during-event", "post-event"];
const DEFAULT_ROLES = [
  "sound-engineer",
  "event-producer",
  "door-person",
  "bar-person",
];

// Simple unique ID generator for tasks
function generateTaskId() {
  return (
    "T-" +
    Math.random().toString(36).substr(2, 8) +
    "-" +
    Math.random().toString(36).substr(2, 4) +
    "-" +
    Math.random().toString(36).substr(2, 4)
  );
}

export function EditTasksScreen({
  tasks,
  setTasks,
  updateTask,
  saving,
  handleSave,
}: {
  tasks: any[];
  setTasks: (value: any[] | ((prev: any[]) => any[])) => void;
  updateTask: (index: number, key: string, value: string) => void;
  saving: boolean;
  handleSave: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const theme = useTheme();
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [roles, setRoles] = useState<string[]>(DEFAULT_ROLES);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      async function load() {
        const cat = await AsyncStorage.getItem(CATEGORY_KEY);
        if (cat && isActive) {
          try {
            setCategories(JSON.parse(cat));
          } catch {}
        }
        const role = await AsyncStorage.getItem(ROLE_KEY);
        if (role && isActive) {
          try {
            setRoles(JSON.parse(role));
          } catch {}
        }
      }
      load();
      return () => {
        isActive = false;
      };
    }, [])
  );

  function handleAddTask() {
    setAdding(true);
    const newTask = {
      id: generateTaskId(),
      description: "",
      category: "",
      role: "",
    };
    setTasks((prev: any[]) => [...prev, newTask]);
    setAdding(false);
  }

  return (
    <ScrollView>
      <Label>Tasks</Label>
      <Container>
        {tasks.map((t: any, i: number) => (
          <Collapsible key={t.id} title={t.description || "(New Task)"}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <TouchableOpacity
                onPress={async () => {
                  await Clipboard.setStringAsync(t.id);
                  Alert.alert("Copied", "Task ID copied to clipboard");
                }}
                style={{ marginRight: 6 }}
              >
                <IconSymbol
                  name="doc.on.doc"
                  size={20}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
              <ItemLabel fontSize={10} style={{ marginRight: 4 }}>
                Task ID:
              </ItemLabel>
              <ItemLabel fontSize={10}>{t.id}</ItemLabel>
            </View>
            <ItemBox>
              <ItemLabel>Description</ItemLabel>
              <Input
                value={t.description}
                onChangeText={(v: string) => updateTask(i, "description", v)}
              />
              <ItemLabel>Category</ItemLabel>
              <StyledPicker
                value={t.category}
                onValueChange={(v: string) => updateTask(i, "category", v)}
                items={categories.map((cat: string) => ({
                  label: cat,
                  value: cat,
                }))}
                placeholder="Select category..."
              />
              <ItemLabel>Role</ItemLabel>
              <StyledPicker
                value={t.role}
                onValueChange={(v: string) => updateTask(i, "role", v)}
                items={roles.map((role: string) => ({
                  label: role,
                  value: role,
                }))}
                placeholder="Select role..."
              />
            </ItemBox>
          </Collapsible>
        ))}
        <View style={{ marginTop: 24 }} />
        <Button
          title={saving ? "Saving..." : "+ ADD TASK"}
          onPress={handleAddTask}
          disabled={saving}
        />
        <Divider
          orientation="horizontal"
          thickness={1}
          length={8}
          marginVertical={40}
          marginHorizontal={40}
          color={theme.colors.divider}
        />
        <Button
          title={saving ? "Saving..." : "Save All"}
          onPress={handleSave}
          disabled={saving}
        />
        <Divider
          orientation="horizontal"
          thickness={1}
          length={8}
          marginVertical={40}
          marginHorizontal={40}
          color={theme.colors.divider}
        />
      </Container>
    </ScrollView>
  );
}
