/** @format */

import * as React from "react";

import type { Checklist } from "../../types/checklist";
import type { ChecklistCollection } from "../../types/checklist-collection";
import type { Task } from "../../types/task";

interface State {
  checklists: Checklist[];
  tasks: Task[];
  collections: ChecklistCollection[];
}

type Action =
  | { type: "SET_CHECKLISTS"; checklists: Checklist[] }
  | { type: "SET_TASKS"; tasks: Task[] }
  | { type: "SET_COLLECTIONS"; collections: ChecklistCollection[] }
  | { type: "ADD_CHECKLIST"; checklist: Checklist }
  | { type: "ADD_TASK"; task: Task }
  | { type: "ADD_COLLECTION"; collection: ChecklistCollection }
  | { type: "UPDATE_TASK"; task: Task };

function reducer(state: State, action: Action): State {
  if (action.type === "SET_CHECKLISTS")
    return { ...state, checklists: action.checklists };
  if (action.type === "SET_TASKS") return { ...state, tasks: action.tasks };
  if (action.type === "SET_COLLECTIONS")
    return { ...state, collections: action.collections };
  if (action.type === "ADD_CHECKLIST")
    return { ...state, checklists: [...state.checklists, action.checklist] };
  if (action.type === "ADD_TASK")
    return { ...state, tasks: [...state.tasks, action.task] };
  if (action.type === "ADD_COLLECTION")
    return { ...state, collections: [...state.collections, action.collection] };
  if (action.type === "UPDATE_TASK")
    return {
      ...state,
      tasks: state.tasks.map((t) =>
        t.id === action.task.id ? action.task : t
      ),
    };
  return state;
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
  });
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
