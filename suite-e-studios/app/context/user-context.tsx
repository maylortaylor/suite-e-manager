/** @format */

import * as React from "react";

import { GoogleAuthProvider, getAuth, signInWithCredential } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getSetting, saveSetting } from "@/utils/storage";

import type { User } from "../../types/user";
import { onGoogleButtonPress } from "../services/google/auth";
import { signOut } from "../services/google/auth";

const USER_SESSION_KEY = "user_session";
const SESSION_DURATION = 72 * 60 * 60 * 1000; // 72 hours in milliseconds

interface UserState {
  user: User | null;
  isLoading: boolean;
  hasError: boolean;
}

type Action =
  | { type: "LOGIN"; user: User }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "SET_ERROR"; hasError: boolean };

const initialState: UserState = {
  user: null,
  isLoading: true, // Start with loading true to check for session
  hasError: false,
};

const UserContext = React.createContext<
  | {
      state: UserState;
      dispatch: React.Dispatch<Action>;
      googleSignIn: () => Promise<void>;
    }
  | undefined
>(undefined);

function userReducer(state: UserState, action: Action): UserState {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.user,
        hasError: false,
      };
    case "LOGOUT":
      return { ...state, user: null };
    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading };
    case "SET_ERROR":
      return { ...state, hasError: action.hasError };
    default:
      return state;
  }
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = React.useReducer(userReducer, initialState);
  const auth = getAuth();
  const db = getFirestore();

  React.useEffect(() => {
    async function loadSession() {
      try {
        const sessionData = await getSetting(USER_SESSION_KEY);
        if (sessionData) {
          const { user, timestamp } = JSON.parse(sessionData);
          if (Date.now() - timestamp < SESSION_DURATION) {
            dispatch({ type: "LOGIN", user });
          } else {
            // Session expired
            await saveSetting(USER_SESSION_KEY, ""); // Clear expired session
          }
        }
      } catch (error) {
        console.error("Failed to load user session:", error);
      } finally {
        dispatch({ type: "SET_LOADING", isLoading: false });
      }
    }
    loadSession();
  }, []);

  const googleSignIn = async () => {
    dispatch({ type: "SET_LOADING", isLoading: true });
    try {
      const firebaseUser = await onGoogleButtonPress();

      if (firebaseUser?.uid) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          await enhancedDispatch({ type: "LOGIN", user: userData });
        } else {
          // This case can happen if a new Google user signs in who is not yet in our database.
          // For now, we'll treat it as an error and sign them out of Firebase.
          await signOut();
          dispatch({ type: "SET_ERROR", hasError: true });
        }
      } else {
        // This case handles when the user cancels the sign-in popup.
        // We don't need to show an error, just stop the loading indicator.
      }
    } catch (error) {
      console.error("Google Sign-In failed:", error);
      dispatch({ type: "SET_ERROR", hasError: true });
    } finally {
      dispatch({ type: "SET_LOADING", isLoading: false });
    }
  };

  const enhancedDispatch = async (action: Action) => {
    switch (action.type) {
      case "LOGIN":
        try {
          const sessionData = {
            user: action.user,
            timestamp: Date.now(),
          };
          await saveSetting(USER_SESSION_KEY, JSON.stringify(sessionData));
          dispatch(action);
        } catch (error) {
          console.error("Failed to save user session:", error);
          dispatch({ type: "SET_ERROR", hasError: true });
        }
        break;
      case "LOGOUT":
        try {
          await signOut(); // Use our new platform-aware sign out
          await saveSetting(USER_SESSION_KEY, ""); // Clear session
          dispatch(action);
        } catch (error) {
          console.error("Failed to clear user session:", error);
        }
        break;
      default:
        dispatch(action);
    }
  };

  return (
    <UserContext.Provider
      value={{
        state,
        dispatch: enhancedDispatch as React.Dispatch<Action>,
        googleSignIn,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
