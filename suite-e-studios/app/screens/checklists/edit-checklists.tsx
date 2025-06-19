/** @format */

import { Alert, Button, ScrollView } from "react-native";
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
import React, { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Collapsible } from "../../components/ui/Collapsible";
import { IconSymbol } from "@/app/components/ui/IconSymbol";
import { StyledPicker } from "@/app/components/ui/StyledPicker";
import { View } from "react-native";
import { useTheme } from "styled-components/native";

const globalChecklists = require("../../../global.checklists.json");

export function EditChecklistsScreen() {
  const [checklists, setChecklists] = useState<any[]>(
    globalChecklists.checklists
  );
  const [saving, setSaving] = useState(false);
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
  const allTaskLists = globalChecklists.taskLists;
  const allTasks = globalChecklists.tasks;
  const [roles, setRoles] = useState<string[]>([
    "sound-engineer",
    "event-producer",
    "door-person",
    "bar-person",
  ]);

  useEffect(() => {
    (async () => {
      const role = await AsyncStorage.getItem("task-roles");
      if (role) {
        try {
          setRoles(JSON.parse(role));
        } catch {}
      }
    })();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const currentData = await AsyncStorage.getItem("global.checklists.json");
      const parsedData = currentData
        ? JSON.parse(currentData)
        : globalChecklists;
      await AsyncStorage.setItem(
        "global.checklists.json",
        JSON.stringify({ ...parsedData, checklists })
      );
      Alert.alert("Saved", "Checklist data saved to storage.");
    } catch (e) {
      Alert.alert("Error", "Failed to save data.");
    }
    setSaving(false);
  }

  function updateChecklist(
    index: number,
    key: string,
    value: string | string[]
  ) {
    const updated = [...checklists];
    if (key === "taskListIds" || key === "taskIds") {
      updated[index] = {
        ...updated[index],
        [key]: Array.isArray(value) ? value : value.split(","),
      };
    } else {
      updated[index] = { ...updated[index], [key]: value };
    }
    setChecklists(updated);
  }

  return (
    <ScrollView>
      <Label fontSize={32}>Checklists</Label>
      <Container>
        {checklists.map((c: any, i: number) => (
          <Collapsible key={c.id} title={c.name}>
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
          title={saving ? "Saving..." : "Save All"}
          onPress={handleSave}
          disabled={saving}
        />
      </Container>
    </ScrollView>
  );
}
