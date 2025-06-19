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
import { Animated, ScrollView, StyleSheet, Text } from "react-native";
import {
  loadAllChecklistData,
  seedChecklistDataIfNeeded,
} from "../../../utils/storage";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChecklistList } from "../../components/checklist";
import { LoginForm } from "../../components/auth";
import type { MainStackParamList } from "../../navigation/main-stack";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useChecklist } from "../../context/checklist-context";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components/native";
import { useUser } from "../../context/user-context";

const globalChecklists = require("../../../global.checklists.json");

interface Task {
  id: string;
  description: string;
  category: string;
  role: string;
}

interface TaskList {
  id: string;
  name: string;
  taskIds: string[];
}

interface Checklist {
  id: string;
  name: string;
  role: string;
  isGlobal: boolean;
  taskListIds: string[];
  taskIds: string[];
  taskLists?: TaskList[];
  tasks?: Task[];
}

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
  const [allChecklists, setAllChecklists] = React.useState<Checklist[]>([]);
  const [allRoles, setAllRoles] = React.useState<string[]>([]);
  const [randomChecklist, setRandomChecklist] =
    React.useState<Checklist | null>(null);
  const [randomRole, setRandomRole] = React.useState<string | null>(null);
  const [checklistData, setChecklistData] = React.useState<{
    tasks: Task[];
    taskLists: TaskList[];
    checklists: Checklist[];
  } | null>(null);

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

  // Load checklists and roles from AsyncStorage on focus
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      async function load() {
        try {
          const data = await loadAllChecklistData();
          const rolesStored = await AsyncStorage.getItem("task-roles");
          if (isActive) {
            setChecklistData({
              tasks: data.tasks as Task[],
              taskLists: data.taskLists as TaskList[],
              checklists: data.checklists as Checklist[],
            });
            setAllChecklists(data.checklists as Checklist[]);
            if (rolesStored) {
              setAllRoles(JSON.parse(rolesStored));
            }
          }
        } catch {}
      }
      load();
      return () => {
        isActive = false;
      };
    }, [])
  );

  // Update random checklist data when checklistData changes
  React.useEffect(() => {
    if (checklistData && randomChecklist) {
      setRandomChecklist({
        ...randomChecklist,
        taskLists: checklistData.taskLists,
        tasks: checklistData.tasks,
      });
    }
  }, [checklistData]);

  // Shuffle function
  const shuffleCombo = React.useCallback(() => {
    if (allChecklists.length > 0 && checklistData) {
      const newChecklist =
        allChecklists[Math.floor(Math.random() * allChecklists.length)];
      setRandomChecklist({
        ...newChecklist,
        taskLists: checklistData.taskLists,
        tasks: checklistData.tasks,
      });
    } else {
      setRandomChecklist(null);
    }
    if (allRoles.length > 0) {
      setRandomRole(allRoles[Math.floor(Math.random() * allRoles.length)]);
    } else {
      setRandomRole(null);
    }
  }, [allChecklists, allRoles, checklistData]);

  // Shuffle on first load of checklists/roles
  React.useEffect(() => {
    if (allChecklists.length && allRoles.length && !randomChecklist) {
      shuffleCombo();
    }
  }, [allChecklists, allRoles, shuffleCombo]);

  // Seed checklist data for new users
  React.useEffect(() => {
    seedChecklistDataIfNeeded();
  }, []);

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
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        style={{ flex: 1 }}
      >
        <WelcomeText>Welcome, {state.user.name}!</WelcomeText>
        {randomChecklist && randomRole && (
          <DashboardBox>
            <RoleText>
              <Text style={{ fontWeight: "bold" }}>Random Checklist:</Text>{" "}
              {randomChecklist.name || "(Unnamed)"}
            </RoleText>
            <RoleText>
              <Text style={{ fontWeight: "bold" }}>Random Role:</Text>{" "}
              {getRoleLabel(randomRole)}
            </RoleText>
          </DashboardBox>
        )}
        <ChecklistList
          checklist={randomChecklist}
          taskLists={randomChecklist?.taskLists || []}
          tasks={randomChecklist?.tasks || []}
        />
      </ScrollView>
      <BottomBar>
        <ActionButton
          accessibilityRole="button"
          activeOpacity={1.4}
          onPress={() => navigation.navigate("Settings")}
          onPressIn={() => {
            setPressedButton("settings");
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
          <ActionButtonText>Settings</ActionButtonText>
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
          onPress={shuffleCombo}
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
          onPress={() =>
            navigation.navigate("Checklists", { initialTab: "tasks" })
          }
          onPressIn={() => {
            setPressedButton("tasks");
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
          <ActionButtonText>Tasks</ActionButtonText>
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
