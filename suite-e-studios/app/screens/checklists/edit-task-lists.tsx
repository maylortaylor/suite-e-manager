/** @format */

import { Alert, Button, ScrollView, View } from "react-native";
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

import { Collapsible } from "../../components/ui/Collapsible";
import { Divider } from "@/app/components/ui/Divider";
import { IconSymbol } from "@/app/components/ui/IconSymbol";
import React from "react";
import { StyledPicker } from "@/app/components/ui/StyledPicker";
import type { Task } from "../../../types/task";
import type { TaskList } from "../../../types/task-list";
import { useChecklist } from "../../context/checklist-context";
import { useTheme } from "styled-components/native";

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

export function EditTaskListsScreen() {
  const theme = useTheme();
  const { state, dispatch } = useChecklist();

  function handleAddTaskList() {
    const newTaskList: TaskList = {
      id: generateTaskListId(),
      name: "",
      taskIds: [],
    };
    dispatch({ type: "ADD_TASK_LIST", taskList: newTaskList });
  }

  function handleUpdateTaskList(
    index: number,
    key: string,
    value: string | string[]
  ) {
    const updatedTaskList = {
      ...state.taskLists[index],
      [key]: value,
    };
    dispatch({
      type: "UPDATE_TASK_LIST",
      taskList: updatedTaskList as TaskList,
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
      Alert.alert("Success", "Task lists saved successfully");
    } catch (e) {
      Alert.alert("Error", "Failed to save task lists");
      dispatch({ type: "SET_ERROR", error: e as Error });
    } finally {
      dispatch({ type: "SET_LOADING", isLoading: false });
    }
  }

  if (state.isLoading) {
    return (
      <Container>
        <Label>Loading task lists...</Label>
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
    <ScrollView>
      <Label>Task Lists</Label>
      <Container>
        {state.taskLists.map((tl: TaskList, i: number) => (
          <Collapsible key={tl.id} title={tl.name || "(New Task List)"}>
            <ItemBox>
              <ItemLabel>Name</ItemLabel>
              <Input
                value={tl.name}
                onChangeText={(v: string) => handleUpdateTaskList(i, "name", v)}
              />
              <ItemLabel>Tasks</ItemLabel>
              <View style={{ position: "relative", marginBottom: 16 }}>
                <ChipRow>
                  {tl.taskIds.map((id: string) => {
                    const t = state.tasks.find((t: Task) => t.id === id);
                    return (
                      <Chip key={id} theme={theme}>
                        <ChipLabel theme={theme}>
                          {t ? t.description : id}
                        </ChipLabel>
                        <ChipRemove
                          theme={theme}
                          onPress={() => {
                            handleUpdateTaskList(
                              i,
                              "taskIds",
                              tl.taskIds.filter((tid: string) => tid !== id)
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
                      handleUpdateTaskList(i, "taskIds", [
                        ...tl.taskIds,
                        taskId,
                      ]);
                    }
                  }}
                  items={state.tasks
                    .filter((t: Task) => !tl.taskIds.includes(t.id))
                    .map((t: Task) => ({
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
          title={state.isLoading ? "Adding..." : "+ ADD TASK LIST"}
          onPress={handleAddTaskList}
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
