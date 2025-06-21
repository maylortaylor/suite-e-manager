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
