/** @format */

import * as React from "react";

import {
  Checkbox,
  ChecklistBox,
  ChecklistTitle,
  Checkmark,
  Container,
  TaskRow,
  TaskText,
} from "@/app/components/ui/styled.components";

import { useChecklist } from "../../context/checklist-context";

export function ChecklistList() {
  const { state, dispatch } = useChecklist();

  function handleToggleTask(taskId: string) {
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return;
    dispatch({
      type: "UPDATE_TASK",
      task: { ...task, isComplete: !task.isComplete },
    });
  }

  return (
    <Container>
      {state.checklists.map((checklist) => (
        <ChecklistBox key={checklist.id}>
          <ChecklistTitle>{checklist.name}</ChecklistTitle>
          {checklist.taskIds.map((taskId) => {
            const task = state.tasks.find((t) => t.id === taskId);
            if (!task) return null;
            return (
              <TaskRow key={task.id}>
                <Checkbox
                  onPress={() => handleToggleTask(task.id)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: task.isComplete }}
                >
                  {task.isComplete && <Checkmark />}
                </Checkbox>
                <TaskText complete={task.isComplete}>
                  {task.description}
                </TaskText>
              </TaskRow>
            );
          })}
        </ChecklistBox>
      ))}
    </Container>
  );
}
