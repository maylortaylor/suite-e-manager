/** @format */

import * as React from "react";

import { Tab, Tabs } from "@/app/components/ui/Tabs";
import { useCallback, useState } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";

import { AppLayout } from "@/app/components/ui/AppLayout";
import { Container } from "@/app/components/ui/styled.components";
import { DrawerParamList } from "../../navigation/drawer-navigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { EditChecklistsScreen } from "./edit-checklists";
import { EditTaskListsScreen } from "./edit-task-lists";
import { EditTasksScreen } from "./edit-tasks";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";

type Props = DrawerScreenProps<DrawerParamList, "task-editor">;
type ChecklistTab = "tasks" | "tasklists" | "checklists";

export function ChecklistsScreen({ }: Props) {
  const navigation = useNavigation();
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
    navigation.setParams({ tab: target } as any);
  };

  return (
    <AppLayout>
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
