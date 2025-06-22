/** @format */

import * as firestore from "../../services/firestore";

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
import React, { useEffect, useState } from "react";
import { doc, writeBatch } from "firebase/firestore";

import { Collapsible } from "../../components/ui/Collapsible";
import { Divider } from "@/app/components/ui/Divider";
import { IconSymbol } from "@/app/components/ui/IconSymbol";
import { StyledPicker } from "@/app/components/ui/StyledPicker";
import type { Task } from "../../../types/task";
import type { TaskList } from "../../../types/task-list";
import { db } from "../../services/firebase";
import { toast } from "../../../utils/toast";
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
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all task lists and tasks from Firestore on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [fetchedTaskLists, fetchedTasks] = await Promise.all([
          firestore.getCollection<TaskList>("taskLists"),
          firestore.getCollection<Task>("tasks"),
        ]);
        setTaskLists(fetchedTaskLists);
        setAllTasks(fetchedTasks);
        setError(null);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  function handleAddTaskList() {
    const newTaskList: TaskList = {
      id: generateTaskListId(),
      name: "",
      taskIds: [],
    };
    setTaskLists((prev) => [...prev, newTaskList]);
  }

  function handleUpdateTaskList(
    index: number,
    key: string,
    value: string | string[]
  ) {
    const updatedTaskLists = [...taskLists];
    updatedTaskLists[index] = { ...updatedTaskLists[index], [key]: value };
    setTaskLists(updatedTaskLists);
  }

  async function handleSave() {
    setIsLoading(true);
    try {
      const batch = writeBatch(db);
      taskLists.forEach((taskList) => {
        const taskListRef = doc(db, "taskLists", taskList.id);
        batch.set(taskListRef, taskList);
      });
      await batch.commit();
      toast.success("Task lists saved successfully!");
    } catch (e) {
      toast.error("Failed to save task lists.");
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <Container>
        <Label>Loading task lists...</Label>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Label>Error: {error.message}</Label>
      </Container>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 850 }}>
      <Label>Task Lists</Label>
      <Container>
        {taskLists.map((tl: TaskList, i: number) => (
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
                    const t = allTasks.find((task) => task.id === id);
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
                    if (taskId && !tl.taskIds.includes(taskId)) {
                      handleUpdateTaskList(i, "taskIds", [
                        ...tl.taskIds,
                        taskId,
                      ]);
                    }
                  }}
                  items={allTasks
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
          title={isLoading ? "Adding..." : "+ ADD TASK LIST"}
          onPress={handleAddTaskList}
          disabled={isLoading}
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
          title={isLoading ? "Saving..." : "Save All"}
          onPress={handleSave}
          disabled={isLoading}
        />
      </Container>
    </ScrollView>
  );
}
