/** @format */

import * as React from "react";

import { Alert, Button, ScrollView } from "react-native";
import {
  CenteredSuggestionDropdown,
  Chip,
  ChipLabel,
  ChipRemove,
  ChipRow,
  Container,
  Input,
  ItemBox,
  ItemLabel,
  Label,
  SuggestionItem,
  SuggestionText,
} from "@/app/components/ui/styled.components";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Collapsible } from "../../components/ui/Collapsible";
import { IconSymbol } from "@/app/components/ui/IconSymbol";
import { Portal } from "@gorhom/portal";
import { ScrollView as RNScrollView } from "react-native";
import { View } from "react-native";
import { useTheme } from "styled-components/native";

const globalChecklists = require("../../../global.checklists.json");

export function EditChecklistsScreen() {
  const [checklists, setChecklists] = React.useState<any[]>(
    globalChecklists.checklists
  );
  const [saving, setSaving] = React.useState(false);
  const theme = useTheme();
  // For autocomplete state
  const [taskListSearch, setTaskListSearch] = React.useState<string>("");
  const [taskSearch, setTaskSearch] = React.useState<string>("");
  const [activeTaskListDropdown, setActiveTaskListDropdown] = React.useState<
    number | null
  >(null);
  const [activeTaskDropdown, setActiveTaskDropdown] = React.useState<
    number | null
  >(null);
  const allTaskLists = globalChecklists.taskLists;
  const allTasks = globalChecklists.tasks;

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
              <Input
                value={c.role}
                onChangeText={(v: string) => updateChecklist(i, "role", v)}
              />
              <ItemLabel>Task List IDs</ItemLabel>
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
                <Input
                  value={activeTaskListDropdown === i ? taskListSearch : ""}
                  onFocus={() => {
                    setActiveTaskListDropdown(i);
                    setTaskListSearch("");
                  }}
                  onBlur={() =>
                    setTimeout(() => setActiveTaskListDropdown(null), 200)
                  }
                  onChangeText={setTaskListSearch}
                  placeholder="Search task lists by name"
                  theme={theme}
                />
                {activeTaskListDropdown === i && (
                  <Portal>
                    <CenteredSuggestionDropdown theme={theme}>
                      <RNScrollView style={{ maxHeight: 220 }}>
                        {allTaskLists
                          .filter(
                            (tl: any) =>
                              tl.name
                                .toLowerCase()
                                .includes(taskListSearch.toLowerCase()) &&
                              !(c.taskListIds || []).includes(tl.id)
                          )
                          .map((tl: any) => (
                            <SuggestionItem
                              key={tl.id}
                              theme={theme}
                              onPress={() => {
                                updateChecklist(i, "taskListIds", [
                                  ...(c.taskListIds || []),
                                  tl.id,
                                ]);
                                setTaskListSearch("");
                              }}
                            >
                              <SuggestionText theme={theme}>
                                {tl.name}
                              </SuggestionText>
                            </SuggestionItem>
                          ))}
                      </RNScrollView>
                    </CenteredSuggestionDropdown>
                  </Portal>
                )}
              </View>
              <ItemLabel>Task IDs</ItemLabel>
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
                <Input
                  value={activeTaskDropdown === i ? taskSearch : ""}
                  onFocus={() => {
                    setActiveTaskDropdown(i);
                    setTaskSearch("");
                  }}
                  onBlur={() =>
                    setTimeout(() => setActiveTaskDropdown(null), 200)
                  }
                  onChangeText={setTaskSearch}
                  placeholder="Search tasks by description"
                  theme={theme}
                />
                {activeTaskDropdown === i && (
                  <Portal>
                    <CenteredSuggestionDropdown theme={theme}>
                      <RNScrollView style={{ maxHeight: 220 }}>
                        {allTasks
                          .filter(
                            (t: any) =>
                              t.description
                                .toLowerCase()
                                .includes(taskSearch.toLowerCase()) &&
                              !(c.taskIds || []).includes(t.id)
                          )
                          .map((t: any) => (
                            <SuggestionItem
                              key={t.id}
                              theme={theme}
                              onPress={() => {
                                updateChecklist(i, "taskIds", [
                                  ...(c.taskIds || []),
                                  t.id,
                                ]);
                                setTaskSearch("");
                              }}
                            >
                              <SuggestionText theme={theme}>
                                {t.description}
                              </SuggestionText>
                            </SuggestionItem>
                          ))}
                      </RNScrollView>
                    </CenteredSuggestionDropdown>
                  </Portal>
                )}
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
