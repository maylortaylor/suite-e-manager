/** @format */

import { DefaultTheme } from "styled-components";
import React from "react";
import { TouchableOpacityProps } from "react-native";
import { getScaledFontSize } from "@/utils/font-scaling";
import styled from "styled-components/native";

type ButtonVariant = "primary" | "secondary" | "accent" | "highlight";
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
  active?: boolean;
}

interface StyledButtonProps {
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth: boolean;
  active?: boolean;
  theme: DefaultTheme;
  disabled?: boolean;
}

interface ButtonTextProps {
  variant: ButtonVariant;
  size: ButtonSize;
  active?: boolean;
  theme: DefaultTheme;
}

const StyledButton = styled.TouchableOpacity<StyledButtonProps>`
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }: StyledButtonProps) =>
    theme.global.borderRadius.lg}px;
  background-color: ${({ variant, theme, active }: StyledButtonProps) => {
    if (active) return theme.colors.primary;
    switch (variant) {
      case "primary":
        return theme.colors.primary;
      case "secondary":
        return theme.colors.secondary;
      case "accent":
        return theme.colors.accent;
      case "highlight":
        return theme.colors.highlight;
      default:
        return theme.colors.primary;
    }
  }};
  padding: ${({ size, theme }: StyledButtonProps) => {
    switch (size) {
      case "small":
        return `${theme.global.spacing.xs}px ${theme.global.spacing.sm}px`;
      case "large":
        return `${theme.global.spacing.md}px ${theme.global.spacing.lg}px`;
      default: // medium
        return `${theme.global.spacing.sm}px ${theme.global.spacing.md}px`;
    }
  }};
  opacity: ${({ disabled }: StyledButtonProps) => (disabled ? 0.5 : 1)};
  width: ${({ fullWidth }: StyledButtonProps) => (fullWidth ? "100%" : "auto")};
`;

const ButtonText = styled.Text<ButtonTextProps>`
  color: ${({ theme }: ButtonTextProps) => theme.colors.lightText};
  font-weight: ${({ active }: ButtonTextProps) => (active ? "bold" : "500")};
  font-size: ${({ size, theme }: ButtonTextProps) => {
    switch (size) {
      case "small":
        return getScaledFontSize(theme.global.fontSize.sm, theme.uiSize);
      case "large":
        return getScaledFontSize(theme.global.fontSize.lg, theme.uiSize);
      default: // medium
        return getScaledFontSize(theme.global.fontSize.base, theme.uiSize);
    }
  }}px;
`;

export function Button({
  variant = "primary",
  size = "medium",
  fullWidth = false,
  children,
  active,
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      active={active}
      {...props}
    >
      {typeof children === "string" ? (
        <ButtonText variant={variant} size={size} active={active}>
          {children}
        </ButtonText>
      ) : (
        children
      )}
    </StyledButton>
  );
}
