/** @format */

import * as React from "react";

import {
  Alert,
  Button,
  ScrollView as RNScrollView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
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
  SuggestionDropdown,
  SuggestionItem,
  SuggestionText,
} from "@/app/components/ui/styled.components";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Collapsible } from "../../components/ui/Collapsible";
import { IconSymbol } from "@/app/components/ui/IconSymbol";
import { Portal } from "@gorhom/portal";
import { useTheme } from "styled-components/native";

const globalChecklists = require("../../../global.checklists.json");

export function EditTaskListsScreen() {
  const [taskLists, setTaskLists] = React.useState<any[]>(
    globalChecklists.taskLists
  );
  const [saving, setSaving] = React.useState(false);
  const theme = useTheme();
  const [taskSearch, setTaskSearch] = React.useState<string>("");
  const [activeTaskDropdown, setActiveTaskDropdown] = React.useState<
    number | null
  >(null);
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
        JSON.stringify({ ...parsedData, taskLists })
      );
      Alert.alert("Saved", "Task list data saved to storage.");
    } catch (e) {
      Alert.alert("Error", "Failed to save data.");
    }
    setSaving(false);
  }

  function updateTaskList(index: number, key: string, value: string) {
    const updated = [...taskLists];
    if (key === "taskIds") {
      updated[index] = { ...updated[index], taskIds: value.split(",") };
    } else {
      updated[index] = { ...updated[index], [key]: value };
    }
    setTaskLists(updated);
  }

  return (
    <ScrollView>
      <Label fontSize={32}>Task Lists</Label>
      <Container>
        {taskLists.map((tl: any, i: number) => (
          <Collapsible key={tl.id} title={tl.name}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <TouchableOpacity
                onPress={async () => {
                  await Clipboard.setStringAsync(tl.id);
                  Alert.alert("Copied", "Task List ID copied to clipboard");
                }}
                style={{ marginRight: 6 }}
              >
                <IconSymbol
                  name="doc.on.doc"
                  size={20}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
              <ItemLabel fontSize={10} style={{ marginRight: 4 }}>TaskList ID:</ItemLabel>
              <ItemLabel fontSize={10}>{tl.id}</ItemLabel>
            </View>
            <ItemBox>
              <ItemLabel>Name</ItemLabel>
              <Input
                value={tl.name}
                onChangeText={(v: string) => updateTaskList(i, "name", v)}
              />
              <ItemLabel>Task IDs</ItemLabel>
              <View style={{ position: "relative", marginBottom: 16 }}>
                <ChipRow>
                  {tl.taskIds.map((id: string) => {
                    const t = allTasks.find((t: any) => t.id === id);
                    return (
                      <Chip key={id} theme={theme}>
                        <ChipLabel theme={theme}>
                          {t ? t.description : id}
                        </ChipLabel>
                        <ChipRemove
                          theme={theme}
                          onPress={() => {
                            updateTaskList(
                              i,
                              "taskIds",
                              tl.taskIds
                                .filter((tid: string) => tid !== id)
                                .join(",")
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
                              !tl.taskIds.includes(t.id)
                          )
                          .map((t: any) => (
                            <SuggestionItem
                              key={t.id}
                              theme={theme}
                              onPress={() => {
                                updateTaskList(
                                  i,
                                  "taskIds",
                                  [...tl.taskIds, t.id].join(",")
                                );
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
