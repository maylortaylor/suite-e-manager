/** @format */

import * as React from "react";
import * as firestore from "../services/firestore"; // Import our new service

import { doc, onSnapshot } from "firebase/firestore";

import type { Checklist } from "../../types/checklist";
import type { Task } from "../../types/task";
import type { TaskList } from "../../types/task-list";
import { db } from "../services/firebase";
import { toast } from "../../utils/toast";

// The new state will hold a single, fully populated checklist
interface State {
  activeChecklist:
    | (Checklist & { tasks: Task[]; taskLists: TaskList[] })
    | null;
  completedTasks: Set<string>;
  isLoading: boolean;
  error: Error | null;
}

type Action =
  | {
      type: "SET_ACTIVE_CHECKLIST";
      checklist: (Checklist & { tasks: Task[]; taskLists: TaskList[] }) | null;
    }
  | { type: "UPDATE_TASK"; task: Task }
  | { type: "TOGGLE_TASK_COMPLETION"; taskId: string }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "SET_ERROR"; error: Error | null }
  | { type: "CLEAR_ACTIVE_CHECKLIST" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_ACTIVE_CHECKLIST":
      return {
        ...state,
        activeChecklist: action.checklist,
        isLoading: false,
        error: null,
      };
    case "CLEAR_ACTIVE_CHECKLIST":
      return {
        ...state,
        activeChecklist: null,
      };
    case "UPDATE_TASK":
      if (!state.activeChecklist) return state;
      return {
        ...state,
        activeChecklist: {
          ...state.activeChecklist,
          tasks: state.activeChecklist.tasks.map((t) =>
            t.id === action.task.id ? action.task : t
          ),
        },
      };
    case "TOGGLE_TASK_COMPLETION":
      const newCompletedTasks = new Set(state.completedTasks);
      if (newCompletedTasks.has(action.taskId)) {
        newCompletedTasks.delete(action.taskId);
      } else {
        newCompletedTasks.add(action.taskId);
      }
      return { ...state, completedTasks: newCompletedTasks };
    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading };
    case "SET_ERROR":
      toast.error("An error occurred", action.error?.message);
      return { ...state, error: action.error, isLoading: false };
    default:
      return state;
  }
}

// The context will now also provide the fetch function
const ChecklistContext = React.createContext<
  | {
      state: State;
      dispatch: React.Dispatch<Action>;
      fetchFullChecklist: (checklistId: string) => void;
      clearActiveChecklist: () => void;
    }
  | undefined
>(undefined);

export function ChecklistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, {
    activeChecklist: null,
    completedTasks: new Set<string>(),
    isLoading: false,
    error: null,
  });

  // Store the unsubscribe function for the real-time listener
  const unsubscribeRef = React.useRef<(() => void) | null>(null);

  const clearActiveChecklist = () => {
    // If there's an active listener, unsubscribe from it
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    dispatch({ type: "CLEAR_ACTIVE_CHECKLIST" });
  };

  const fetchFullChecklist = (checklistId: string) => {
    // Unsubscribe from any previous listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    const checklistRef = doc(db, "checklists", checklistId);

    // Set up the real-time listener
    const unsubscribe = onSnapshot(
      checklistRef,
      { includeMetadataChanges: true }, // Important: This gets us cache status
      async (snapshot) => {
        const source = snapshot.metadata.fromCache ? "local cache" : "server";
        console.log(`Data came from ${source}`);

        // Only show loading indicator if data is coming from the server
        dispatch({
          type: "SET_LOADING",
          isLoading: !snapshot.metadata.fromCache,
        });

        if (!snapshot.exists()) {
          dispatch({
            type: "SET_ERROR",
            error: new Error(`Checklist with ID ${checklistId} not found!`),
          });
          return;
        }

        try {
          const checklist = {
            id: snapshot.id,
            ...snapshot.data(),
          } as Checklist;

          // Fetch related data (task lists and tasks)
          let taskLists: TaskList[] = [];
          if (checklist.taskListIds && checklist.taskListIds.length > 0) {
            const taskListPromises = checklist.taskListIds.map((id) =>
              firestore.getDocument<TaskList>("taskLists", id)
            );
            taskLists = (await Promise.all(taskListPromises)).filter(
              (tl): tl is TaskList => tl !== null
            );
          }

          const taskListTaskIds = taskLists.flatMap((tl) => tl.taskIds || []);
          const directTaskIds = checklist.taskIds || [];
          const allTaskIds = Array.from(
            new Set([...directTaskIds, ...taskListTaskIds])
          );

          let tasks: Task[] = [];
          if (allTaskIds.length > 0) {
            const taskPromises = allTaskIds.map((id) =>
              firestore.getDocument<Task>("tasks", id)
            );
            tasks = (await Promise.all(taskPromises)).filter(
              (t): t is Task => t !== null
            );
          }

          const finalChecklist = {
            ...checklist,
            taskLists,
            tasks,
          };

          dispatch({
            type: "SET_ACTIVE_CHECKLIST",
            checklist: finalChecklist,
          });
        } catch (e) {
          dispatch({ type: "SET_ERROR", error: e as Error });
        }
      },
      (error) => {
        // This is the error callback for onSnapshot
        dispatch({ type: "SET_ERROR", error });
      }
    );

    // Store the new unsubscribe function
    unsubscribeRef.current = unsubscribe;
  };

  return (
    <ChecklistContext.Provider
      value={{ state, dispatch, fetchFullChecklist, clearActiveChecklist }}
    >
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
