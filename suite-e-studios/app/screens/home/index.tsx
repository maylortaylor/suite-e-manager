/** @format */

import * as React from "react";

import {
  ActionButton,
  ActionButtonText,
  BottomBar,
  DashboardBox,
  Divider,
  HomeContainer,
  RoleText,
  WelcomeText,
} from "@/app/components/ui/styled.components";
import { Animated, StyleSheet } from "react-native";

import { ChecklistList } from "../../components/checklist";
import { LoginForm } from "../../components/auth";
import type { MainStackParamList } from "../../navigation/main-stack";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useChecklist } from "../../context/checklist-context";
import { useTheme } from "styled-components/native";
import { useUser } from "../../context/user-context";

const globalChecklists = require("../../../global.checklists.json");

function getRoleLabel(roleId: string) {
  if (roleId === "admin") return "Admin";
  if (roleId === "sound-engineer") return "Sound Engineer";
  if (roleId === "event-producer") return "Event Producer";
  if (roleId === "door-person") return "Door Person";
  if (roleId === "bar-person") return "Bar Person";
  return "User";
}

type Props = NativeStackScreenProps<MainStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const { state, dispatch } = useUser();
  const checklistCtx = useChecklist();
  const theme = useTheme();
  const [pressedButton, setPressedButton] = React.useState<string | null>(null);
  const leftAnim = React.useRef(new Animated.Value(0)).current;
  const changeRoleAnim = React.useRef(new Animated.Value(0)).current;
  const rightAnim = React.useRef(new Animated.Value(0)).current;

  const fadeOut = (anim: Animated.Value) => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
  const fadeIn = (anim: Animated.Value) => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 0,
      useNativeDriver: true,
    }).start();
  };

  function handleLogin(email: string, password: string) {
    dispatch({ type: "SET_LOADING", isLoading: true });
    setTimeout(() => {
      if (email && password) {
        const roleId = randomRoleId();
        dispatch({
          type: "LOGIN",
          user: {
            id: "1",
            name: email.split("@")[0],
            email,
            roleId,
          },
        });
        // Find the global checklist for this role
        const checklist = globalChecklists.checklists.find(
          (c: any) => c.role === roleId && c.isGlobal
        );
        if (checklist) {
          // Expand taskListIds to taskIds
          const taskListTaskIds = (checklist.taskListIds || []).flatMap(
            (tlid: string) => {
              const tl = globalChecklists.taskLists.find(
                (t: any) => t.id === tlid
              );
              return tl ? tl.taskIds : [];
            }
          );
          // Merge with checklist.taskIds
          const allTaskIds = Array.from(
            new Set([...(taskListTaskIds || []), ...(checklist.taskIds || [])])
          );
          // Get all relevant tasks
          const tasks = globalChecklists.tasks.filter((t: any) =>
            allTaskIds.includes(t.id)
          );
          checklistCtx.dispatch({ type: "SET_TASKS", tasks });
          checklistCtx.dispatch({
            type: "SET_CHECKLISTS",
            checklists: [{ ...checklist, taskIds: allTaskIds }],
          });
        } else {
          checklistCtx.dispatch({ type: "SET_TASKS", tasks: [] });
          checklistCtx.dispatch({ type: "SET_CHECKLISTS", checklists: [] });
        }
      } else {
        dispatch({ type: "SET_ERROR", hasError: true });
      }
      dispatch({ type: "SET_LOADING", isLoading: false });
    }, 800);
  }

  if (!state.user) {
    return (
      <LoginForm
        onLogin={handleLogin}
        isLoading={state.isLoading}
        hasError={state.hasError}
      />
    );
  }

  // Role-based dashboard placeholder
  return (
    <HomeContainer>
      <WelcomeText>Welcome, {state.user.name}!</WelcomeText>
      <RoleText>Role: {getRoleLabel(state.user.roleId)}</RoleText>
      <DashboardBox>
        {state.user.roleId === "admin" && (
          <RoleText>Admin dashboard coming soon…</RoleText>
        )}
        {state.user.roleId === "sound-engineer" && (
          <RoleText>Sound Engineer dashboard coming soon…</RoleText>
        )}
        {state.user.roleId === "event-producer" && (
          <RoleText>Event Producer dashboard coming soon…</RoleText>
        )}
        {state.user.roleId === "door-person" && (
          <RoleText>Door Person dashboard coming soon…</RoleText>
        )}
        {state.user.roleId === "bar-person" && (
          <RoleText>Bar Person dashboard coming soon…</RoleText>
        )}
        {![
          "admin",
          "sound-engineer",
          "event-producer",
          "door-person",
          "bar-person",
        ].includes(state.user.roleId) && (
          <RoleText>General user dashboard coming soon…</RoleText>
        )}
      </DashboardBox>
      <ChecklistList />
      <BottomBar>
        <ActionButton
          accessibilityRole="button"
          activeOpacity={1.4}
          onPressIn={() => {
            setPressedButton("left");
            fadeIn(leftAnim);
          }}
          onPressOut={() => {
            setPressedButton(null);
            fadeOut(leftAnim);
          }}
        >
          <Animated.View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: theme.colors.primary,
              borderRadius: 12,
              opacity: leftAnim,
            }}
          />
          <ActionButtonText>Left</ActionButtonText>
        </ActionButton>
        <Divider />
        <ActionButton
          accessibilityRole="button"
          activeOpacity={1.4}
          onPressIn={() => {
            setPressedButton("changeRole");
            fadeIn(changeRoleAnim);
          }}
          onPressOut={() => {
            setPressedButton(null);
            fadeOut(changeRoleAnim);
          }}
          onPress={() => {
            const newRole = randomRoleId();
            dispatch({
              type: "LOGIN",
              user: {
                ...state.user!,
                roleId: newRole,
              },
            });
            // Find the global checklist for this role
            const checklist = globalChecklists.checklists.find(
              (c: any) => c.role === newRole && c.isGlobal
            );
            if (checklist) {
              const taskListTaskIds = (checklist.taskListIds || []).flatMap(
                (tlid: string) => {
                  const tl = globalChecklists.taskLists.find(
                    (t: any) => t.id === tlid
                  );
                  return tl ? tl.taskIds : [];
                }
              );
              const allTaskIds = Array.from(
                new Set([
                  ...(taskListTaskIds || []),
                  ...(checklist.taskIds || []),
                ])
              );
              const tasks = globalChecklists.tasks.filter((t: any) =>
                allTaskIds.includes(t.id)
              );
              checklistCtx.dispatch({ type: "SET_TASKS", tasks });
              checklistCtx.dispatch({
                type: "SET_CHECKLISTS",
                checklists: [{ ...checklist, taskIds: allTaskIds }],
              });
            } else {
              checklistCtx.dispatch({ type: "SET_TASKS", tasks: [] });
              checklistCtx.dispatch({ type: "SET_CHECKLISTS", checklists: [] });
            }
          }}
        >
          <Animated.View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: theme.colors.primary,
              borderRadius: 12,
              opacity: changeRoleAnim,
            }}
          />
          <ActionButtonText>Change Role</ActionButtonText>
        </ActionButton>
        <Divider />
        <ActionButton
          accessibilityRole="button"
          activeOpacity={1.4}
          onPressIn={() => {
            setPressedButton("right");
            fadeIn(rightAnim);
          }}
          onPressOut={() => {
            setPressedButton(null);
            fadeOut(rightAnim);
          }}
        >
          <Animated.View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: theme.colors.primary,
              borderRadius: 12,
              opacity: rightAnim,
            }}
          />
          <ActionButtonText>Right</ActionButtonText>
        </ActionButton>
      </BottomBar>
    </HomeContainer>
  );
}

function randomRoleId(): string {
  const roles = [
    "admin",
    "sound-engineer",
    "event-producer",
    "door-person",
    "bar-person",
  ];
  return roles[Math.floor(Math.random() * roles.length)];
}
