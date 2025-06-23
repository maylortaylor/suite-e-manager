/** @format */

import * as Clipboard from "expo-clipboard";
import * as firestore from "../../services/firestore";

import { Button, ScrollView, TouchableOpacity, View } from "react-native";
import {
  Container,
  Input,
  ItemBox,
  ItemLabel,
  Label,
} from "@/app/components/ui/styled.components";
import React, { useCallback, useEffect, useState } from "react";
import type { Task, TaskCategory, TaskRole } from "../../../types/task";
import { doc, writeBatch } from "firebase/firestore";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Collapsible } from "../../components/ui/Collapsible";
import { Divider } from "@/app/components/ui/Divider";
import { IconSymbol } from "@/app/components/ui/IconSymbol";
import { StyledPicker } from "@/app/components/ui/StyledPicker";
import { db } from "../../services/firebase"; // Import db for batch writes
import { toast } from "../../../utils/toast";
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [categories, setCategories] =
    useState<TaskCategory[]>(DEFAULT_CATEGORIES);
  const [roles, setRoles] = useState<TaskRole[]>(DEFAULT_ROLES);

  // Fetch all tasks from Firestore on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const fetchedTasks = await firestore.getCollection<Task>("tasks");
        setTasks(fetchedTasks);
        setError(null);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Load categories and roles from AsyncStorage
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      async function load() {
        const cat = await AsyncStorage.getItem(CATEGORY_KEY);
        if (cat && isActive) {
          try {
            const parsed = JSON.parse(cat);
            setCategories(parsed);
          } catch {}
        }
        const role = await AsyncStorage.getItem(ROLE_KEY);
        if (role && isActive) {
          try {
            const parsed = JSON.parse(role);
            setRoles(parsed);
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
    setTasks((prevTasks) => [...prevTasks, newTask]);
  }

  function handleUpdateTask(index: number, key: string, value: string) {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], [key]: value };
    setTasks(updatedTasks);
  }

  async function handleSave() {
    setIsLoading(true);
    try {
      const batch = writeBatch(db);
      tasks.forEach((task) => {
        const taskRef = doc(db, "tasks", task.id);
        batch.set(taskRef, task); // Use set with merge:true to handle both new and existing
      });
      await batch.commit();
      toast.success("Tasks saved successfully!");
    } catch (e) {
      toast.error("Failed to save tasks.");
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <Container>
        <Label>Loading tasks...</Label>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Label>Error: {error.message}</Label>
      </Container>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 850 }}>
      <Label>Tasks</Label>
      <Container>
        {tasks.map((t: Task, i: number) => (
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
          title={isLoading ? "Adding..." : "+ ADD TASK"}
          onPress={handleAddTask}
          disabled={isLoading}
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
          title={isLoading ? "Saving..." : "Save All"}
          onPress={handleSave}
          disabled={isLoading}
        />
      </Container>
    </ScrollView>
  );
}
