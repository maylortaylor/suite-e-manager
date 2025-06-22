/** @format */

import * as React from "react";
import * as firestore from "../services/firestore"; // Import our new service

import type { Checklist } from "../../types/checklist";
import type { Task } from "../../types/task";
import type { TaskList } from "../../types/task-list";
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
      fetchFullChecklist: (checklistId: string) => Promise<void>;
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

  const clearActiveChecklist = () => {
    dispatch({ type: "CLEAR_ACTIVE_CHECKLIST" });
  };

  const fetchFullChecklist = async (checklistId: string) => {
    dispatch({ type: "SET_LOADING", isLoading: true });
    console.log(`FETCH_START: Fetching full checklist for ID: ${checklistId}`);
    try {
      // 1. Fetch the main checklist document
      const checklist = await firestore.getDocument<Checklist>(
        "checklists",
        checklistId
      );
      console.log("FETCH_STEP_1: Main checklist doc fetched:", checklist);

      if (!checklist) {
        throw new Error(`Checklist with ID ${checklistId} not found!`);
      }

      // 2. Fetch all associated task lists
      let taskLists: TaskList[] = [];
      if (checklist.taskListIds && checklist.taskListIds.length > 0) {
        console.log(
          `FETCH_STEP_2: Fetching ${checklist.taskListIds.length} task lists...`
        );
        const taskListPromises = checklist.taskListIds.map((id) =>
          firestore.getDocument<TaskList>("taskLists", id)
        );
        taskLists = (await Promise.all(taskListPromises)).filter(
          (tl): tl is TaskList => tl !== null
        );
        console.log("FETCH_STEP_2_COMPLETE: Task lists fetched:", taskLists);
      } else {
        console.log("FETCH_STEP_2_SKIP: No taskListIds found on checklist.");
      }

      // 3. Gather all task IDs from the task lists and the checklist itself
      const taskListTaskIds = taskLists.flatMap((tl) => tl.taskIds || []);
      const directTaskIds = checklist.taskIds || [];
      const allTaskIds = Array.from(
        new Set([...directTaskIds, ...taskListTaskIds])
      );
      console.log(
        `FETCH_STEP_3: Combined all task IDs. Total unique tasks: ${allTaskIds.length}`,
        {
          directTaskIds,
          taskListTaskIds,
        }
      );

      // 4. Fetch all tasks
      let tasks: Task[] = [];
      if (allTaskIds.length > 0) {
        console.log(`FETCH_STEP_4: Fetching ${allTaskIds.length} tasks...`);
        const taskPromises = allTaskIds.map((id) =>
          firestore.getDocument<Task>("tasks", id)
        );
        tasks = (await Promise.all(taskPromises)).filter(
          (t): t is Task => t !== null
        );
        console.log("FETCH_STEP_4_COMPLETE: Tasks fetched:", tasks);
      } else {
        console.log("FETCH_STEP_4_SKIP: No task IDs to fetch.");
      }

      // 5. Set the fully populated checklist in the state
      const finalChecklist = {
        ...checklist,
        taskLists,
        tasks,
      };
      console.log(
        "FETCH_SUCCESS: Dispatching SET_ACTIVE_CHECKLIST with final data:",
        finalChecklist
      );
      dispatch({
        type: "SET_ACTIVE_CHECKLIST",
        checklist: finalChecklist,
      });
    } catch (e) {
      console.error("FETCH_ERROR: An error occurred in fetchFullChecklist.", e);
      dispatch({ type: "SET_ERROR", error: e as Error });
    }
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
