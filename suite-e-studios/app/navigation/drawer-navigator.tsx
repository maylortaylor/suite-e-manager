/** @format */

import {
  DrawerContentComponentProps,
  createDrawerNavigator,
} from "@react-navigation/drawer";

import { ChecklistsScreen } from "../screens/checklists";
import { CustomDrawerContent } from "../components/ui/CustomDrawerContent";
import { HomeScreen } from "../screens/home";
import { SettingsScreen } from "../screens/settings";
import { useTheme } from "styled-components/native";

export type DrawerParamList = {
  Home: undefined;
  "task-editor": { tab?: "tasks" | "tasklists" | "checklists" };
  Settings: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export function DrawerNavigator() {
  const theme = useTheme();

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props: DrawerContentComponentProps) => (
        <CustomDrawerContent {...props} />
      )}
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen
        name="task-editor"
        component={ChecklistsScreen}
        options={{
          drawerLabel: () => null,
          headerTitle: "Task & Checklist Editor",
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ drawerLabel: () => null }}
      />
    </Drawer.Navigator>
  );
}
