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

export function ChecklistList({
  checklist,
  taskLists,
  tasks,
}: { checklist?: any; taskLists?: any[]; tasks?: any[] } = {}) {
  const { state, dispatch } = useChecklist();
  // If rendering a specific checklist, use its own taskLists/tasks if present, else fall back to props/context
  const allTaskLists =
    checklist && checklist.taskLists ? checklist.taskLists : taskLists || [];
  const allTasks =
    checklist && checklist.tasks ? checklist.tasks : tasks || state.tasks;

  // Local state for visual completion (strikethrough/muted) for all checklists
  const [completed, setCompleted] = React.useState<Set<string>>(
    () => new Set()
  );

  // Reset completed state when checklist changes (e.g., after Change Role)
  React.useEffect(() => {
    setCompleted(new Set());
  }, [checklist?.id]);

  function handleToggleTask(taskId: string) {
    setCompleted((prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  }

  return (
    <Container>
      {/* Show the random checklist if provided */}
      {checklist && (
        <ChecklistBox key={checklist.id}>
          <ChecklistTitle>{checklist.name}</ChecklistTitle>
          {/* Direct tasks */}
          {checklist.taskIds.map((taskId: string) => {
            const task = allTasks.find((t: any) => t.id === taskId);
            if (!task) return null;
            const isComplete = completed.has(task.id);
            return (
              <TaskRow key={task.id} onPress={() => handleToggleTask(task.id)}>
                <Checkbox
                  onPress={() => handleToggleTask(task.id)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isComplete }}
                >
                  {isComplete && <Checkmark />}
                </Checkbox>
                <TaskText complete={isComplete}>{task.description}</TaskText>
              </TaskRow>
            );
          })}
          {/* Tasks from each associated task list */}
          {checklist.taskListIds &&
            checklist.taskListIds.map((tlid: string) => {
              const tl = allTaskLists.find((t: any) => t.id === tlid);
              if (!tl) return null;
              return (
                <React.Fragment key={tl.id}>
                  <ChecklistTitle>{tl.name}</ChecklistTitle>
                  {tl.taskIds.map((taskId: string) => {
                    const task = allTasks.find((t: any) => t.id === taskId);
                    if (!task) return null;
                    const isComplete = completed.has(task.id);
                    return (
                      <TaskRow
                        key={task.id}
                        onPress={() => handleToggleTask(task.id)}
                      >
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
                </React.Fragment>
              );
            })}
        </ChecklistBox>
      )}
    </Container>
  );
}
