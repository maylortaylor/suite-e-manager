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
  checklist: (Checklist & { tasks: Task[]; taskLists: TaskList[] }) | null;
}

export function ChecklistList({ checklist }: ChecklistListProps) {
  const { state, dispatch } = useChecklist();
  const theme = useTheme();

  // Reset completed tasks when checklist changes
  React.useEffect(() => {
    if (!checklist) return;
    // The logic to filter completed tasks might need re-evaluation based on desired behavior.
    // For now, we'll rely on the global completedTasks set.
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
        {checklist.tasks?.length > 0 && (
          <View>
            <Label fontSize={24}>General Tasks</Label>
            <View style={{ marginTop: 12 }}>
              {checklist.tasks
                .filter(
                  (task) =>
                    !checklist.taskLists.some((tl) =>
                      tl.taskIds.includes(task.id)
                    )
                )
                .map((task: Task) => {
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
            {checklist.taskLists?.length > 0 && (
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
        {checklist.taskLists?.map((tl: TaskList, index: number) => {
          if (!tl) return null;
          return (
            <View key={tl.id}>
              <Label fontSize={24}>{tl.name}</Label>
              <View style={{ marginTop: 12 }}>
                {tl.taskIds.map((taskId: string) => {
                  const task = checklist.tasks.find((t) => t.id === taskId);
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
              {index < checklist.taskLists.length - 1 && (
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
