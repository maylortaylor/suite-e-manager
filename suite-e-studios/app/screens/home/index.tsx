/** @format */

import * as React from "react";
import * as firestore from "../../services/firestore";

import {
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  HomeContainer,
  WelcomeText,
} from "@/app/components/ui/styled.components";

import { AppLayout } from "../../components/ui/AppLayout";
import { ChecklistList } from "../../components/checklist";
import { DrawerActions } from "@react-navigation/native";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { LoginForm } from "../../components/auth";
import { Text } from "react-native";
import type { User } from "../../../types/user";
import { auth } from "../../services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useChecklist } from "../../context/checklist-context";
import { useUser } from "../../context/user-context";

const menuIcon = require("../../../assets/images/SuiteE_vector_WHITE.png");

type Props = DrawerScreenProps<{ Home: undefined }>;

export function HomeScreen({ navigation }: Props) {
  const { state: userState, dispatch: userDispatch } = useUser();
  const {
    state: checklistState,
    fetchFullChecklist,
    clearActiveChecklist,
  } = useChecklist();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={{ marginLeft: 15 }}
        >
          <Image
            source={menuIcon}
            style={{ width: 30, height: 30, resizeMode: "contain" }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  React.useEffect(() => {
    // When a user logs in, automatically fetch a default checklist.
    if (userState.user && !checklistState.activeChecklist) {
      // Hardcoding the "Sound Engineer" checklist for now.
      const defaultChecklistId = "CL-aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
      fetchFullChecklist(defaultChecklistId);
    }

    // When the user logs out or the component is unmounted, clear the checklist.
    return () => {
      clearActiveChecklist();
    };
  }, [userState.user]);

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

  const formatRoleName = (roleId: string) => {
    return roleId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (!userState.user) {
    return (
      <AppLayout>
        <LoginForm
          onLogin={handleLogin}
          isLoading={userState.isLoading}
          hasError={userState.hasError}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <HomeContainer>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          style={{ flex: 1 }}
        >
          <WelcomeText>Welcome, {userState.user.name}!</WelcomeText>
          {checklistState.isLoading ? (
            <Text>Loading checklist...</Text>
          ) : checklistState.error ? (
            <Text>Error: {checklistState.error.message}</Text>
          ) : (
            <ChecklistList checklist={checklistState.activeChecklist} />
          )}
        </ScrollView>
      </HomeContainer>
    </AppLayout>
  );
}
