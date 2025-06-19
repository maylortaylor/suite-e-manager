/** @format */

import Toast from "react-native-toast-message";

type ToastType = "success" | "error" | "info";

interface ToastConfig {
  type?: ToastType;
  text1?: string;
  text2?: string;
  position?: "top" | "bottom";
  visibilityTime?: number;
}

const DEFAULT_DURATION = 3000;

export const showToast = ({
  type = "success",
  text1,
  text2,
  position = "top",
  visibilityTime = DEFAULT_DURATION,
}: ToastConfig) => {
  Toast.show({
    type,
    text1,
    text2,
    position,
    visibilityTime,
  });
};

export const toast = {
  success: (message: string, description?: string) =>
    showToast({ type: "success", text1: message, text2: description }),
  error: (message: string, description?: string) =>
    showToast({ type: "error", text1: message, text2: description }),
  info: (message: string, description?: string) =>
    showToast({ type: "info", text1: message, text2: description }),
};
