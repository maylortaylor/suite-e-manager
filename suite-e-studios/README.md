# Suite E Studios App

A robust, role-based event management and checklist app for Suite E Studios, built with Expo, React Native, and TypeScript. Supports web, iOS, and Android, with Google Drive/Calendar/Forms integration and Firebase Hosting deployment.

## Features
- Role-based dashboards and checklists
- Google Calendar/Forms integration (scaffolded)
- Dark mode and UI size settings
- Persistent local storage
- Web, iOS, and Android support
- Firebase Hosting for web
- Docker support for static web preview

## Getting Started

1. Install dependencies
   ```bash
   npm install
   ```
2. Start the app (choose one):
   ```bash
   npm run start      # Expo Dev Tools
   npm run ios        # iOS simulator
   npm run android    # Android emulator
   npm run web        # Web (localhost)
   ```

## NPM Scripts Reference
- `start`         - Expo Dev Tools
- `ios`           - Run on iOS simulator
- `android`       - Run on Android emulator
- `web`           - Run on web (localhost)
- `build`         - Build static web export (for Firebase/Docker)
- `firebase:deploy` - Deploy web build to Firebase Hosting
- `lint`          - Run ESLint
- `expo:lint`     - Expo lint
- `typecheck`     - TypeScript strict check
- `test`          - Run tests (Jest)
- `prettier`      - Check formatting
- `prettier:fix`  - Auto-format code
- `clean`         - Remove build artifacts and node_modules
- `audit`         - Check for vulnerabilities
- `docker:build`  - Build Docker image
- `docker:run`    - Run Docker container

## Docker Usage
1. Build the Docker image:
   ```bash
   npm run docker:build
   ```
2. Run the container:
   ```bash
   npm run docker:run
   ```
   The app will be available at http://localhost:3000 (if using the default Dockerfile).

## Firebase Hosting Deployment
1. Build the web app:
   ```bash
   npm run build
   ```
2. Deploy to Firebase Hosting:
   ```bash
   npm run firebase:deploy
   ```

## Lint, Test, Typecheck, Format
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Test: `npm run test`
- Format: `npm run prettier:fix`

## Environment Variables
- Place any secrets or API keys in `.env.local` (not committed to git).

## Contributing
- Please follow code style and run lint/typecheck before PRs.

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
