# Background and Motivation
Suite E Studios requires a robust, user-friendly mobile application to streamline backend operations, focusing on event management, task scheduling, and role-based workflows. The app will integrate with Google Drive, Google Calendar, and Google Forms to centralize data management and synchronization, improving efficiency for studio staff and admins.

The user wants to deploy the web version of the Suite E Studios app to a Google Firebase hosted website. This will make the app accessible via a public URL and allow for easy sharing and access from any browser.

# Key Challenges and Analysis
- **Google Services Integration:** Secure, efficient, and reliable integration with Google Calendar and Forms APIs for event/task management and data collection.
- **Role-Based Access Control (RBAC):** Ensuring users only see and interact with data relevant to their assigned roles, with a scalable permissions model.
- **Checklist Management:** Supporting both global and event-specific checklists, with collections for quick reuse.
- **Local Storage & Sync:** Caching checklist data and user settings locally, with future-proofing for server/database sync.
- **UI/UX:** Clean, accessible, responsive design with dark mode and UI size options, following Expo and accessibility best practices.
- **Error Handling & Security:** Robust error boundaries, secure storage, and proper validation/logging.
- Ensuring the Expo/React Native web build works as a static site or SPA suitable for Firebase Hosting.
- Configuring Firebase Hosting to serve the correct files and handle client-side routing (SPA fallback).
- Managing environment variables or secrets if needed for web.
- Ensuring the build process is reproducible and documented for future updates.
- **Task Management UX:** Allowing users to add new tasks easily, with persistence via AsyncStorage.

# High-level Task Breakdown
1. **Project Setup**
   - [x] Initialize Expo project with TypeScript strict mode
   - [x] Install core dependencies (react-navigation, react-query, styled-components/Tailwind, expo-image, etc.)
2. **Directory Structure**
   - [x] Create directories: `components/auth`, `components/checklist`, `components/settings`, `screens/home`, `screens/settings`, `navigation/main-stack`, `context`, `types`, `utils`
3. **Authentication Flow**
   - [ ] Implement Google OAuth authentication
   - [x] Implement login screen (placeholder for Google OAuth)
   - [x] Set up context/reducer for user/session state
4. **Navigation**
   - [x] Set up main stack navigator with role-based navigation placeholder
   - [x] Implement basic dashboard/home screen
5. **TypeScript Interfaces**
   - [x] Define interfaces for User, Role, Event, Task, Checklist, ChecklistCollection
6. **Settings & Local Storage**
   - [x] Implement settings page (dark mode, UI size toggle)
   - [x] Integrate local storage (AsyncStorage/react-native-encrypted-storage)
7. **Checklist Management**
   - [ ] Scaffold checklist components and context
   - [ ] Support global/event-specific checklists and collections
   - [ ] **Add Task Button & AsyncStorage**
     - Add an "ADD TASK" button at the bottom of the Edit Tasks screen, styled consistently with the app.
     - When pressed, append a new task (with unique ID, empty fields) to the list.
     - Ensure new tasks are editable and saved with "Save All" (persisted to AsyncStorage).
     - Success: User can add, edit, and save new tasks; tasks persist after reload.
8. **Google Services Integration (Scaffolding)**
   - [ ] Prepare API integration points for Google Calendar and Forms
   - [ ] Add placeholder for viewing Google Form results
9. **Testing & Error Handling**
   - [ ] Set up Jest/React Native Testing Library
   - [ ] Implement error boundaries and logging (expo-error-reporter/Sentry)
10. **Web Build & Firebase Hosting**
    - [x] Prepare the Expo/React Native app for web build
    - [x] Set up a new Firebase project (if not already done)
    - [x] Build the web app for static export (`npm run build`)
    - [x] Ensure `firebase.json` is configured to serve the `dist` directory and SPA fallback
    - [x] Add/verify npm scripts for build and deploy (`web:build`, `firebase:deploy`, `deploy`)
    - [ ] Initialize Firebase Hosting in the project directory (if not already done)
    - [ ] Deploy to Firebase Hosting (`npm run deploy`)
    - [ ] Document the deployment process for future updates (in README)
    - Success: Visiting the Firebase Hosting URL loads the latest web build and supports client-side routing.

# Project Status Board
- [ ] Implement Google OAuth authentication
- [x] Initialize Expo project and set up TypeScript strict mode
- [x] Install core dependencies (react-navigation, react-query, styled-components, expo-image, etc.)
- [x] Establish initial directory structure (components, screens, navigation, etc.)
- [x] Implement authentication flow (login screen)
- [x] Set up context/reducer for user/session state
- [x] Create basic dashboard/home screen
- [x] Set up role-based navigation placeholder
- [x] Outline TypeScript interfaces for User, Role, Event, Task, Checklist, ChecklistCollection
- [x] Integrate local storage for settings and cached checklists
- [x] Set up settings page with dark mode and UI size toggle
- [ ] Scaffold checklist components and context
- [ ] Support global/event-specific checklists and collections
- [ ] Add Task Button & AsyncStorage (Edit Tasks screen)
- [ ] Prepare Google Calendar and Google Forms integration scaffolding
- [x] Prepare Expo app for web build
- [x] Set up Firebase project
- [x] Build web app for static export
- [x] Configure Hosting for Expo web build (firebase.json, SPA fallback)
- [x] Add/verify npm scripts for build and deploy
- [ ] Initialize Firebase Hosting (if not already done)
- [ ] Deploy to Firebase Hosting
- [ ] Document deployment process
- [x] Add editable categories/roles to Settings page (complete)
- [x] Persist categories/roles to AsyncStorage (complete)
- [ ] Use categories/roles as dropdowns in task builder/new task form (in progress)
- [ ] Use roles as dropdown in checklist form

# Executor's Feedback or Assistance Requests
- Editable categories and roles UI in Settings is complete and persists to AsyncStorage.
- Next: Update the task form builder to load and use these lists as dropdowns for category and role fields, reading from storage on mount.
- Starting implementation of editable categories and roles in the Settings page (step 1 of the new feature plan).
- Approach: Add two sections to the Settings page for categories and roles, each with a list, input, add button, and remove option. Add a Save Settings button at the bottom. Will use AsyncStorage for persistence and provide sensible defaults if no data is present.
- UI/UX: Will ensure the UI is simple and mobile-friendly, with validation to prevent empty or duplicate entries. Will use existing styled components for consistency.
- Expo web build completed successfully using `npx expo export --platform web`.
- Output directory: `dist` (contains static web build for deployment).
- Firebase project and hosting are already set up.
- Next: Initialize Firebase Hosting in this directory (if not already done) and configure it for the Expo web build.
- Add Task Button: Awaiting implementation and test of add/edit/save new tasks with AsyncStorage.

# Lessons
- 'expo-error-reporter' is not available on npm; use Sentry or other error reporting tools instead.
- Use --legacy-peer-deps when encountering peer dependency conflicts with React 19 and older libraries.
- For Firebase Hosting, ensure `firebase.json` has the correct public directory ("dist") and SPA fallback (rewrites to /index.html).
- Use `npm run build` then `npm run deploy` for a clean deploy cycle.

---

## Initial Architectural Decisions & Code Examples

### Directory Structure Example

```
/components
  /auth
  /checklist
  /settings
/screens
  /home
  /settings
/navigation
  main-stack.tsx
/context
  user-context.tsx
  checklist-context.tsx
/types
  user.ts
  role.ts
  event.ts
  task.ts
  checklist.ts
  checklist-collection.ts
/utils
  storage.ts
```

### Example: TypeScript Interfaces

```ts
// types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
}

// types/role.ts
export interface Role {
  id: string;
  name: 'admin' | 'sound engineer' | 'event producer' | 'door person' | 'bar person';
}

// types/event.ts
export interface Event {
  id: string;
  title: string;
  start: string; // ISO date
  end: string; // ISO date
  roleId: string;
  checklistIds: string[];
}

// types/task.ts
export interface Task {
  id: string;
  description: string;
  isComplete: boolean;
  category: 'pre-event' | 'during-event' | 'post-event';
}

// types/checklist.ts
export interface Checklist {
  id: string;
  name: string;
  taskIds: string[];
  isGlobal: boolean;
}

// types/checklist-collection.ts
export interface ChecklistCollection {
  id: string;
  name: string;
  checklistIds: string[];
}
```

### Example: User Context with useReducer

```tsx
// context/user-context.tsx
import React, { createContext, useReducer, useContext, Dispatch } from 'react';
import { User } from '../types/user';

interface State {
  user: User | null;
  isLoading: boolean;
  hasError: boolean;
}

type Action =
  | { type: 'LOGIN'; user: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'SET_ERROR'; hasError: boolean };

function reducer(state: State, action: Action): State {
  if (action.type === 'LOGIN') return { ...state, user: action.user, isLoading: false, hasError: false };
  if (action.type === 'LOGOUT') return { ...state, user: null };
  if (action.type === 'SET_LOADING') return { ...state, isLoading: action.isLoading };
  if (action.type === 'SET_ERROR') return { ...state, hasError: action.hasError };
  return state;
}

const UserContext = createContext<{ state: State; dispatch: Dispatch<Action> } | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { user: null, isLoading: false, hasError: false });
  return <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}
```

### Example: Local Storage Helper

```ts
// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveSetting(key: string, value: string) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // handle error
  }
}

export async function getSetting(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    return null;
  }
}
```

### Example: App Entry with SafeAreaProvider and Navigation

```tsx
// App.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import MainStack from './navigation/main-stack';
import { UserProvider } from './context/user-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <NavigationContainer>
          <MainStack />
        </NavigationContainer>
      </UserProvider>
    </SafeAreaProvider>
  );
}
```

### Example: Settings Page (Dark Mode & UI Size)

```tsx
// screens/settings/index.tsx
import React from 'react';
import { View, Text, Switch } from 'react-native';
import { useColorScheme } from 'expo-color-scheme';

export function SettingsScreen() {
  const colorScheme = useColorScheme();
  // ...UI size toggle logic here
  return (
    <View>
      <Text>Dark Mode</Text>
      <Switch value={colorScheme === 'dark'} /* onValueChange={...} */ />
      {/* UI size toggle here */}
    </View>
  );
}
```

# Feature: Editable Categories & Roles

## Background & Motivation
- Users need to manage the lists of "categories" and "roles" used for tasks and checklists.
- These lists should be editable from the Settings page and persist across app restarts.
- Task and checklist forms should use these lists as dropdowns for consistent data entry.

## Key Challenges & Analysis
- **Persistence:** Use AsyncStorage (via `getSetting`/`saveSetting`) for categories and roles.
- **UI/UX:** Provide a simple, user-friendly way to view, add, and remove categories/roles in Settings.
- **Integration:** Update all forms (task builder, new task, checklist form) to use these lists as dropdowns.
- **Default Values:** Provide sensible defaults if no categories/roles are saved yet.
- **Validation:** Prevent duplicates and empty entries.

## High-level Task Breakdown (Categories & Roles)
1. **Settings Page: Category & Role Management**
   - [ ] Add two sections: "Task Categories" and "Task Roles".
   - [ ] Display current lists (from AsyncStorage or defaults).
   - [ ] Allow adding new entries (with input + add button).
   - [ ] Allow removing entries (with a delete button/icon).
   - [ ] Add a "Save Settings" button at the bottom to persist changes.
   - [ ] Success: User can view, add, and remove categories/roles, and save them to storage.
2. **Storage Integration**
   - [ ] Use AsyncStorage keys like `task-categories` and `task-roles`.
   - [ ] On app start, load these lists (or use defaults if not set).
   - [ ] On save, persist the updated lists.
3. **Task Builder & New Task Form**
   - [ ] Replace free-text "category" and "role" fields with dropdowns/selects.
   - [ ] Dropdown options come from the saved lists.
   - [ ] Allow "Add New" inline if possible (optional, stretch goal).
   - [ ] Success: User can only select from the saved categories/roles when creating/editing a task.
4. **Checklist Form**
   - [ ] Use the saved roles list for any role selection dropdowns.
   - [ ] Success: Checklist role selection is consistent with the settings.
5. **Testing & Validation**
   - [ ] Test adding/removing/saving categories and roles.
   - [ ] Test that forms update dynamically when lists change.
   - [ ] Ensure no duplicates or empty entries are allowed.

## Project Status Board (Additions)
- [ ] Add editable categories/roles to Settings page
- [ ] Persist categories/roles to AsyncStorage
- [ ] Use categories/roles as dropdowns in task builder/new task form
- [ ] Use roles as dropdown in checklist form

## Success Criteria
- Settings page allows full management of categories and roles.
- All relevant forms use these lists as dropdowns.
- Changes persist and are reflected throughout the app. 