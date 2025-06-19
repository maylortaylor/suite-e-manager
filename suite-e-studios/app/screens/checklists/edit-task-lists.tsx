/** @format */

import {
  Alert,
  Button,
  ScrollView as RNScrollView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Chip,
  ChipLabel,
  ChipRemove,
  ChipRow,
  Container,
  Divider,
  Input,
  ItemBox,
  ItemLabel,
  Label,
} from "@/app/components/ui/styled.components";
import React, { useState } from "react";

import { Collapsible } from "../../components/ui/Collapsible";
import { IconSymbol } from "@/app/components/ui/IconSymbol";
import { StyledPicker } from "@/app/components/ui/StyledPicker";
import { useTheme } from "styled-components/native";

const globalChecklists = require("../../../global.checklists.json");

export function EditTaskListsScreen({
  taskLists,
  setTaskLists,
  updateTaskList,
  saving,
  handleSave,
  tasks,
}: {
  taskLists: any[];
  setTaskLists: (value: any[] | ((prev: any[]) => any[])) => void;
  updateTaskList: (index: number, key: string, value: string) => void;
  saving: boolean;
  handleSave: () => void;
  tasks: any[];
}) {
  const theme = useTheme();
  const [taskSearch, setTaskSearch] = useState<string>("");
  const [activeTaskDropdown, setActiveTaskDropdown] = useState<number | null>(
    null
  );
  const allTasks = tasks;

  function generateTaskListId() {
    return (
      "TL-" +
      Math.random().toString(36).substr(2, 8) +
      "-" +
      Math.random().toString(36).substr(2, 4) +
      "-" +
      Math.random().toString(36).substr(2, 4)
    );
  }

  function handleAddTaskList() {
    const newTaskList = {
      id: generateTaskListId(),
      name: "",
      taskIds: [],
    };
    setTaskLists((prev: any[]) => [...prev, newTaskList]);
  }

  return (
    <ScrollView>
      <Label fontSize={32}>Task Lists</Label>
      <Container>
        {taskLists.map((tl: any, i: number) => (
          <Collapsible key={tl.id} title={tl.name || "(New Task List)"}>
            <ItemBox>
              <ItemLabel>Name</ItemLabel>
              <Input
                value={tl.name}
                onChangeText={(v: string) => updateTaskList(i, "name", v)}
              />
              <ItemLabel>Tasks</ItemLabel>
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
                <StyledPicker
                  value={""}
                  onValueChange={(taskId: string) => {
                    if (taskId) {
                      updateTaskList(
                        i,
                        "taskIds",
                        [...tl.taskIds, taskId].join(",")
                      );
                    }
                  }}
                  items={allTasks
                    .filter((t: any) => !tl.taskIds.includes(t.id))
                    .map((t: { description: string; id: string }) => ({
                      label: t.description,
                      value: t.id,
                    }))}
                  placeholder="Add task by description..."
                />
              </View>
            </ItemBox>
          </Collapsible>
        ))}
        <Button
          title={saving ? "Saving..." : "+ ADD TASK LIST"}
          onPress={handleAddTaskList}
          disabled={saving}
        />
        <Divider
          style={{
            marginVertical: 16,
            height: 2,
            backgroundColor: theme.colors.divider,
            width: "100%",
          }}
        />
        <Button
          title={saving ? "Saving..." : "Save All"}
          onPress={handleSave}
          disabled={saving}
        />
      </Container>
    </ScrollView>
  );
}
