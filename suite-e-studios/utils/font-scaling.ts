/** @format */

type UISize = "comfy" | "large";

export const getScaledFontSize = (baseSize: number, uiSize: UISize): number => {
  return uiSize === "large" ? Math.round(baseSize * 1.5) : baseSize;
};

// Common font sizes for the app
export const FontSizes = {
  small: 14,
  body: 16,
  subtitle: 20,
  title: 24,
  heading: 32,
  display: 46,
} as const;
