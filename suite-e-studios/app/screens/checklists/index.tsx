/** @format */

import * as React from "react";

import { useCallback, useState } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";

import { AppLayout } from "@/app/components/ui/AppLayout";
import { Container } from "@/app/components/ui/styled.components";
import { EditChecklistsScreen } from "./edit-checklists";
import { EditTaskListsScreen } from "./edit-task-lists";
import { EditTasksScreen } from "./edit-tasks";
import { MainStackParamList } from "../../navigation/main-stack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View } from "react-native";

type Props = NativeStackScreenProps<MainStackParamList, "Checklists">;

export function ChecklistsScreen({ navigation }: Props) {
  const route = useRoute();
  const initialTab =
    (route.params && (route.params as any).initialTab) || "checklists";
  const [activeTab, setActiveTab] = useState<
    "checklists" | "tasklists" | "tasks"
  >(initialTab);

  const checklistTabs = [
    { name: "1. Tasks", onPress: () => setActiveTab("tasks") },
    { name: "2. Task Lists", onPress: () => setActiveTab("tasklists") },
    { name: "3. Checklists", onPress: () => setActiveTab("checklists") },
  ];

  const getActiveTabName = () => {
    switch (activeTab) {
      case "tasks":
        return "1. Tasks";
      case "tasklists":
        return "2. Task Lists";
      case "checklists":
        return "3. Checklists";
      default:
        return "";
    }
  };

  useFocusEffect(
    useCallback(() => {
      // This will run when the screen comes into focus
      const parent = navigation.getParent();
      if (parent) {
        parent.setOptions({
          headerShown: true, // Or false, depending on your needs
        });
      }
    }, [navigation])
  );

  return (
    <AppLayout navigation={navigation}>
      <Container>
        <View style={{ flex: 1 }}>
          {activeTab === "checklists" && <EditChecklistsScreen />}
          {activeTab === "tasklists" && <EditTaskListsScreen />}
          {activeTab === "tasks" && <EditTasksScreen />}
        </View>
      </Container>
    </AppLayout>
  );
}
