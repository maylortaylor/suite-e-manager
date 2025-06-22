/** @format */

import * as React from "react";
import * as firestore from "../../services/firestore";

import {
  DrawerButton,
  DrawerButtonText,
  Label,
} from "@/app/components/ui/styled.components";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { StyleSheet, Text, View } from "react-native";

import type { Checklist } from "../../../types/checklist";
import { useChecklist } from "../../context/checklist-context";
import { useTheme } from "styled-components/native";
import { useUser } from "../../context/user-context";

interface CustomDrawerItemProps {
  label: string;
  onPress: () => void;
}

const CustomDrawerItem: React.FC<CustomDrawerItemProps> = ({
  label,
  onPress,
}) => {
  const theme = useTheme();
  return (
    <DrawerButton theme={theme} onPress={onPress}>
      <DrawerButtonText theme={theme}>{label}</DrawerButtonText>
    </DrawerButton>
  );
};

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
    props.navigation.navigate("Home");
    props.navigation.closeDrawer();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <DrawerContentScrollView {...props}>
        <CustomDrawerItem
          label="Home"
          onPress={() => props.navigation.navigate("Home")}
        />
        {/* Custom items */}
        <View
          style={{
            marginTop: 15,
            borderTopWidth: 1,
            borderTopColor: theme.colors.divider,
            paddingTop: 10,
          }}
        >
          <Label
            fontSize={theme.global.fontSize["lg"]}
            color={theme.colors.text}
            style={{ marginBottom: 10, marginLeft: 10 }}
          >
            All Checklists
          </Label>
          {isLoading ? (
            <Text style={{ padding: 15, color: theme.colors.text }}>
              Loading checklists...
            </Text>
          ) : error ? (
            <Text style={{ padding: 15, color: "red" }}>
              Error: {error.message}
            </Text>
          ) : (
            checklists.map((checklist) => (
              <CustomDrawerItem
                key={checklist.id}
                label={checklist.name}
                onPress={() => handleChecklistPress(checklist.id)}
              />
            ))
          )}
        </View>
      </DrawerContentScrollView>
      {/* Bottom fixed buttons */}
      <View
        style={[
          styles.bottomDrawerSection,
          { borderTopColor: theme.colors.divider },
        ]}
      >
        <CustomDrawerItem
          label="Task Editor"
          onPress={() => props.navigation.navigate("task-editor")}
        />
        <CustomDrawerItem
          label="Settings"
          onPress={() => props.navigation.navigate("Settings")}
        />
        {userState.user && (
          <CustomDrawerItem label="Logout" onPress={handleLogout} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopWidth: 1,
  },
});
