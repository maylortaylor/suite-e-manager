/** @format */

import * as React from "react";

import {
  loadAllChecklistData,
  saveAllChecklistData,
} from "../../utils/storage";

import type { Checklist } from "../../types/checklist";
import type { ChecklistCollection } from "../../types/checklist-collection";
import type { Task } from "../../types/task";
import type { TaskList } from "../../types/task-list";

interface State {
  checklists: Checklist[];
  tasks: Task[];
  collections: ChecklistCollection[];
  taskLists: TaskList[];
  completedTasks: Set<string>; // Track completed tasks
  isLoading: boolean;
  error: Error | null;
}

type Action =
  | { type: "SET_CHECKLISTS"; checklists: Checklist[] }
  | { type: "SET_TASKS"; tasks: Task[] }
  | { type: "SET_COLLECTIONS"; collections: ChecklistCollection[] }
  | { type: "SET_TASK_LISTS"; taskLists: TaskList[] }
  | { type: "ADD_CHECKLIST"; checklist: Checklist }
  | { type: "ADD_TASK"; task: Task }
  | { type: "ADD_COLLECTION"; collection: ChecklistCollection }
  | { type: "ADD_TASK_LIST"; taskList: TaskList }
  | { type: "UPDATE_TASK"; task: Task }
  | { type: "UPDATE_TASK_LIST"; taskList: TaskList }
  | { type: "UPDATE_CHECKLIST"; checklist: Checklist }
  | { type: "TOGGLE_TASK_COMPLETION"; taskId: string }
  | { type: "SET_COMPLETED_TASKS"; completedTasks: Set<string> }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "SET_ERROR"; error: Error | null }
  | {
      type: "SAVE_ALL";
      data: { tasks: Task[]; taskLists: TaskList[]; checklists: Checklist[] };
    };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_CHECKLISTS":
      return { ...state, checklists: action.checklists };
    case "SET_TASKS":
      return { ...state, tasks: action.tasks };
    case "SET_COLLECTIONS":
      return { ...state, collections: action.collections };
    case "SET_TASK_LISTS":
      return { ...state, taskLists: action.taskLists };
    case "ADD_CHECKLIST":
      return { ...state, checklists: [...state.checklists, action.checklist] };
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.task] };
    case "ADD_COLLECTION":
      return {
        ...state,
        collections: [...state.collections, action.collection],
      };
    case "ADD_TASK_LIST":
      return { ...state, taskLists: [...state.taskLists, action.taskList] };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.task.id ? action.task : t
        ),
      };
    case "UPDATE_TASK_LIST":
      return {
        ...state,
        taskLists: state.taskLists.map((t) =>
          t.id === action.taskList.id ? action.taskList : t
        ),
      };
    case "UPDATE_CHECKLIST":
      return {
        ...state,
        checklists: state.checklists.map((c) =>
          c.id === action.checklist.id ? action.checklist : c
        ),
      };
    case "TOGGLE_TASK_COMPLETION":
      const newCompletedTasks = new Set(state.completedTasks);
      if (newCompletedTasks.has(action.taskId)) {
        newCompletedTasks.delete(action.taskId);
      } else {
        newCompletedTasks.add(action.taskId);
      }
      return { ...state, completedTasks: newCompletedTasks };
    case "SET_COMPLETED_TASKS":
      return {
        ...state,
        completedTasks: action.completedTasks,
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "SAVE_ALL":
      return {
        ...state,
        tasks: action.data.tasks,
        taskLists: action.data.taskLists,
        checklists: action.data.checklists,
      };
    default:
      return state;
  }
}

const ChecklistContext = React.createContext<
  | {
      state: State;
      dispatch: React.Dispatch<Action>;
    }
  | undefined
>(undefined);

export function ChecklistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, {
    checklists: [],
    tasks: [],
    collections: [],
    taskLists: [],
    completedTasks: new Set<string>(),
    isLoading: true, // Start with loading state
    error: null,
  });

  // Load data on mount
  React.useEffect(() => {
    async function loadData() {
      try {
        dispatch({ type: "SET_LOADING", isLoading: true });
        const data = await loadAllChecklistData();
        dispatch({ type: "SET_TASKS", tasks: data.tasks });
        dispatch({ type: "SET_TASK_LISTS", taskLists: data.taskLists });
        dispatch({ type: "SET_CHECKLISTS", checklists: data.checklists });
        if (data.completedTasks) {
          // For each completed task, dispatch TOGGLE_TASK_COMPLETION
          Array.from(data.completedTasks).forEach((taskId) => {
            dispatch({ type: "TOGGLE_TASK_COMPLETION", taskId });
          });
        }
      } catch (e) {
        dispatch({ type: "SET_ERROR", error: e as Error });
      } finally {
        dispatch({ type: "SET_LOADING", isLoading: false });
      }
    }
    loadData();
  }, []);

  // Save data when state changes
  React.useEffect(() => {
    // Don't save while loading initial data
    if (state.isLoading) return;

    const saveData = async () => {
      try {
        await saveAllChecklistData({
          tasks: state.tasks,
          taskLists: state.taskLists,
          checklists: state.checklists,
          completedTasks: state.completedTasks,
        });
      } catch (e) {
        dispatch({ type: "SET_ERROR", error: e as Error });
      }
    };

    saveData();
  }, [state.tasks, state.taskLists, state.checklists, state.completedTasks]);

  return (
    <ChecklistContext.Provider value={{ state, dispatch }}>
      {children}
    </ChecklistContext.Provider>
  );
}

export function useChecklist() {
  const context = React.useContext(ChecklistContext);
  if (!context)
    throw new Error("useChecklist must be used within a ChecklistProvider");
  return context;
}
