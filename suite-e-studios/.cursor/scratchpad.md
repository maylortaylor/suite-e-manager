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
8. **Google Services Integration (Scaffolding)**
   - [ ] Prepare API integration points for Google Calendar and Forms
   - [ ] Add placeholder for viewing Google Form results
9. **Testing & Error Handling**
   - [ ] Set up Jest/React Native Testing Library
   - [ ] Implement error boundaries and logging (expo-error-reporter/Sentry)
10. **Web Build**
    - [x] Prepare the Expo/React Native app for web build
    - [x] Set up a new Firebase project (if not already done)
    - [ ] Initialize Firebase Hosting in the project directory
    - [ ] Configure Firebase Hosting to serve the Expo web build
    - [ ] Deploy to Firebase Hosting
    - [ ] Document the deployment process for future updates

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
- [ ] Prepare Google Calendar and Google Forms integration scaffolding
- [x] Prepare Expo app for web build
- [x] Set up Firebase project
- [ ] Initialize Firebase Hosting
- [ ] Configure Hosting for Expo web build
- [ ] Deploy to Firebase Hosting
- [ ] Document deployment process

# Executor's Feedback or Assistance Requests
- Expo web build completed successfully using `npx expo export --platform web`.
- Output directory: `dist` (contains static web build for deployment).
- Firebase project and hosting are already set up.
- Next: Initialize Firebase Hosting in this directory (if not already done) and configure it for the Expo web build.

# Lessons
- 'expo-error-reporter' is not available on npm; use Sentry or other error reporting tools instead.
- Use --legacy-peer-deps when encountering peer dependency conflicts with React 19 and older libraries.

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