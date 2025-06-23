/** @format */

import { Alert, Platform } from "react-native";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithCredential,
  signInWithPopup,
} from "firebase/auth";

import { GoogleSignin } from "@react-native-google-signin/google-signin";

// Configure Google Sign-In for native platforms
export const configureGoogleSignIn = () => {
  if (Platform.OS === "web") return; // This library is not for web

  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
  });
};

// Function to handle Google Sign-In button press
export async function onGoogleButtonPress() {
  if (Platform.OS === "web") {
    // Web-specific flow
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/calendar.readonly");
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user; // Return the Firebase user object
    } catch (error) {
      console.error("Web Google Sign-In Error", error);
      return null;
    }
  } else {
    // Native-specific flow
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = (await GoogleSignin.signIn()) as any;
      if (idToken) {
        const googleCredential = GoogleAuthProvider.credential(idToken);
        const auth = getAuth();
        const userCredential = await signInWithCredential(
          auth,
          googleCredential
        );
        return userCredential.user; // Return the Firebase user object
      }
      return null;
    } catch (error: any) {
      Alert.alert("Google Sign-In Error", error.message);
      return null;
    }
  }
}

// Function to handle sign out
export const signOut = async () => {
  try {
    const auth = getAuth();
    if (Platform.OS !== "web") {
      await GoogleSignin.signOut();
    }
    await auth.signOut();
  } catch (error) {
    console.error(error);
  }
}; 