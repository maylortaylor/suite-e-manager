/** @format */

import * as React from "react";

import type { User } from "../../types/user";

interface State {
  user: User | null;
  isLoading: boolean;
  hasError: boolean;
}

type Action =
  | { type: "LOGIN"; user: User }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "SET_ERROR"; hasError: boolean };

function reducer(state: State, action: Action): State {
  if (action.type === "LOGIN")
    return { ...state, user: action.user, isLoading: false, hasError: false };
  if (action.type === "LOGOUT") return { ...state, user: null };
  if (action.type === "SET_LOADING")
    return { ...state, isLoading: action.isLoading };
  if (action.type === "SET_ERROR")
    return { ...state, hasError: action.hasError };
  return state;
}

const UserContext = React.createContext<
  { state: State; dispatch: React.Dispatch<Action> } | undefined
>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, {
    user: null,
    isLoading: false,
    hasError: false,
  });
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = React.useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}
