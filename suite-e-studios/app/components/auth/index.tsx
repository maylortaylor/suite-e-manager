/** @format */

import * as React from "react";

import {
  AuthButton,
  AuthButtonText,
  AuthContainer,
  AuthErrorText,
  AuthInput,
} from "@/app/components/ui/styled.components";

import { Image } from "react-native";
import { useThemeMode } from "../../context/theme-context";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  isLoading: boolean;
  hasError: boolean;
}

export function LoginForm({ onLogin, isLoading, hasError }: LoginFormProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { colorScheme } = useThemeMode();

  function handleLogin() {
    onLogin(email.trim(), password);
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
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        accessible
        accessibilityLabel="Email"
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
        placeholderTextColor="#444"
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
