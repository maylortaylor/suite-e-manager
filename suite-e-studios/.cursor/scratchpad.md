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

# Project Status Board
- [x] Initialize Expo project and set up TypeScript strict mode
- [x] Install core dependencies
- [x] Establish initial directory structure
- [x] Outline TypeScript interfaces for core data models
- [x] Set up settings page with dark mode and UI size toggle
- [x] Integrate local storage for settings
- [x] Implement editable categories/roles in Settings page, persisted to AsyncStorage
- [x] Prepare Expo app for web build
- [x] Set up Firebase project and configure Hosting for Expo web build
- [x] Add npm scripts for build and deploy
- [x] **Data Migration:** Migrated all checklist data from local JSON to Cloud Firestore.
- [x] **Database Seeding:** Created a repeatable Node.js script to seed Firestore with initial data, including tasks, lists, checklists, and users.
- [x] **App Refactoring:** Refactored all data-related components and context to fetch and update data live from Firestore. This includes the Home screen and all "Edit" screens.
- [x] **Authentication:** Replaced mock login with Firebase Authentication (email/password). The login flow now fetches the user's role from Firestore to display the correct checklist.
- [x] **Logout:** Implemented a secure logout flow.
- [x] **Security:** Deployed Firestore security rules to protect user data and require authentication for all database access.
- [ ] Implement Google OAuth authentication
- [ ] Scaffold checklist components and context
- [ ] Support global/event-specific checklists and collections
- [ ] Add Task Button & AsyncStorage (Edit Tasks screen)
- [ ] Prepare Google Calendar and Google Forms integration scaffolding
- [ ] Set up Jest/React Native Testing Library
- [ ] Implement error boundaries and logging
- [ ] Initialize Firebase Hosting
- [ ] Deploy to Firebase Hosting
- [ ] Document deployment process
- [ ] Use categories/roles as dropdowns in task builder/new task form
- [ ] Use roles as dropdown in checklist form

# Executor's Feedback or Assistance Requests
- All planned features for Firestore integration and Firebase Authentication are complete. The app now uses a cloud database for data and a real authentication system.

# Lessons
- 'expo-error-reporter' is not available on npm; use Sentry or other error reporting tools instead.
- Use --legacy-peer-deps when encountering peer dependency conflicts with React 19 and older libraries.
- For Firebase Hosting, ensure `firebase.json` has the correct public directory ("dist") and SPA fallback (rewrites to /index.html).
- Use `npm run build` then `npm run deploy` for a clean deploy cycle.
- **Critical:** Be extremely careful with `rm -rf`. Always double-check the current working directory (`pwd`) before executing destructive commands. A safer way to recover from mistakes is `git restore <file>` or `git checkout HEAD -- <directory>`.

# Feature: Admin User with Full Access

## Background & Motivation
The application needs an administrative user who can view, create, update, and delete all data within the app (all checklists, tasks, users, etc.). This role is essential for system oversight, content management, and user support without being restricted to a specific role's checklist.

## Key Challenges & Analysis
- **Secure Role Check:** The primary challenge is securely identifying an admin user within Firestore Security Rules. This requires a separate database read within the rules to check the user's role, which must be done efficiently.
- **Admin UI/UX:** The user experience for an admin must be different from a standard user. Instead of seeing a single checklist, an admin needs a way to view and navigate all checklists and potentially manage other collections. We will start by providing a view of all checklists on the home screen for the admin.
- **Application Logic:** The `HomeScreen` and data-fetching logic will need to be refactored to handle two distinct cases: a standard user logging in versus an admin logging in.

## High-level Task Breakdown

1.  **Update Data Model & Seed Admin User:**
    - [x] Add a new `role` object to `global.checklists.json` with an `id` of `admin` and a `name` of "Admin".
    - [x] Add a new user to the `users` array in `global.checklists.json` with an email like `admin@suitee.com` and the `roleId` of `admin`.
    - [x] Success Criteria: After running the `npm run db:seed` script, the new "Admin" role and the admin user are successfully created in the `roles` and `users` collections in Firestore, and the user is created in Firebase Authentication.

2.  **Implement Admin-Aware Security Rules:**
    - [x] Update the `firestore.rules` to grant universal read/write access to any user identified as an admin.
    - [x] This will involve a helper function within the rules that checks the requesting user's `roleId` from their document in the `/users` collection.
    - [x] Non-admin authenticated users will retain their existing permissions (read-only on checklists/tasks, but only able to read their own user profile).
    - [x] Success Criteria: When deployed, the new security rules allow a logged-in admin to perform any action, while restricting other users appropriately.

3.  **Refactor Home Screen for Admin View:**
    - [x] Modify the `HomeScreen`'s login logic. After a user logs in, check if their fetched profile has the `roleId` of `admin`.
    - [x] **If the user is an admin:**
        - [x] Fetch the entire `checklists` collection from Firestore.
        - [x] Render a list of all available checklists on the screen.
        - [x] Allow the admin to tap on any checklist to navigate to its detailed view (we will likely need to adjust the `ChecklistContext` or navigation flow to handle selecting and displaying a specific checklist from this list).
    - [x] **If the user is not an admin:**
        - [x] The flow remains the same as it is now: fetch the single checklist associated with their role.
    - [x] Success Criteria: An admin user logs in and sees a list of all checklists. They can select one and view its tasks. A standard user logs in and sees only their assigned checklist.

# Feature: Improve Drawer Readability

## Background & Motivation
The user has reported that the text for the navigation items in the side drawer (e.g., "Home," "Task Editor," checklist names) is not readable. This is a critical UI/UX issue that makes the app difficult to navigate. The text color does not contrast sufficiently with the drawer background color, likely because it is not adapting correctly to the application's light and dark themes.

## Key Challenges & Analysis
- **Theme Integration:** The core challenge is to ensure the components within the drawer, specifically `DrawerItem`, respect the application's current theme (light or dark).
- **Component Styling:** The `@react-navigation/drawer` components have their own styling props (`activeTintColor`, `inactiveTintColor`, `labelStyle`) which need to be correctly managed. We need to determine the best way to apply our theme's colors to these props.
- **Context Awareness:** The `CustomDrawerContent` component must be aware of the current theme provided by `ThemeContext` to apply colors dynamically.

## High-level Task Breakdown

1.  **Make Drawer Theme-Aware:**
    -   **Task:** Modify `app/components/ui/CustomDrawerContent.tsx`.
    -   **Action:** Import and use the `useTheme` hook from `styled-components/native` to access the current theme's colors.
    -   **Success Criteria:** The component successfully receives the theme object containing the correct color values for the active theme (light/dark).

2.  **Apply Dynamic Text Color:**
    -   **Task:** Update the `DrawerItem` components within `CustomDrawerContent.tsx`.
    -   **Action:** Use the theme colors to dynamically set the `labelStyle` for each `DrawerItem`. The `color` property should be set to the theme's primary text color (e.g., `theme.colors.text`).
    -   **Success Criteria:** The text color of all items in the drawer (both the checklist list and the bottom buttons) automatically updates to a readable color when the app's theme is switched between light and dark mode.

3.  **Final Verification:**
    -   **Task:** Manually test the application.
    -   **Action:** Launch the app, open the drawer, and toggle between light and dark mode from the settings page.
    -   **Success Criteria:** The drawer text is clearly legible against the background in both themes.

# Feature: Improve Drawer Button Appearance

## Background & Motivation
The user wants the items in the navigation drawer to look more like distinct, pressable buttons rather than simple text labels. This will improve the user interface by making navigation options clearer and more interactive.

## Key Challenges & Analysis
- **Component Styling:** The default `DrawerItem` from `@react-navigation/drawer` has limited styling options. The best approach is to create a new, custom component that can be fully styled.
- **Theme Consistency:** The new button component must respect the application's light and dark themes, using colors from the theme context for its background and text.

## High-level Task Breakdown

1.  **Create Styled Components for Button:**
    -   **Task:** Modify `app/components/ui/styled.components.ts`.
    -   **Action:** Added `DrawerButton` and `DrawerButtonText` styled-components to define the appearance of the new drawer items. This includes properties like background color, padding, border-radius, and font styles that are all derived from the current theme.
    -   **Success Criteria:** The new styled components are defined and available for use.

2.  **Implement Custom Drawer Button Component:**
    -   **Task:** Modify `app/components/ui/CustomDrawerContent.tsx`.
    -   **Action:** Created a new reusable component, `CustomDrawerItem`, which uses the `DrawerButton` and `DrawerButtonText` components.
    -   **Success Criteria:** The `CustomDrawerItem` component correctly renders a button with the desired styling.

3.  **Replace Default Drawer Items:**
    -   **Task:** Modify `app/components/ui/CustomDrawerContent.tsx`.
    -   **Action:** Replaced all instances of the default `DrawerItem` with the new `CustomDrawerItem` component throughout the drawer's content, including static links, the dynamic checklist list, and the buttons in the bottom section.
    -   **Success Criteria:** All items in the drawer now appear as styled, pressable buttons. The app functions as before, with navigation and actions working correctly.

# Feature: Theme-Aware Drawer Styling

## Background & Motivation
The user wants to improve the overall styling of the navigation drawer. The current implementation does not fully respect the application's theme, particularly the background color. This feature will ensure the entire drawer, including its background and dividers, dynamically adapts to the selected light or dark theme, improving visual consistency and user experience.

## Key Challenges & Analysis
- **Navigator vs. Content Styling:** The drawer's final appearance is controlled by both the `Drawer.Navigator` configuration (in `drawer-navigator.tsx`) and the custom content component (`CustomDrawerContent.tsx`). The background color needs to be set at the navigator level to ensure the entire drawer area is covered.
- **Theme Propagation:** The theme object must be accessible within `drawer-navigator.tsx` to apply styles dynamically in the `screenOptions`.

## High-level Task Breakdown

1.  **Apply Theme to Drawer Navigator:**
    -   **Task:** Modify `app/navigation/drawer-navigator.tsx`.
    -   **Action:** The `Drawer.Navigator` component's `screenOptions` has been updated to a function that receives the `navigation` prop. We have implemented the `useTheme` hook to access the current theme and apply the `theme.colors.background` to the `drawerStyle` property. This makes the entire drawer background responsive to theme changes.
    -   **Success Criteria:** The main background of the drawer changes correctly when the user switches between light and dark themes in the settings.

2.  **Ensure Content Styles are Consistent:**
    -   **Task:** Review `app/components/ui/CustomDrawerContent.tsx`.
    -   **Action:** Verified that the styles within the custom drawer content, such as dividers and text, are also using theme-aware colors. The root `View`'s background matches the navigator's new background, preventing color conflicts.
    -   **Success Criteria:** All elements inside the drawer (buttons, labels, dividers) are clearly visible and styled appropriately against the new theme-aware background.

3.  **Final Verification:**
    -   **Task:** Manually test the application.
    -   **Action:** Launch the app, open the drawer, and toggle between light and dark mode from the settings page.
    -   **Success Criteria:** The drawer's background and all of its contents are styled correctly and are fully readable in both light and dark themes, providing a cohesive look.

## Project: Secure Firebase Configuration Management

### Background and Motivation

The project aims to securely manage Firebase configuration credentials within an Expo application. Currently, a `firebaseConfig.ts` file containing sensitive API keys is present in the codebase. This file is listed in `.gitignore` to prevent it from being committed to the public GitHub repository. However, this approach causes the application build to fail in CI/CD environments (like GitHub Actions) because the required file is missing.

The goal is to refactor the application to use environment variables for Firebase configuration. This allows for secure storage of credentials for both local development (using a local `.env` file) and for production deployments (using GitHub Repository Secrets), ensuring the application can be built and deployed without exposing sensitive information.

### Key Challenges and Analysis

1.  **Secret Management**: Sensitive keys must not be stored in the version-controlled codebase.
2.  **Local Development**: Developers need a straightforward way to provide these keys to the application on their local machines.
3.  **Deployment/CI/CD**: The automated build process needs a secure mechanism to access these keys to build the application for production.
4.  **Code Consistency**: The application code should not need to change between local and production environments. It should seamlessly read the configuration from its environment.

The chosen solution is to use `dotenv` functionality, which is built into Expo, to manage environment variables.

### High-level Task Breakdown

1.  **Setup Local Environment Configuration**: Create a `.env.example` file to serve as a template for developers, and update `.gitignore` to ensure local `.env` files are not committed.
2.  **Refactor Firebase Initialization**: Create a new, version-controlled file that initializes Firebase by reading credentials from environment variables. Update the application's entry point to use this new file.
3.  **Configure GitHub Actions for Secrets**: Create or update the GitHub Actions workflow file (`.github/workflows/main.yml`) to inject the GitHub Repository Secrets as environment variables during the build and deployment process.
4.  **Cleanup and Verification**: Remove the old, untracked `firebaseConfig.ts` file and verify that the application runs correctly both locally and when deployed.

### Project Status Board

- [x] **Task 1: Setup Local Environment Configuration**
    - [x] Create `suite-e-studios/.env.example`.
    - [x] Update `suite-e-studios/.gitignore` to include `.env`.
- [x] **Task 2: Refactor Firebase Initialization**
    - [x] Create `suite-e-studios/app/services/firebase.ts`.
    - [x] Modify `suite-e-studios/app/_layout.tsx` to use the new initialization file.
- [x] **Task 3: Configure GitHub Actions for Secrets**
    - [x] Create/update a GitHub Actions workflow to use secrets.
- [x] **Task 4: Cleanup and Verification**
    - [x] Delete the old `firebaseConfig.ts` file.
    - [ ] Manually verify local build works.
    - [ ] Manually verify deployment and production app works.

### Executor's Feedback or Assistance Requests

Execution of all planned tasks is complete. The project is now configured to use environment variables for Firebase credentials. Awaiting manual verification from the user to confirm that both local development and the production deployment are working correctly.

### Lessons

*This section is for documenting lessons learned to avoid repeating mistakes.*

# Project: Username/Password Authentication

## Background and Motivation

The goal is to allow users to log in to the application using a username and password combination instead of an email address. This provides a more traditional login experience. Since Firebase Authentication's standard email/password provider requires an email, we will implement a system where the application looks up the email associated with a given username from our Firestore database and then uses that email to authenticate with Firebase Auth.

## Key Challenges and Analysis

1.  **Data Seeding:** The user data in Firestore must be updated to include a `username` for each user. The seed script needs to be modified to handle this, including reading from a renamed data source file (`firebase.store-seed.json`).
2.  **Authentication Flow:** The login UI and logic must be changed. The app will need to query Firestore to find the user's email based on the entered username before attempting to sign in with Firebase. This adds an extra step to the login process.
3.  **User Experience:** Error handling needs to be clear. If a username isn't found, or if the password is correct, the user should receive a clear message without revealing whether the username or password was the incorrect part (to prevent username enumeration).

## High-level Task Breakdown / Project Status Board

- [x] **Task 1: Update Data Seeding Configuration**
    - [x] Rename `suite-e-studios/global.checklists.json` to `suite-e-studios/firebase.store-seed.json`.
    - [x] Confirm the user objects in `suite-e-studios/firebase.store-seed.json` contain `username` and `name` fields.
    - [x] Modify `suite-e-studios/scripts/seed-firestore.js` to read from `suite-e-studios/firebase.store-seed.json`.
    - [x] Update `suite-e-studios/scripts/seed-firestore.js` to save the `username` and `name` fields from the seed file into the `users` collection in Firestore.
    - **Success Criteria:** The seed script runs without errors. After running, the `users` collection in the Firestore database contains documents for each user, and each document includes the `email`, `roleId`, `username`, and `name` fields.

- [x] **Task 2: Implement Username/Password Login Flow**
    - [x] Modify the authentication component at `suite-e-studios/app/components/auth/index.tsx`.
    - [x] Change the input field from "Email" to "Username".
    - [x] Implement the logic to:
        1. Query the `users` collection in Firestore for the entered username.
        2. Retrieve the corresponding email address.
        3. Use the email and password to sign in with `signInWithEmailAndPassword`.
    - [x] Implement appropriate error handling for invalid username or password.
    - **Success Criteria:** A user can log in using their username and password. An invalid username or password results in a clear error message.

## Executor's Feedback or Assistance Requests

Task 1 is complete. The seed script has been updated. Please run the script and verify the data in Firestore.
Task 2 is complete. The login form now accepts a username. Please test the login functionality.

## Lessons

*(No lessons yet)*

# Project: Codebase Cleanup and Refactoring

## Background and Motivation

The user wants to improve the overall quality and maintainability of the codebase. Over time, development can lead to unused variables, imports, and code fragments. These artifacts increase cognitive load for developers, can sometimes hide bugs, and add unnecessary clutter. This project aims to systematically clean up the entire `suite-e-studios` application, removing dead code and ensuring consistency without altering any existing functionality.

## Key Challenges and Analysis

*   **Scope:** The cleanup needs to be comprehensive, covering all files within the `suite-e-studios` directory (components, screens, services, hooks, etc.).
*   **Safety:** The primary challenge is to remove code without introducing regressions. Automated tools are essential, but manual verification is still required.
*   **Tooling:** We will rely on the TypeScript compiler and ESLint to identify most of the unused code. We need to ensure our ESLint configuration is robust enough for this task. The rule `no-unused-vars` (and its TypeScript equivalent `@typescript-eslint/no-unused-vars`) is key.
*   **Dynamic Usage:** Some code might appear unused to a static analyzer but could be used dynamically. This is less common in a strongly-typed TypeScript project but is a possibility to be aware of.

## High-level Task Breakdown / Project Status Board

This will be a phased approach, cleaning directory by directory to manage complexity and make verification easier.

- [x] **Phase 1: ESLint Configuration Review and Enhancement**
- [x] **Phase 2: Cleanup `components` Directory**
- [x] **Phase 3: Cleanup `screens` Directory**
- [x] **Phase 4: Cleanup `context`, `services`, and `hooks`**
- [x] **Phase 5: Cleanup `types` and Root Files**
- [x] **Final Verification**

# Feature: Username/Password Authentication

## Background and Motivation

The goal is to allow users to log in to the application using a username and password combination instead of an email address. This provides a more traditional login experience. Since Firebase Authentication's standard email/password provider requires an email, we will implement a system where the application looks up the email associated with a given username from our Firestore database and then uses that email to authenticate with Firebase Auth.

## Key Challenges and Analysis

1.  **Data Seeding:** The user data in Firestore must be updated to include a `username` for each user. The seed script needs to be modified to handle this, including reading from a renamed data source file (`firebase.store-seed.json`).
2.  **Authentication Flow:** The login UI and logic must be changed. The app will need to query Firestore to find the user's email based on the entered username before attempting to sign in with Firebase. This adds an extra step to the login process.
3.  **User Experience:** Error handling needs to be clear. If a username isn't found, or if the password is correct, the user should receive a clear message without revealing whether the username or password was the incorrect part (to prevent username enumeration).

## High-level Task Breakdown / Project Status Board

- [x] **Task 1: Update Data Seeding Configuration**
    - [x] Rename `suite-e-studios/global.checklists.json` to `suite-e-studios/firebase.store-seed.json`.
    - [x] Confirm the user objects in `suite-e-studios/firebase.store-seed.json` contain `username` and `name` fields.
    - [x] Modify `suite-e-studios/scripts/seed-firestore.js` to read from `suite-e-studios/firebase.store-seed.json`.
    - [x] Update `suite-e-studios/scripts/seed-firestore.js` to save the `username` and `name` fields from the seed file into the `users` collection in Firestore.
    - **Success Criteria:** The seed script runs without errors. After running, the `users` collection in the Firestore database contains documents for each user, and each document includes the `email`, `roleId`, `username`, and `name` fields.

- [x] **Task 2: Implement Username/Password Login Flow**
    - [x] Modify the authentication component at `suite-e-studios/app/components/auth/index.tsx`.
    - [x] Change the input field from "Email" to "Username".
    - [x] Implement the logic to:
        1. Query the `users` collection in Firestore for the entered username.
        2. Retrieve the corresponding email address.
        3. Use the email and password to sign in with `signInWithEmailAndPassword`.
    - [x] Implement appropriate error handling for invalid username or password.
    - **Success Criteria:** A user can log in using their username and password. An invalid username or password results in a clear error message.

## Executor's Feedback or Assistance Requests

Task 1 is complete. The seed script has been updated. Please run the script and verify the data in Firestore.
Task 2 is complete. The login form now accepts a username. Please test the login functionality.

## Lessons

*(No lessons yet)*

# Project: Code Formatting Setup

## Background and Motivation

The user wants to automatically format the codebase to ensure consistent styling and improve readability. This is a standard best practice that makes the code easier to maintain. We will use Prettier, the de-facto standard code formatter, for this task.

## High-level Task Breakdown / Project Status Board

- [x] **Install Prettier**
- [x] **Create Configuration File**
- [x] **Add NPM Script**
- [x] **Run Formatter**

# Project: Fix Checklist Rendering Loop

## Background and Motivation

The user reported that the `ChecklistList` component is not appearing on the home screen. The browser console shows a "Maximum update depth exceeded" error, which indicates an infinite rendering loop. This is a critical bug that prevents a core part of the application from functioning.

## Key Challenges and Analysis

The root cause is a dependency cycle between the `HomeScreen` and the `ChecklistProvider`.

1.  **`HomeScreen`**: A `useEffect` hook calls `fetchFullChecklist` and depends on it.
2.  **`ChecklistProvider`**: The `fetchFullChecklist` function is defined within the component's body. When it runs, it dispatches a state update.
3.  **The Loop**: The state update causes `ChecklistProvider` to re-render, which re-creates the `fetchFullChecklist` function instance. `HomeScreen` sees this new function as a changed dependency and triggers its `useEffect` again, creating an infinite loop.

The solution is to memoize the function definitions in the provider using `React.useCallback` to ensure they have a stable identity across re-renders.

## High-level Task Breakdown / Project Status Board

- [x] **Task 1: Memoize Context Functions**
    -   **Action:** Modify `suite-e-studios/app/context/checklist-context.tsx`. Wrap the `fetchFullChecklist` and `clearActiveChecklist` functions in `React.useCallback` with an empty dependency array (`[]`).
    -   **Success Criteria:** The application no longer enters an infinite rendering loop. The checklist loads and displays correctly on the home screen after a user logs in.

## Executor's Feedback or Assistance Requests

The fix for the infinite loop has been applied by wrapping the context functions in `React.useCallback`. Please test the application to verify that the checklist now loads correctly on the home screen without causing the app to crash.

## Lessons

*(No lessons yet)*

# Project: Google Calendar Integration (Read-Only)

## Background and Motivation

The user wants to view events from a specific Google Calendar (`suite.e.stpete@gmail.com`) directly within the application. This feature will centralize scheduling information, making it unnecessary for users to switch to an external calendar app. The new "Calendar" screen will be accessible from the navigation drawer and should display both public and any accessible private calendars for that account.

## Key Challenges and Analysis

1.  **Authentication & Authorization:** To access private Google Calendar data, the app must authenticate with Google. We will leverage Firebase's Google Sign-In provider. This requires configuring OAuth 2.0 in the Google Cloud Console and requesting the necessary `calendar.readonly` scope from the user upon sign-in.
    - **Pitfall:** OAuth configuration is notoriously complex. Mismatched bundle IDs (iOS), package names (Android), or SHA-1 fingerprints in the Google Cloud Console will cause silent authentication failures.
    - **Mitigation:** We will need to create a custom development build to test this, as it likely won't work in Expo Go. We must meticulously follow documentation for generating and adding credentials for each platform (iOS, Android, Web).

2.  **Google Calendar API:** We will use the Google Calendar API to fetch a list of the user's calendars and the events within them. This requires enabling the API in the Google Cloud project.
    - **Pitfall:** The API has usage quotas. More importantly, handling asynchronous data fetching (first a list of calendars, then events for each) and correctly interpreting event timezones can be tricky.
    - **Mitigation:** We will implement robust async logic (e.g., `Promise.all`) and use a library like `date-fns` if necessary to handle timezone conversions correctly, ensuring events display at the right local time for the user. We will also need to manage the OAuth access token's lifecycle.

3.  **Calendar UI:** A dedicated UI component is needed to display events in a user-friendly format. We will use a third-party library like `react-native-calendars` to provide a familiar and interactive calendar interface.
    - **Pitfall:** The third-party library may not integrate seamlessly with our existing theme context (`styled-components`). It will also have its own specific data structure requirements for displaying events.
    - **Mitigation:** We will create a wrapper component for the calendar that transforms data from the Google API into the format the library expects. This wrapper will also be responsible for injecting theme colors into the library's styling props.

4.  **Navigation:** A new screen and a corresponding button in the drawer are needed to make the feature accessible.
    - **Pitfall:** This is a relatively low-risk task, but incorrect modifications to the navigation files could disrupt the entire app's navigation flow.
    - **Mitigation:** We will add the new screen and drawer item carefully, following the existing patterns in `drawer-navigator.tsx` and `CustomDrawerContent.tsx`.

5.  **Secure Credential Handling:** All client IDs and secrets must be managed securely using environment variables, consistent with the project's existing setup.
    - **Pitfall:** Forgetting to add new environment variables (e.g., `GOOGLE_WEB_CLIENT_ID`) to the `.env.example` file and the GitHub Actions secrets configuration will break local development for other contributors and fail the CI/CD pipeline.
    - **Mitigation:** We will ensure that any new environment variable is immediately added to the template and documented.

## High-level Task Breakdown / Project Status Board

- [ ] **Task 1: Implement Google OAuth Authentication**
    - [x] Integrate Firebase Authentication with the Google provider, including configuring the required OAuth client IDs in the Google Cloud Console.
    - [x] Request the `https://www.googleapis.com/auth/calendar.readonly` scope during the sign-in flow.
    - [x] Add a "Sign in with Google" button to the login screen.
    - **Success Criteria:** A user can sign in with the `suite.e.stpete@gmail.com` Google account, and the application successfully obtains an access token for the Calendar API.

- [ ] **Task 2: Create Calendar Screen and Navigation**
    - [ ] Create a new screen file at `suite-e-studios/app/screens/calendar/index.tsx`.
    - [ ] Add the new `CalendarScreen` to the drawer navigator in `suite-e-studios/app/navigation/drawer-navigator.tsx`.
    - [ ] Add a "Calendar" button to the drawer's UI in `suite-e-studios/app/components/ui/CustomDrawerContent.tsx`, positioned below the "Home" button.
    - **Success Criteria:** A "Calendar" option appears in the navigation drawer. Tapping it navigates the user to a new, empty "Calendar" screen.

- [ ] **Task 3: Fetch and Display Calendar Data**
    - [ ] Install a calendar UI library, such as `react-native-calendars`.
    - [ ] On the `CalendarScreen`, use the access token from the authenticated user to query the Google Calendar API (`calendarList.list` and `events.list`).
    - [ ] Render the fetched events in the calendar component.
    - **Success Criteria:** When a user navigates to the calendar screen, it displays events from their Google Calendar. The user can interact with the calendar to view different dates.

- [ ] **Task 4: Refine UI and Handle Edge Cases**
    - [ ] Implement loading indicators for when calendar data is being fetched.
    - [ ] Add clear error messages for API failures or if no calendars are found.
    - [ ] Ensure the calendar UI component is theme-aware, adapting to light and dark modes.
    - **Success Criteria:** The calendar screen provides a robust and user-friendly experience, gracefully handling loading, error, and empty states.

## Executor's Feedback or Assistance Requests

**Task 1 (Implement Google OAuth Authentication) is now ready for testing.**

After recovering from an accidental file deletion, the core code has been successfully re-implemented:
- The Google Sign-In package has been installed correctly.
- A new service was created at `suite-e-studios/app/services/google/auth.ts`.
- The `UserContext` has been updated to handle the authentication flow.
- A "Sign in with Google" button has been added to the login screen.
- All files are in their correct locations.

**Next Steps:**
- The user needs to verify the `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` environment variable is present locally in `.env` and has been added to GitHub secrets.
- Proceed with testing the sign-in flow.

## Lessons

- **Critical:** Be extremely careful with `rm -rf`. Always double-check the current working directory (`pwd`) before executing destructive commands. A safer way to recover from mistakes is `git restore <file>` or `git checkout HEAD -- <directory>`.

*(No lessons yet)*
