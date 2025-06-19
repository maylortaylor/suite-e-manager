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

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  isLoading: boolean;
  hasError: boolean;
}

export function LoginForm({ onLogin, isLoading, hasError }: LoginFormProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function handleLogin() {
    onLogin(email.trim(), password);
  }

  return (
    <AuthContainer accessibilityRole="form">
      <Image
        source={require("../../../images/Suite_E_Logo_small.png")}
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
        placeholderTextColor="#444"
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
