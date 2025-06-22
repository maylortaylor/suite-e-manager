/** @format */

import * as React from "react";
import * as firestore from "../../services/firestore";

import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { StyleSheet, Text, View } from "react-native";

import type { Checklist } from "../../../types/checklist";
import { useChecklist } from "../../context/checklist-context";
import { useTheme } from "styled-components/native";
import { useUser } from "../../context/user-context";
import {
  Label,
} from "@/app/components/ui/styled.components";

export function CustomDrawerContent(props: any) {
  const { fetchFullChecklist } = useChecklist();
  const { state: userState, dispatch: userDispatch } = useUser();
  const theme = useTheme();
  const [checklists, setChecklists] = React.useState<Checklist[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    async function loadChecklists() {
      try {
        setIsLoading(true);
        const fetchedChecklists =
          await firestore.getCollection<Checklist>("checklists");
        setChecklists(fetchedChecklists);
        setError(null);
      } catch (e) {
        setError(e as Error);
        console.error("Failed to fetch checklists for drawer:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadChecklists();
  }, []);

  const handleLogout = () => {
    userDispatch({ type: "LOGOUT" });
    props.navigation.closeDrawer();
  };

  const handleChecklistPress = (checklistId: string) => {
    fetchFullChecklist(checklistId);
    props.navigation.closeDrawer();
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItem
          label="Home"
          labelStyle={{ color: theme.colors.text }}
          onPress={() => props.navigation.navigate("Home")}
        />
        {/* Custom items */}
        <View
          style={{ marginTop: 15, borderTopWidth: 1, borderTopColor: "#ccc" }}
        >
          <Label
            fontSize={theme.global.fontSize["lg"]}
            color={theme.colors.darkText}
          >
            All Checklists
          </Label>
          {isLoading ? (
            <Text style={{ padding: 15 }}>Loading checklists...</Text>
          ) : error ? (
            <Text style={{ padding: 15, color: "red" }}>
              Error: {error.message}
            </Text>
          ) : (
            checklists.map((checklist) => (
              <DrawerItem
                key={checklist.id}
                label={checklist.name}
                labelStyle={{ color: theme.colors.text }}
                onPress={() => handleChecklistPress(checklist.id)}
              />
            ))
          )}
        </View>
      </DrawerContentScrollView>
      {/* Bottom fixed buttons */}
      <View style={styles.bottomDrawerSection}>
        <DrawerItem
          label="Task Editor"
          labelStyle={{ color: theme.colors.text }}
          onPress={() => props.navigation.navigate("task-editor")}
        />
        <DrawerItem
          label="Settings"
          labelStyle={{ color: theme.colors.text }}
          onPress={() => props.navigation.navigate("Settings")}
        />
        {userState.user && (
          <DrawerItem
            label="Logout"
            labelStyle={{ color: theme.colors.text }}
            onPress={handleLogout}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
});
