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

import type { Checklist } from "../../../types/checklist";
import { Collapsible } from "../../components/ui/Collapsible";
import { Divider } from "@/app/components/ui/Divider";
import { IconSymbol } from "@/app/components/ui/IconSymbol";
import { StyledPicker } from "@/app/components/ui/StyledPicker";
import type { Task } from "../../../types/task";
import type { TaskList } from "../../../types/task-list";
import { db } from "../../services/firebase";
import { toast } from "../../../utils/toast";
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
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [allTaskLists, setAllTaskLists] = useState<TaskList[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [fetchedChecklists, fetchedTaskLists, fetchedTasks] =
          await Promise.all([
            firestore.getCollection<Checklist>("checklists"),
            firestore.getCollection<TaskList>("taskLists"),
            firestore.getCollection<Task>("tasks"),
          ]);
        setChecklists(fetchedChecklists);
        setAllTaskLists(fetchedTaskLists);
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

  function handleAddChecklist() {
    const newChecklist: Checklist = {
      id: generateChecklistId(),
      name: "",
      taskListIds: [],
      taskIds: [],
    };
    setChecklists((prev) => [...prev, newChecklist]);
  }

  function handleUpdateChecklist(
    index: number,
    key: string,
    value: string | string[]
  ) {
    const updatedChecklists = [...checklists];
    updatedChecklists[index] = { ...updatedChecklists[index], [key]: value };
    setChecklists(updatedChecklists);
  }

  async function handleSave() {
    setIsLoading(true);
    try {
      const batch = writeBatch(db);
      checklists.forEach((checklist) => {
        const checklistRef = doc(db, "checklists", checklist.id);
        batch.set(checklistRef, checklist);
      });
      await batch.commit();
      toast.success("Checklists saved successfully!");
    } catch (e) {
      toast.error("Failed to save checklists.");
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <Container>
        <Label>Loading checklists...</Label>
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
      <Label>Checklists</Label>
      <Container>
        {checklists.map((cl: Checklist, i: number) => (
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
                    const tl = allTaskLists.find((taskL) => taskL.id === id);
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
                    if (taskListId && !cl.taskListIds.includes(taskListId)) {
                      handleUpdateChecklist(i, "taskListIds", [
                        ...cl.taskListIds,
                        taskListId,
                      ]);
                    }
                  }}
                  items={allTaskLists
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
                    const task = allTasks.find((t) => t.id === id);
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
                    if (taskId && !(cl.taskIds || []).includes(taskId)) {
                      handleUpdateChecklist(i, "taskIds", [
                        ...(cl.taskIds || []),
                        taskId,
                      ]);
                    }
                  }}
                  items={allTasks
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
          title={isLoading ? "Adding..." : "+ ADD CHECKLIST"}
          onPress={handleAddChecklist}
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
