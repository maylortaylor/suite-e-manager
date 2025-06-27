# Suite E Studios – Monorepo Overview

GOOGLE CALENDAR ACCESS - calendar-reader@social-media-manager-eb123.iam.gserviceaccount.com

## Project Goal
Suite E Studios is a robust, user-friendly mobile and web application for event management, task scheduling, and role-based workflows. The app integrates with Google Drive, Calendar, and Forms to centralize data and streamline operations for studio staff and admins. The web version is deployed via Firebase Hosting.

## Monorepo Structure

```
suite_e/
  README.md                # (this file)
  suite-e-studios/         # Main Expo/React Native/TypeScript app
    app/                   # Source code (screens, components, context, etc.)
    assets/                # Images, fonts, icons
    dist/                  # Web build output (for Firebase Hosting)
    ...                    # (see suite-e-studios/README.md for details)
```

## Key Features
- Role-based dashboards and checklists
- Google Calendar/Forms integration (scaffolded)
- Dark mode and UI size settings
- Persistent local storage
- Web, iOS, and Android support
- Firebase Hosting for web
- Docker support for static web preview

## Deployment Workflow
1. **Build the web app:**
   ```sh
   cd suite-e-studios
   npm run build
   ```
2. **Deploy to Firebase Hosting:**
   ```sh
   npm run firebase:deploy
   ```
3. **(Optional) Use Docker for local static preview:**
   ```sh
   npm run docker:build
   npm run docker:run
   ```

## Automation & CI/CD
- GitHub Actions workflows are set up for PR and main branch deploys to Firebase Hosting.
- See `.github/workflows/` in the root for details.

## For more details
See `suite-e-studios/README.md` for app-specific scripts, features, and development instructions. 