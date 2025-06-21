/** @format */

import * as React from "react";

import { Tab, Tabs } from "@/app/components/ui/Tabs";
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
type ChecklistTab = "tasks" | "tasklists" | "checklists";

export function ChecklistsScreen({ navigation }: Props) {
  const route = useRoute();
  const [activeTab, setActiveTab] = useState<ChecklistTab>("tasks");

  useFocusEffect(
    useCallback(() => {
      const currentTab = (route.params as any)?.tab || "tasks";
      setActiveTab(currentTab as ChecklistTab);
    }, [route.params])
  );

  const checklistTabs: Tab<ChecklistTab>[] = [
    { name: "1. Tasks", target: "tasks" },
    { name: "2. Task Lists", target: "tasklists" },
    { name: "3. Checklists", target: "checklists" },
  ];

  const handleTabPress = (target: ChecklistTab) => {
    setActiveTab(target);
    navigation.setParams({ tab: target });
  };

  return (
    <AppLayout navigation={navigation}>
      <Tabs
        tabs={checklistTabs}
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
      <Container>
        <View style={{ flex: 1, paddingTop: 16 }}>
          {activeTab === "checklists" && <EditChecklistsScreen />}
          {activeTab === "tasklists" && <EditTaskListsScreen />}
          {activeTab === "tasks" && <EditTasksScreen />}
        </View>
      </Container>
    </AppLayout>
  );
}
