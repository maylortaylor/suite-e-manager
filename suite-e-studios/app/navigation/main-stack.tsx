/** @format */

import * as React from "react";

import CalendarScreen from "../screens/calendar";
import { ChecklistsScreen } from "../screens/checklists";
import { HomeScreen } from "../screens/home";
import { SettingsScreen } from "../screens/settings";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useUser } from "../context/user-context";

// import NotFoundScreen from "../+not-found";

export type MainStackParamList = {
  Home: undefined;
  Settings: undefined;
  Checklists: { tab?: "tasks" | "tasklists" | "checklists" };
  Calendar: undefined;
  NotFound: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainStack() {
  const { state } = useUser();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: !!state.user,
        }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Checklists" component={ChecklistsScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      {/* <Stack.Screen name="+not-found" component={NotFoundScreen} /> */}
    </Stack.Navigator>
  );
}
