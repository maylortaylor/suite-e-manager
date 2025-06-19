/** @format */

import * as React from "react";

import {
  ActionButton,
  ActionButtonText,
  BottomBar,
  Container,
} from "@/app/components/ui/styled.components";
import { useCallback, useState } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";

import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "@/app/components/ui/Button";
import { ChecklistBox } from "@/app/components/ui/ChecklistBox";
import { Divider } from "@/app/components/ui/Divider";
import { EditChecklistsScreen } from "./edit-checklists";
import { EditTaskListsScreen } from "./edit-task-lists";
import { EditTasksScreen } from "./edit-tasks";
import { View } from "react-native";
import { useTheme } from "styled-components/native";

const defaultChecklists = require("../../../global.checklists.json");

export function ChecklistsScreen() {
  const theme = useTheme();
  const route = useRoute();
  const initialTab =
    (route.params && (route.params as any).initialTab) || "checklists";
  const [activeTab, setActiveTab] = useState<
    "checklists" | "tasklists" | "tasks"
  >(initialTab);
  const [tasks, setTasks] = useState<any[]>([]);
  const [taskLists, setTaskLists] = useState<any[]>([]);
  const [checklists, setChecklists] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load from AsyncStorage on mount/focus
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      async function loadData() {
        try {
          const stored = await AsyncStorage.getItem("global.checklists.json");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (isActive) {
              setTasks(parsed.tasks || []);
              setTaskLists(parsed.taskLists || []);
              setChecklists(parsed.checklists || []);
            }
          } else {
            // Optionally, populate from static file on first launch
            if (isActive) {
              setTasks(defaultChecklists.tasks || []);
              setTaskLists(defaultChecklists.taskLists || []);
              setChecklists(defaultChecklists.checklists || []);
              // Save to AsyncStorage for future loads
              await AsyncStorage.setItem(
                "global.checklists.json",
                JSON.stringify({
                  tasks: defaultChecklists.tasks || [],
                  taskLists: defaultChecklists.taskLists || [],
                  checklists: defaultChecklists.checklists || [],
                })
              );
            }
          }
        } catch (e) {
          // fallback to empty
          if (isActive) {
            setTasks([]);
            setTaskLists([]);
            setChecklists([]);
          }
        }
        if (isActive) setLoaded(true);
      }
      loadData();
      return () => {
        isActive = false;
      };
    }, [])
  );

  async function handleSave() {
    setSaving(true);
    try {
      await AsyncStorage.setItem(
        "global.checklists.json",
        JSON.stringify({ tasks, taskLists, checklists })
      );
      Alert.alert("Saved", "Checklist data saved to storage.");
    } catch (e) {
      Alert.alert("Error", "Failed to save data.");
    }
    setSaving(false);
  }

  function updateTask(index: number, key: string, value: string) {
    const updated = [...tasks];
    updated[index] = { ...updated[index], [key]: value };
    setTasks(updated);
  }
  function updateTaskList(index: number, key: string, value: string) {
    const updated = [...taskLists];
    if (key === "taskIds") {
      updated[index] = { ...updated[index], taskIds: value.split(",") };
    } else {
      updated[index] = { ...updated[index], [key]: value };
    }
    setTaskLists(updated);
  }
  function updateChecklist(
    index: number,
    key: string,
    value: string | string[]
  ) {
    const updated = [...checklists];
    if (key === "taskListIds" || key === "taskIds") {
      updated[index] = {
        ...updated[index],
        [key]: Array.isArray(value) ? value : value.split(","),
      };
    } else {
      updated[index] = { ...updated[index], [key]: value };
    }
    setChecklists(updated);
  }

  if (!loaded) return null; // or a loading spinner
  return (
    <Container>
      <View style={{ flex: 1, marginBottom: 72 }}>
        {activeTab === "checklists" && (
          <EditChecklistsScreen
            checklists={checklists}
            setChecklists={setChecklists}
            updateChecklist={updateChecklist}
            saving={saving}
            handleSave={handleSave}
            tasks={tasks}
            taskLists={taskLists}
          />
        )}
        {activeTab === "tasklists" && (
          <EditTaskListsScreen
            taskLists={taskLists}
            setTaskLists={setTaskLists}
            updateTaskList={updateTaskList}
            saving={saving}
            handleSave={handleSave}
            tasks={tasks}
          />
        )}
        {activeTab === "tasks" && (
          <EditTasksScreen
            tasks={tasks}
            setTasks={setTasks}
            updateTask={updateTask}
            saving={saving}
            handleSave={handleSave}
          />
        )}
      </View>

      <BottomBar>
        <ActionButton
          onPress={() => setActiveTab("tasks")}
          active={activeTab === "tasks"}
        >
          <ActionButtonText active={activeTab === "tasks"}>
            1. Tasks
          </ActionButtonText>
        </ActionButton>

        <Divider
          orientation="vertical"
          thickness={1}
          length={8}
          marginHorizontal={8}
          color={theme.colors.divider}
        />

        <ActionButton
          onPress={() => setActiveTab("tasklists")}
          active={activeTab === "tasklists"}
        >
          <ActionButtonText active={activeTab === "tasklists"}>
            2.Task Lists
          </ActionButtonText>
        </ActionButton>

        <Divider
          orientation="vertical"
          thickness={1}
          length={8}
          marginHorizontal={8}
          color={theme.colors.divider}
        />
        <ActionButton
          onPress={() => setActiveTab("checklists")}
          active={activeTab === "checklists"}
        >
          <ActionButtonText active={activeTab === "checklists"}>
            3. Checklists
          </ActionButtonText>
        </ActionButton>
      </BottomBar>
    </Container>
  );
}
