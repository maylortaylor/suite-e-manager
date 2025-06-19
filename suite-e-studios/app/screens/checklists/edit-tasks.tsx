/** @format */

import * as Clipboard from "expo-clipboard";

import { Button, ScrollView, View } from "react-native";
import {
  Container,
  Input,
  ItemBox,
  ItemLabel,
  Label,
} from "@/app/components/ui/styled.components";
import React, { useCallback, useState } from "react";
import type { Task, TaskCategory, TaskRole } from "../../../types/task";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Collapsible } from "../../components/ui/Collapsible";
import { Divider } from "@/app/components/ui/Divider";
import { IconSymbol } from "@/app/components/ui/IconSymbol";
import { StyledPicker } from "@/app/components/ui/StyledPicker";
import { TouchableOpacity } from "react-native";
import { toast } from "../../../utils/toast";
import { useChecklist } from "../../context/checklist-context";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components/native";

const CATEGORY_KEY = "task-categories";
const ROLE_KEY = "task-roles";
const DEFAULT_CATEGORIES: TaskCategory[] = [
  "pre-event",
  "during-event",
  "post-event",
];
const DEFAULT_ROLES: TaskRole[] = [
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

export function EditTasksScreen() {
  const theme = useTheme();
  const { state, dispatch } = useChecklist();
  const [categories, setCategories] =
    useState<TaskCategory[]>(DEFAULT_CATEGORIES);
  const [roles, setRoles] = useState<TaskRole[]>(DEFAULT_ROLES);

  // Load categories and roles from AsyncStorage
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      async function load() {
        const cat = await AsyncStorage.getItem(CATEGORY_KEY);
        if (cat && isActive) {
          try {
            const parsed = JSON.parse(cat);
            // Validate that all categories are valid TaskCategory
            if (
              parsed.every((c: string): c is TaskCategory =>
                DEFAULT_CATEGORIES.includes(c as TaskCategory)
              )
            ) {
              setCategories(parsed);
            }
          } catch {}
        }
        const role = await AsyncStorage.getItem(ROLE_KEY);
        if (role && isActive) {
          try {
            const parsed = JSON.parse(role);
            // Validate that all roles are valid TaskRole
            if (
              parsed.every((r: string): r is TaskRole =>
                DEFAULT_ROLES.includes(r as TaskRole)
              )
            ) {
              setRoles(parsed);
            }
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
    const newTask: Task = {
      id: generateTaskId(),
      description: "",
      category: categories[0] || "pre-event",
      role: roles[0] || "sound-engineer",
      isComplete: false,
    };
    dispatch({ type: "ADD_TASK", task: newTask });
  }

  function handleUpdateTask(index: number, key: string, value: string) {
    const updatedTask = {
      ...state.tasks[index],
      [key]: value,
    };
    dispatch({ type: "UPDATE_TASK", task: updatedTask as Task });
  }

  async function handleSave() {
    try {
      dispatch({ type: "SET_LOADING", isLoading: true });
      dispatch({
        type: "SAVE_ALL",
        data: {
          tasks: state.tasks,
          taskLists: state.taskLists,
          checklists: state.checklists,
        },
      });
      toast.success("Tasks saved successfully");
    } catch (e) {
      toast.error("Failed to save tasks");
      dispatch({ type: "SET_ERROR", error: e as Error });
    } finally {
      dispatch({ type: "SET_LOADING", isLoading: false });
    }
  }

  if (state.isLoading) {
    return (
      <Container>
        <Label>Loading tasks...</Label>
      </Container>
    );
  }

  if (state.error) {
    return (
      <Container>
        <Label>Error: {state.error.message}</Label>
        <Button title="Retry" onPress={handleSave} />
      </Container>
    );
  }

  return (
    <ScrollView>
      <Label>Tasks</Label>
      <Container>
        {state.tasks.map((t: Task, i: number) => (
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
                  toast.info("Task ID copied to clipboard");
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
                onChangeText={(v: string) =>
                  handleUpdateTask(i, "description", v)
                }
              />
              <ItemLabel>Category</ItemLabel>
              <StyledPicker
                value={t.category}
                onValueChange={(v: string) =>
                  handleUpdateTask(i, "category", v)
                }
                items={categories.map((cat: TaskCategory) => ({
                  label: cat,
                  value: cat,
                }))}
                placeholder="Select category..."
              />
              <ItemLabel>Role</ItemLabel>
              <StyledPicker
                value={t.role}
                onValueChange={(v: string) => handleUpdateTask(i, "role", v)}
                items={roles.map((role: TaskRole) => ({
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
          title={state.isLoading ? "Adding..." : "+ ADD TASK"}
          onPress={handleAddTask}
          disabled={state.isLoading}
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
          title={state.isLoading ? "Saving..." : "Save All"}
          onPress={handleSave}
          disabled={state.isLoading}
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
