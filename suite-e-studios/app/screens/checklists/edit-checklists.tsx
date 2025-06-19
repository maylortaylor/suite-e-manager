/** @format */

import { Button, ScrollView } from "react-native";
import {
  Chip,
  ChipLabel,
  ChipRemove,
  ChipRow,
  Container,
  Input,
  ItemBox,
  ItemLabel,
  Label,
} from "@/app/components/ui/styled.components";
import React, { useCallback, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Collapsible } from "../../components/ui/Collapsible";
import { Divider } from "@/app/components/ui/Divider";
import { IconSymbol } from "@/app/components/ui/IconSymbol";
import { StyledPicker } from "@/app/components/ui/StyledPicker";
import { View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components/native";

const globalChecklists = require("../../../global.checklists.json");

export function EditChecklistsScreen({
  checklists,
  setChecklists,
  updateChecklist,
  saving,
  handleSave,
  tasks,
  taskLists,
}: {
  checklists: any[];
  setChecklists: (value: any[] | ((prev: any[]) => any[])) => void;
  updateChecklist: (
    index: number,
    key: string,
    value: string | string[]
  ) => void;
  saving: boolean;
  handleSave: () => void;
  tasks: any[];
  taskLists: any[];
}) {
  const theme = useTheme();
  // For autocomplete state
  const [taskListSearch, setTaskListSearch] = useState<string>("");
  const [taskSearch, setTaskSearch] = useState<string>("");
  const [activeTaskListDropdown, setActiveTaskListDropdown] = useState<
    number | null
  >(null);
  const [activeTaskDropdown, setActiveTaskDropdown] = useState<number | null>(
    null
  );
  const allTaskLists = taskLists;
  const allTasks = tasks;
  const [roles, setRoles] = useState<string[]>([
    "sound-engineer",
    "event-producer",
    "door-person",
    "bar-person",
  ]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      async function load() {
        const role = await AsyncStorage.getItem("task-roles");
        if (role && isActive) {
          try {
            setRoles(JSON.parse(role));
          } catch {}
        }
      }
      load();
      return () => {
        isActive = false;
      };
    }, [])
  );

  function generateChecklistId() {
    return (
      "CL-" +
      Math.random().toString(36).substr(2, 8) +
      "-" +
      Math.random().toString(36).substr(2, 4) +
      "-" +
      Math.random().toString(36).substr(2, 4)
    );
  }

  function handleAddChecklist() {
    const newChecklist = {
      id: generateChecklistId(),
      name: "",
      role: roles[0] || "",
      isGlobal: false,
      taskListIds: [],
      taskIds: [],
    };
    setChecklists((prev: any[]) => [...prev, newChecklist]);
  }

  return (
    <ScrollView>
      <Label>Checklists</Label>
      <Container>
        {checklists.map((c: any, i: number) => (
          <Collapsible key={c.id} title={c.name || "(New Checklist)"}>
            <ItemBox>
              <ItemLabel>Name</ItemLabel>
              <Input
                value={c.name}
                onChangeText={(v: string) => updateChecklist(i, "name", v)}
              />
              <ItemLabel>Role</ItemLabel>
              <StyledPicker
                value={c.role}
                onValueChange={(v: string) => updateChecklist(i, "role", v)}
                items={roles.map((role: string) => ({
                  label: role,
                  value: role,
                }))}
                placeholder="Select role..."
              />
              <ItemLabel>Task Lists</ItemLabel>
              <View style={{ position: "relative", marginBottom: 16 }}>
                <ChipRow>
                  {(c.taskListIds || []).map((id: string) => {
                    const tl = allTaskLists.find((tl: any) => tl.id === id);
                    return (
                      <Chip key={id} theme={theme}>
                        <ChipLabel theme={theme}>{tl ? tl.name : id}</ChipLabel>
                        <ChipRemove
                          theme={theme}
                          onPress={() => {
                            updateChecklist(
                              i,
                              "taskListIds",
                              (c.taskListIds || []).filter(
                                (tid: string) => tid !== id
                              )
                            );
                          }}
                        >
                          <IconSymbol
                            name="xmark"
                            size={16}
                            color={theme.colors.input}
                          />
                        </ChipRemove>
                      </Chip>
                    );
                  })}
                </ChipRow>
                <StyledPicker
                  value={""}
                  onValueChange={(taskListId: string) => {
                    if (taskListId) {
                      updateChecklist(i, "taskListIds", [
                        ...(c.taskListIds || []),
                        taskListId,
                      ]);
                    }
                  }}
                  items={allTaskLists
                    .filter((tl: any) => !(c.taskListIds || []).includes(tl.id))
                    .map((tl: any) => ({ label: tl.name, value: tl.id }))}
                  placeholder="Add task list by name..."
                />
              </View>
              <ItemLabel>Tasks</ItemLabel>
              <View style={{ position: "relative", marginBottom: 16 }}>
                <ChipRow>
                  {(c.taskIds || []).map((id: string) => {
                    const t = allTasks.find((t: any) => t.id === id);
                    return (
                      <Chip key={id} theme={theme}>
                        <ChipLabel theme={theme}>
                          {t ? t.description : id}
                        </ChipLabel>
                        <ChipRemove
                          theme={theme}
                          onPress={() => {
                            updateChecklist(
                              i,
                              "taskIds",
                              (c.taskIds || []).filter(
                                (tid: string) => tid !== id
                              )
                            );
                          }}
                        >
                          <IconSymbol
                            name="xmark"
                            size={16}
                            color={theme.colors.input}
                          />
                        </ChipRemove>
                      </Chip>
                    );
                  })}
                </ChipRow>
                <StyledPicker
                  value={""}
                  onValueChange={(taskId: string) => {
                    if (taskId) {
                      updateChecklist(i, "taskIds", [
                        ...(c.taskIds || []),
                        taskId,
                      ]);
                    }
                  }}
                  items={allTasks
                    .filter((t: any) => !(c.taskIds || []).includes(t.id))
                    .map((t: any) => ({ label: t.description, value: t.id }))}
                  placeholder="Add task by description..."
                />
              </View>
            </ItemBox>
          </Collapsible>
        ))}
        <Button
          title={saving ? "Saving..." : "+ ADD CHECKLIST"}
          onPress={handleAddChecklist}
          disabled={saving}
        />
        <Divider
          orientation="horizontal"
          thickness={1}
          length={8}
          marginVertical={40}
          marginHorizontal={40}
          color={theme.colors.divider}
        />
        <Button
          title={saving ? "Saving..." : "Save All"}
          onPress={handleSave}
          disabled={saving}
        />

<Divider
          orientation="horizontal"
          thickness={1}
          length={8}
          marginVertical={40}
          marginHorizontal={40}
          color={theme.colors.divider}
        />
      </Container>
    </ScrollView>
  );
}
