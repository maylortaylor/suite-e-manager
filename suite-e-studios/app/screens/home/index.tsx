/** @format */

import * as React from "react";
import * as firestore from "../../services/firestore";

import { FlatList, ScrollView, TouchableOpacity, View } from "react-native";
import {
  HomeContainer,
  WelcomeText,
} from "@/app/components/ui/styled.components";

import { AppLayout } from "../../components/ui/AppLayout";
import { Button } from "@/app/components/ui/Button";
import type { Checklist } from "../../../types/checklist";
import { ChecklistList } from "../../components/checklist";
import { LoginForm } from "../../components/auth";
import type { MainStackParamList } from "../../navigation/main-stack";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text } from "react-native";
import type { User } from "../../../types/user";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useChecklist } from "../../context/checklist-context";
import { useUser } from "../../context/user-context";

// This is a temporary map to find the correct global checklist for a role.
// In a real app, this mapping might come from a user's profile or another data source.
const ROLE_CHECKLIST_MAP: { [key: string]: string } = {
  "sound-engineer": "CL-aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "event-producer": "CL-bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "door-person": "CL-cccccccc-cccc-cccc-cccc-cccccccccccc",
  "bar-person": "CL-dddddddd-dddd-dddd-dddd-dddddddddddd",
};

type Props = NativeStackScreenProps<MainStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const { state: userState, dispatch: userDispatch } = useUser();
  const {
    state: checklistState,
    fetchFullChecklist,
    clearActiveChecklist,
  } = useChecklist();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [allChecklists, setAllChecklists] = React.useState<Checklist[]>([]);

  async function handleLogin(email: string, password: string) {
    userDispatch({ type: "SET_LOADING", isLoading: true });
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const authUser = userCredential.user;
      const userProfile = await firestore.getDocument<User>(
        "users",
        authUser.uid
      );
      if (!userProfile) throw new Error("User profile not found in Firestore.");

      const user: User = {
        id: authUser.uid,
        name: userProfile.name || email.split("@")[0],
        email: userProfile.email,
        roleId: userProfile.roleId,
      };
      userDispatch({ type: "LOGIN", user });

      if (userProfile.roleId === "admin") {
        setIsAdmin(true);
        const checklists =
          await firestore.getCollection<Checklist>("checklists");
        setAllChecklists(checklists);
      } else {
        const checklistId = ROLE_CHECKLIST_MAP[userProfile.roleId];
        if (!checklistId)
          throw new Error(
            `No checklist configured for role: ${userProfile.roleId}`
          );
        await fetchFullChecklist(checklistId);
      }
    } catch (error) {
      console.error("Login Error:", error);
      userDispatch({ type: "SET_ERROR", hasError: true });
    } finally {
      userDispatch({ type: "SET_LOADING", isLoading: false });
    }
  }

  const handleSelectChecklist = (checklistId: string) => {
    fetchFullChecklist(checklistId);
  };

  if (!userState.user) {
    return (
      <AppLayout navigation={navigation}>
        <LoginForm
          onLogin={handleLogin}
          isLoading={userState.isLoading}
          hasError={userState.hasError}
        />
      </AppLayout>
    );
  }

  if (isAdmin) {
    if (checklistState.activeChecklist) {
      return (
        <AppLayout navigation={navigation}>
          <HomeContainer>
            <ScrollView
              contentContainerStyle={{ paddingBottom: 100 }}
              style={{ flex: 1 }}
            >
              <Button onPress={clearActiveChecklist}>
                &lt; Back to All Checklists
              </Button>
              <ChecklistList checklist={checklistState.activeChecklist} />
            </ScrollView>
          </HomeContainer>
        </AppLayout>
      );
    }

    return (
      <AppLayout navigation={navigation}>
        <HomeContainer>
          <WelcomeText>Admin View: All Checklists</WelcomeText>
          <FlatList
            data={allChecklists}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectChecklist(item.id)}
                style={{
                  padding: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: "#ccc",
                }}
              >
                <Text style={{ fontSize: 18 }}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </HomeContainer>
      </AppLayout>
    );
  }

  return (
    <AppLayout navigation={navigation}>
      <HomeContainer>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          style={{ flex: 1 }}
        >
          <WelcomeText>Welcome, {userState.user.name}!</WelcomeText>
          {checklistState.isLoading ? (
            <Text>Loading checklist...</Text>
          ) : checklistState.error ? (
            <Text>Error loading checklist.</Text>
          ) : (
            <ChecklistList checklist={checklistState.activeChecklist} />
          )}
        </ScrollView>
      </HomeContainer>
    </AppLayout>
  );
}
