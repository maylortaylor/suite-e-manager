/** @format */

import * as React from "react";

import {
  AuthButton,
  AuthButtonText,
  AuthContainer,
  AuthErrorText,
  AuthInput,
} from "@/app/components/ui/styled.components";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

import { Image } from "react-native";
import { useThemeMode } from "../../context/theme-context";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  isLoading: boolean;
  hasError: boolean;
}

export function LoginForm({ onLogin, isLoading, hasError }: LoginFormProps) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { colorScheme } = useThemeMode();
  const db = getFirestore();

  async function handleLogin() {
    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("username_lowercase", "==", username.trim().toLowerCase())
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("No matching documents.");
        onLogin("", ""); // Trigger error state
        return;
      }

      const userData = querySnapshot.docs[0].data();
      const email = userData.email;

      onLogin(email, password);
    } catch (error) {
      console.error("Error getting user email:", error);
      onLogin("", ""); // Trigger error state
    }
  }

  return (
    <AuthContainer accessibilityRole="form">
      <Image
        source={
          colorScheme === "dark"
            ? require("../../../images/SuiteE_vector_WHITE.png")
            : require("../../../images/SuiteE_vector_BLACK.png")
        }
        style={{
          width: 240,
          height: 240,
          marginBottom: 24,
          resizeMode: "contain",
        }}
        accessible
        accessibilityLabel="Suite E Studios Logo"
      />
      {hasError && (
        <AuthErrorText accessibilityRole="alert">
          Invalid credentials. Please try again.
        </AuthErrorText>
      )}
      <AuthInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        keyboardType="default"
        textContentType="username"
        accessible
        accessibilityLabel="Username"
        returnKeyType="next"
        editable={!isLoading}
      />
      <AuthInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="password"
        accessible
        accessibilityLabel="Password"
        returnKeyType="done"
        editable={!isLoading}
      />
      <AuthButton
        onPress={handleLogin}
        accessibilityRole="button"
        disabled={isLoading}
      >
        <AuthButtonText>{isLoading ? "Logging in..." : "Login"}</AuthButtonText>
      </AuthButton>
    </AuthContainer>
  );
}
