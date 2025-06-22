/** @format */

import * as React from "react";

import { Image, Text, TouchableOpacity, View } from "react-native";
import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import { ChecklistsScreen } from "../screens/checklists";
import { HomeScreen } from "../screens/home";
import { SettingsScreen } from "../screens/settings";
import { UserMenu } from "../components/ui/UserMenu";
import { useUser } from "../context/user-context";

// import NotFoundScreen from "../+not-found";

export type MainStackParamList = {
  Home: undefined;
  Settings: undefined;
  Checklists: { tab?: "tasks" | "tasklists" | "checklists" };
  NotFound: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainStack() {
  const { state } = useUser();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={({ navigation }) => ({
        headerShown: true,
        // headerRight: () => (
        //   <View style={{ flexDirection: "row", alignItems: "center" }}>
        //     {state.user && (
        //       <>
        //         <TouchableOpacity
        //           onPress={() =>
        //             navigation.navigate("Checklists", { tab: "tasks" })
        //           }
        //         >
        //           <Text style={{ color: "white", marginRight: 15 }}>
        //             Checklists
        //           </Text>
        //         </TouchableOpacity>
        //         <TouchableOpacity
        //           onPress={() => navigation.navigate("Settings")}
        //         >
        //           <Text style={{ color: "white", marginRight: 15 }}>
        //             Settings
        //           </Text>
        //         </TouchableOpacity>
        //       </>
        //     )}
        //     {state.user ? <UserMenu /> : null}
        //   </View>
        // ),
        // headerLeft: () => (
        //   <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        //     <Image
        //       source={require("../../assets/images/SuiteE_vector_WHITE.png")}
        //       style={{ width: 40, height: 40, marginLeft: 10 }}
        //       resizeMode="contain"
        //     />
        //   </TouchableOpacity>
        // ),
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
