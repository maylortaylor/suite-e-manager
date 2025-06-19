/** @format */

import * as React from "react";

import {
  Checkbox,
  ChecklistBox,
  ChecklistTitle,
  Checkmark,
  Container,
  Label,
  TaskRow,
  TaskText,
} from "@/app/components/ui/styled.components";

import type { Checklist } from "../../../types/checklist";
import { Divider } from "../ui/Divider";
import type { Task } from "../../../types/task";
import type { TaskList } from "../../../types/task-list";
import { View } from "react-native";
import { useChecklist } from "../../context/checklist-context";
import { useTheme } from "styled-components/native";

interface ChecklistListProps {
  checklist: Checklist | null;
}

export function ChecklistList({ checklist }: ChecklistListProps) {
  const { state, dispatch } = useChecklist();
  const theme = useTheme();

  // Reset completed tasks when checklist changes
  React.useEffect(() => {
    if (!checklist) return;
    // Load completed tasks from context
    const completedTasks = state.completedTasks;
    // Filter out any completed tasks that aren't in this checklist
    const allTaskIds = [
      ...(checklist.taskIds || []),
      ...(checklist.taskListIds || []).flatMap((tlid) => {
        const tl = state.taskLists.find((t) => t.id === tlid);
        return tl ? tl.taskIds : [];
      }),
    ];
    const validCompletedTasks = new Set(
      Array.from(completedTasks).filter((id) => allTaskIds.includes(id))
    );
    if (validCompletedTasks.size !== completedTasks.size) {
      dispatch({
        type: "SET_COMPLETED_TASKS",
        completedTasks: validCompletedTasks,
      });
    }
  }, [checklist?.id]);

  function handleToggleTask(taskId: string) {
    dispatch({ type: "TOGGLE_TASK_COMPLETION", taskId });
  }

  if (!checklist) {
    return null;
  }

  return (
    <Container>
      <ChecklistTitle>{checklist.name}</ChecklistTitle>
      <ChecklistBox key={checklist.id}>
        {/* Direct tasks */}
        {checklist.taskIds?.length > 0 && (
          <View>
            <Label fontSize={24}>General Tasks</Label>
            <View style={{ marginTop: 12 }}>
              {checklist.taskIds.map((taskId: string) => {
                const task = state.tasks.find((t: Task) => t.id === taskId);
                if (!task) return null;
                const isComplete = state.completedTasks.has(task.id);
                return (
                  <TaskRow key={task.id}>
                    <Checkbox
                      onPress={() => handleToggleTask(task.id)}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: isComplete }}
                    >
                      {isComplete && <Checkmark />}
                    </Checkbox>
                    <TaskText complete={isComplete}>
                      {task.description}
                    </TaskText>
                  </TaskRow>
                );
              })}
            </View>
            {checklist.taskListIds?.length > 0 && (
              <Divider
                orientation="horizontal"
                thickness={1}
                marginVertical={20}
                marginHorizontal={0}
                color={theme.colors.text}
              />
            )}
          </View>
        )}
        {/* Tasks from each associated task list */}
        {checklist.taskListIds?.map((tlid: string, index: number) => {
          const tl = state.taskLists.find((t: TaskList) => t.id === tlid);
          if (!tl) return null;
          return (
            <View key={tl.id}>
              <Label fontSize={24}>{tl.name}</Label>
              <View style={{ marginTop: 12 }}>
                {tl.taskIds.map((taskId: string) => {
                  const task = state.tasks.find((t: Task) => t.id === taskId);
                  if (!task) return null;
                  const isComplete = state.completedTasks.has(task.id);
                  return (
                    <TaskRow key={task.id}>
                      <Checkbox
                        onPress={() => handleToggleTask(task.id)}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: isComplete }}
                      >
                        {isComplete && <Checkmark />}
                      </Checkbox>
                      <TaskText complete={isComplete}>
                        {task.description}
                      </TaskText>
                    </TaskRow>
                  );
                })}
              </View>
              {index < checklist.taskListIds.length - 1 && (
                <Divider
                  orientation="horizontal"
                  thickness={1}
                  marginVertical={20}
                  marginHorizontal={0}
                  color={theme.colors.text}
                />
              )}
            </View>
          );
        })}
      </ChecklistBox>
    </Container>
  );
}
