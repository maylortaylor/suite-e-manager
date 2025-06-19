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

interface Task {
  id: string;
  description: string;
  category: string;
  role: string;
}

interface TaskList {
  id: string;
  name: string;
  taskIds: string[];
}

interface Checklist {
  id: string;
  name: string;
  role: string;
  isGlobal: boolean;
  taskListIds: string[];
  taskIds: string[];
  taskLists?: TaskList[];
  tasks?: Task[];
}

interface ChecklistListProps {
  checklist: Checklist | null;
  taskLists?: TaskList[];
  tasks?: Task[];
}

export function ChecklistList({
  checklist,
  taskLists,
  tasks,
}: ChecklistListProps) {
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

  if (!checklist) {
    return null;
  }

  const allTaskLists = checklist.taskLists || taskLists || [];
  const allTasks = checklist.tasks || tasks || [];

  return (
    <Container>
      <ChecklistTitle>{checklist.name}</ChecklistTitle>
      <ChecklistBox key={checklist.id}>
        {/* Direct tasks */}
        {checklist.taskIds?.length > 0 && (
          <Container>
            <Label>General Tasks</Label>
            {checklist.taskIds.map((taskId: string) => {
              const task = allTasks.find((t: Task) => t.id === taskId);
              if (!task) return null;
              const isComplete = completed.has(task.id);
              return (
                <TaskRow key={task.id}>
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
          </Container>
        )}
        {/* Tasks from each associated task list */}
        {checklist.taskListIds?.map((tlid: string) => {
          const tl = allTaskLists.find((t: TaskList) => t.id === tlid);
          if (!tl) return null;
          return (
            <ChecklistBox key={tl.id}>
              <Label>{tl.name}</Label>
              {tl.taskIds.map((taskId: string) => {
                const task = allTasks.find((t: Task) => t.id === taskId);
                if (!task) return null;
                const isComplete = completed.has(task.id);
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
            </ChecklistBox>
          );
        })}
      </ChecklistBox>
    </Container>
  );
}
