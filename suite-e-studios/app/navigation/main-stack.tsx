/** @format */

import * as React from "react";

import { Image, TouchableOpacity } from "react-native";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import { ChecklistsScreen } from "../screens/checklists";
import { HomeScreen } from "../screens/home";
import { SettingsScreen } from "../screens/settings";
import { UserMenu } from "../components/ui/UserMenu";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../context/user-context";

// import NotFoundScreen from "../+not-found";

export type MainStackParamList = {
  Home: undefined;
  Settings: undefined;
  Checklists: { initialTab?: "checklists" | "tasklists" | "tasks" };
  NotFound: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

function withUserMenu(Component: React.ComponentType<any>) {
  return function Wrapper(props: any) {
    const { state } = useUser();
    return <Component {...props} userMenu={state.user ? <UserMenu /> : null} />;
  };
}

export function MainStack() {
  const { state } = useUser();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerRight: () => (state.user ? <UserMenu /> : null),
        // headerTintColor: "#FFFFFF",
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Image
              source={require("../../assets/images/SuiteE_vector_WHITE.png")}
              style={{ width: 40, height: 40, marginLeft: 10 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ),
      })}
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
      {/* <Stack.Screen name="+not-found" component={NotFoundScreen} /> */}
    </Stack.Navigator>
  );
}
