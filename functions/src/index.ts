/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 *
 * @format
 */

import * as fs from "fs";
import * as functions from "firebase-functions";
import * as path from "path";

import {google} from "googleapis";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Path to the service account key
const SERVICE_ACCOUNT_PATH = path.join(__dirname, "../service-account.json");
const CALENDAR_ID = "suite.e.stpete@gmail.com"; // Change if needed

// Read service account credentials
const credentials = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf8"));

// Set up JWT auth client
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
const jwtClient = new google.auth.JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: SCOPES,
});

const calendar = google.calendar({ version: "v3", auth: jwtClient });

export const getCalendarEvents = functions.https.onCall(
  async (data, context) => {
    try {
      // Authorize the client
      await jwtClient.authorize();

      // Fetch events for the next year
      const now = new Date();
      const nextYear = new Date();
      nextYear.setFullYear(now.getFullYear() + 1);

      const response = await calendar.events.list({
        calendarId: CALENDAR_ID,
        timeMin: now.toISOString(),
        timeMax: nextYear.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
        maxResults: 2500,
      });

      const events = response.data.items || [];
      // Return only relevant fields for the frontend
      const formatted = events.map((event) => ({
        id: event.id,
        summary: event.summary,
        description: event.description,
        start: event.start,
        end: event.end,
        location: event.location,
        htmlLink: event.htmlLink,
        status: event.status,
        creator: event.creator,
        organizer: event.organizer,
        attendees: event.attendees,
        visibility: event.visibility,
      }));
      return { events: formatted };
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Unable to fetch calendar events",
        (error as Error).message
      );
    }
  }
);
