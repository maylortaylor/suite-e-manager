/** @format */

import { Button, ScrollView, View } from "react-native";
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

import type { Checklist } from "../../../types/checklist";
import { Collapsible } from "../../components/ui/Collapsible";
import { Divider } from "@/app/components/ui/Divider";
import { IconSymbol } from "@/app/components/ui/IconSymbol";
import React from "react";
import { StyledPicker } from "@/app/components/ui/StyledPicker";
import type { TaskList } from "../../../types/task-list";
import { toast } from "../../../utils/toast";
import { useChecklist } from "../../context/checklist-context";
import { useTheme } from "styled-components/native";

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

export function EditChecklistsScreen() {
  const theme = useTheme();
  const { state, dispatch } = useChecklist();

  function handleAddChecklist() {
    const newChecklist: Checklist = {
      id: generateChecklistId(),
      name: "",
      taskListIds: [],
      taskIds: [],
    };
    dispatch({ type: "ADD_CHECKLIST", checklist: newChecklist });
  }

  function handleUpdateChecklist(
    index: number,
    key: string,
    value: string | string[]
  ) {
    const updatedChecklist = {
      ...state.checklists[index],
      [key]: value,
    };
    dispatch({
      type: "UPDATE_CHECKLIST",
      checklist: updatedChecklist as Checklist,
    });
  }

  async function handleSave() {
    try {
      dispatch({ type: "SET_LOADING", isLoading: true });
      dispatch({
        type: "SAVE_ALL",
        data: {
          tasks: state.tasks,
          taskLists: state.taskLists,
          checklists: state.checklists,
        },
      });
      toast.success("Checklists saved successfully");
    } catch (e) {
      toast.error("Failed to save checklists");
      dispatch({ type: "SET_ERROR", error: e as Error });
    } finally {
      dispatch({ type: "SET_LOADING", isLoading: false });
    }
  }

  if (state.isLoading) {
    return (
      <Container>
        <Label>Loading checklists...</Label>
      </Container>
    );
  }

  if (state.error) {
    return (
      <Container>
        <Label>Error: {state.error.message}</Label>
        <Button title="Retry" onPress={handleSave} />
      </Container>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 600 }}>
      <Label>Checklists</Label>
      <Container>
        {state.checklists.map((cl: Checklist, i: number) => (
          <Collapsible key={cl.id} title={cl.name || "(New Checklist)"}>
            <ItemBox>
              <ItemLabel>Name</ItemLabel>
              <Input
                value={cl.name}
                onChangeText={(v: string) =>
                  handleUpdateChecklist(i, "name", v)
                }
              />
              <ItemLabel>Task Lists</ItemLabel>
              <View style={{ position: "relative", marginBottom: 16 }}>
                <ChipRow>
                  {cl.taskListIds.map((id: string) => {
                    const tl = state.taskLists.find(
                      (tl: TaskList) => tl.id === id
                    );
                    return (
                      <Chip key={id} theme={theme}>
                        <ChipLabel theme={theme}>{tl ? tl.name : id}</ChipLabel>
                        <ChipRemove
                          theme={theme}
                          onPress={() => {
                            handleUpdateChecklist(
                              i,
                              "taskListIds",
                              cl.taskListIds.filter(
                                (tlid: string) => tlid !== id
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
                      handleUpdateChecklist(i, "taskListIds", [
                        ...cl.taskListIds,
                        taskListId,
                      ]);
                    }
                  }}
                  items={state.taskLists
                    .filter((tl: TaskList) => !cl.taskListIds.includes(tl.id))
                    .map((tl: TaskList) => ({
                      label: tl.name,
                      value: tl.id,
                    }))}
                  placeholder="Add task list by name..."
                />
              </View>
              <ItemLabel>Individual Tasks</ItemLabel>
              <View style={{ position: "relative", marginBottom: 16 }}>
                <ChipRow>
                  {(cl.taskIds || []).map((id: string) => {
                    const task = state.tasks.find((t) => t.id === id);
                    return (
                      <Chip key={id} theme={theme}>
                        <ChipLabel theme={theme}>
                          {task ? task.description : id}
                        </ChipLabel>
                        <ChipRemove
                          theme={theme}
                          onPress={() => {
                            handleUpdateChecklist(
                              i,
                              "taskIds",
                              (cl.taskIds || []).filter((tid) => tid !== id)
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
                      handleUpdateChecklist(i, "taskIds", [
                        ...(cl.taskIds || []),
                        taskId,
                      ]);
                    }
                  }}
                  items={state.tasks
                    .filter((t) => !(cl.taskIds || []).includes(t.id))
                    .map((t) => ({
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
          title={state.isLoading ? "Adding..." : "+ ADD CHECKLIST"}
          onPress={handleAddChecklist}
          disabled={state.isLoading}
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
          title={state.isLoading ? "Saving..." : "Save All"}
          onPress={handleSave}
          disabled={state.isLoading}
        />
      </Container>
    </ScrollView>
  );
}
