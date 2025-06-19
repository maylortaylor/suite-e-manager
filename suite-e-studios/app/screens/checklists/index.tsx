/** @format */

import * as React from "react";

import {
  ActionButton,
  ActionButtonText,
  BottomBar,
  Container,
  Divider,
} from "@/app/components/ui/styled.components";

import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EditChecklistsScreen } from "./edit-checklists";
import { EditTaskListsScreen } from "./edit-task-lists";
import { EditTasksScreen } from "./edit-tasks";
import { UserMenu } from "@/app/components/ui/UserMenu";
import { View } from "react-native";
import { useRoute } from "@react-navigation/native";

const globalChecklists = require("../../../global.checklists.json");

export function ChecklistsScreen() {
  const route = useRoute();
  const initialTab =
    (route.params && (route.params as any).initialTab) || "checklists";
  const [activeTab, setActiveTab] = React.useState<
    "checklists" | "tasklists" | "tasks"
  >(initialTab);
  const [tasks, setTasks] = React.useState<any[]>(globalChecklists.tasks);
  const [taskLists, setTaskLists] = React.useState<any[]>(
    globalChecklists.taskLists
  );
  const [checklists, setChecklists] = React.useState<any[]>(
    globalChecklists.checklists
  );
  const [saving, setSaving] = React.useState(false);

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

  return (
    <Container>
      <View style={{ flex: 1, marginBottom: 72 }}>
        {activeTab === "checklists" && <EditChecklistsScreen />}
        {activeTab === "tasklists" && <EditTaskListsScreen />}
        {activeTab === "tasks" && <EditTasksScreen />}
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

        <Divider />

        <ActionButton
          onPress={() => setActiveTab("tasklists")}
          active={activeTab === "tasklists"}
        >
          <ActionButtonText active={activeTab === "tasklists"}>
            2.Task Lists
          </ActionButtonText>
        </ActionButton>

        <Divider />

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
