/** @format */

import { FontSizes, getScaledFontSize } from "@/utils/font-scaling";

import type { DefaultTheme } from "styled-components";
import styled from "styled-components/native";

export const CalendarContainer = styled.View<{ theme: DefaultTheme }>`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }: { theme: DefaultTheme }) => theme.global.spacing.md}px;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background};
`;

export const Input = styled.TextInput<{ theme: DefaultTheme }>`
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.input};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text};
  border: 1px solid #e0e7ef;
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    theme.global.borderRadius.base}px;
  padding: ${({ theme }: { theme: DefaultTheme }) => theme.global.spacing.sm}px;
  margin-top: ${({ theme }: { theme: DefaultTheme }) =>
    theme.global.spacing.xs}px;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    theme.global.spacing.sm}px;
  font-size: ${({
    fontSize,
    theme,
  }: {
    fontSize?: number;
    theme: DefaultTheme;
  }) =>
    getScaledFontSize(fontSize || theme.global.fontSize.base, theme.uiSize)}px;
  width: 100%;
  placeholdertextcolor: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.mutedText};
`;

export const BottomBar = styled.View<{ theme: DefaultTheme }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.input};
  padding: ${({ theme }: { theme: DefaultTheme }) =>
      theme.global.spacing.base}px
    0;
  border-top-width: 1px;
  border-top-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.input};
`;

export const ActionButton = styled.TouchableOpacity<{
  active?: boolean;
  theme: DefaultTheme;
}>`
  flex: 1;
  align-items: center;
  justify-content: center;
  height: ${({ theme }: { theme: DefaultTheme }) =>
    theme.global.spacing["2xl"]}px;
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    theme.global.borderRadius.lg}px;
  margin: 0px
    ${({ theme }: { theme: DefaultTheme }) => theme.global.spacing.base}px;
  background-color: ${({
    active,
    theme,
  }: {
    active?: boolean;
    theme: DefaultTheme;
  }) => (active ? theme.colors.primary : "transparent")};
`;

export const ActionButtonText = styled.Text<{
  active?: boolean;
  theme: DefaultTheme;
}>`
  font-size: ${({
    fontSize,
    theme,
  }: {
    fontSize?: number;
    theme: DefaultTheme;
  }) =>
    getScaledFontSize(fontSize || theme.global.fontSize.base, theme.uiSize)}px;
  color: ${({ active, theme }: { active?: boolean; theme: DefaultTheme }) =>
    active ? theme.colors.input : theme.colors.text};
  font-weight: ${({ active }: { active?: boolean }) =>
    active ? "bold" : "normal"};
`;

export const Container = styled.View<{ theme: DefaultTheme }>`
  flex: 1;
  padding: ${({ theme }: { theme: DefaultTheme }) => theme.global.spacing.md}px;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background};
`;

export const ItemBox = styled.View<{ theme: DefaultTheme }>`
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.secondary};
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    theme.global.borderRadius.base}px;
  padding: ${({ theme }: { theme: DefaultTheme }) => theme.global.spacing.sm}px;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    theme.global.spacing.sm}px;
  width: 100%;
  align-self: stretch;
`;

export const Label = styled.Text<{
  theme: DefaultTheme;
  fontSize?: number;
  color?: string;
}>`
  font-size: ${({
    fontSize,
    theme,
  }: {
    fontSize?: number;
    theme: DefaultTheme;
  }) =>
    getScaledFontSize(fontSize || theme.global.fontSize["xl"], theme.uiSize)}px;
  margin-right: ${({ theme }: { theme: DefaultTheme }) =>
    theme.global.spacing.md}px;
  color: ${({ color, theme }: { color?: string; theme: DefaultTheme }) =>
    color || theme.colors.text};
`;

export const ItemLabel = styled.Text<{
  theme: DefaultTheme;
  fontSize?: number;
}>`
  font-size: ${({
    fontSize,
    theme,
  }: {
    fontSize?: number;
    theme: DefaultTheme;
  }) =>
    getScaledFontSize(fontSize || theme.global.fontSize.md, theme.uiSize)}px;
  font-weight: 500;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    theme.global.spacing.sm}px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.lightText};
`;

export const ChipsRow = styled.View<{ theme: DefaultTheme }>`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }: { theme: DefaultTheme }) => theme.global.spacing.sm}px;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    theme.global.spacing.sm}px;
`;

export const ChipButton = styled.TouchableOpacity<{ theme: DefaultTheme }>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.accent};
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    theme.global.borderRadius.xl}px;
  padding: ${({ theme }: { theme: DefaultTheme }) => theme.global.spacing.xs}px
    ${({ theme }: { theme: DefaultTheme }) => theme.global.spacing.base}px;
  margin-right: ${({ theme }: { theme: DefaultTheme }) =>
    theme.global.spacing.xs}px;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    theme.global.spacing.xs}px;
`;

export const ChipText = styled.Text<{ theme: DefaultTheme }>`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.input};
  font-size: ${({ fontSize }: { fontSize?: number }) => fontSize || 24}px;
  margin-right: 4px;
`;

export const SuggestionBox = styled.TouchableOpacity<{ theme: DefaultTheme }>`
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.input};
  padding: 6px 12px;
  border-radius: 8px;
  margin-bottom: 2px;
`;

export const ChecklistBox = styled.View<{ theme: DefaultTheme }>`
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.secondary};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
`;

export const ChecklistTitle = styled.Text<{ theme: DefaultTheme }>`
  font-size: ${({ fontSize }: { fontSize?: number }) => fontSize || 36}px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.primary};
`;

export const TaskRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

export const TaskText = styled.Text<{ complete: boolean; theme: DefaultTheme }>`
  font-size: ${({
    fontSize,
    theme,
  }: {
    fontSize?: number;
    theme: DefaultTheme;
  }) => getScaledFontSize(fontSize || FontSizes.heading, theme.uiSize)}px;
  color: ${({ complete, theme }: { complete: boolean; theme: DefaultTheme }) =>
    complete ? theme.colors.mutedText : theme.colors.lightText};
  text-decoration-line: ${({ complete }: { complete: boolean }) =>
    complete ? "line-through" : "none"};
`;

export const Checkbox = styled.TouchableOpacity<{ theme: DefaultTheme }>`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border-width: 2px;
  border-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.accent};
  margin-right: 12px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.input};
`;

export const Checkmark = styled.View<{ theme: DefaultTheme }>`
  width: 14px;
  height: 14px;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.accent};
  border-radius: 3px;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
`;

export const SectionTitle = styled.Text<{ theme: DefaultTheme }>`
  font-size: ${({
    fontSize,
    theme,
  }: {
    fontSize?: number;
    theme: DefaultTheme;
  }) => getScaledFontSize(fontSize || FontSizes.subtitle, theme.uiSize)}px;
  font-weight: 600;
  margin-bottom: 16px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.primary};
`;

export const AuthContainer = styled.View<{ theme: DefaultTheme }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background};
`;

export const AuthInput = styled.TextInput<{ theme: DefaultTheme }>`
  width: 100%;
  max-width: 320px;
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 8px;
  border-width: 1px;
  placeholdertextcolor: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.mutedText};
  border-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.divider};
  font-size: ${({ fontSize }: { fontSize?: number }) => fontSize || 16}px;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.input};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text};
`;

export const AuthButton = styled.TouchableOpacity<{ theme: DefaultTheme }>`
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.accent};
  padding: 14px 32px;
  border-radius: 8px;
  align-items: center;
  margin-top: 8px;
`;

export const AuthButtonText = styled.Text<{ theme: DefaultTheme }>`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.lightText};
  font-size: ${({ fontSize }: { fontSize?: number }) => fontSize || 16}px;
  font-weight: 600;
`;

export const AuthErrorText = styled.Text<{ theme: DefaultTheme }>`
  color: #e53935;
  margin-bottom: 8px;
`;

export const HomeContainer = styled.View<{ theme: DefaultTheme }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background};
`;

export const WelcomeText = styled.Text<{ theme: DefaultTheme }>`
  font-size: ${({ fontSize }: { fontSize?: number }) => fontSize || 28}px;
  font-weight: 600;
  margin-bottom: 16px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text};
`;

export const RoleText = styled.Text<{ theme: DefaultTheme }>`
  font-size: ${({ fontSize }: { fontSize?: number }) => fontSize || 28}px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text};
  margin-bottom: 24px;
`;

export const DashboardBox = styled.View<{ theme: DefaultTheme }>`
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.secondary};
  border-radius: 12px;
  padding: 24px 32px;
  margin-bottom: 24px;
  align-items: center;
`;

export const HomeButton = styled.TouchableOpacity<{ theme: DefaultTheme }>`
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.accent};
  padding: 12px 28px;
  border-radius: 8px;
  align-items: center;
  margin-bottom: 16px;
`;

export const HomeButtonText = styled.Text<{ theme: DefaultTheme }>`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.lightText};
  font-size: ${({ fontSize }: { fontSize?: number }) => fontSize || 16}px;
  font-weight: 600;
`;

export const SettingsButton = styled.TouchableOpacity<{ theme: DefaultTheme }>`
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.highlight};
  padding: 12px 28px;
  border-radius: 8px;
  align-items: center;
  margin-bottom: 16px;
`;

export const SettingsButtonText = styled.Text<{ theme: DefaultTheme }>`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.lightText};
  font-size: ${({ fontSize }: { fontSize?: number }) => fontSize || 16}px;
  font-weight: 600;
`;

export const Header = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 16px 0 16px;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.input};
`;

export const UserIcon = styled.TouchableOpacity<{ theme: DefaultTheme }>`
  width: 36px;
  height: 36px;
  margin-right: 16px;
  border-radius: 18px;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.mutedText};
  align-items: center;
  justify-content: center;
`;

export const UserIconText = styled.Text`
  font-size: ${({ fontSize }: { fontSize?: number }) => fontSize || 22}px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.lightText};
`;

export const MenuModal = styled.Modal``;

export const MenuContainer = styled.View<{ theme: DefaultTheme }>`
  position: absolute;
  top: 63px;
  right: 0px;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.input};
  border-radius: 12px;
  padding: 12px;
  align-items: center;
  elevation: 4;
`;

export const MenuButton = styled.TouchableOpacity<{ theme: DefaultTheme }>`
  padding: 12px 32px;
  margin-bottom: 12px;
  border-radius: 8px;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.accent};
`;

export const MenuButtonText = styled.Text<{ theme: DefaultTheme }>`
  font-size: ${({ fontSize }: { fontSize?: number }) => fontSize || 16}px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.lightText};
`;

export const Chip = styled.View<{ theme: DefaultTheme }>`
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.primary};
  border-radius: 16px;
  padding: 4px 12px;
  margin-right: 8px;
  margin-bottom: 8px;
  flex-direction: row;
  align-items: center;
`;

export const ChipLabel = styled.Text<{ theme: DefaultTheme }>`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.input};
  font-size: ${({ fontSize }: { fontSize?: number }) => fontSize || 24}px;
  margin-right: 4px;
`;

export const ChipRemove = styled.TouchableOpacity<{ theme: DefaultTheme }>`
  padding: 2px;
`;

export const ChipRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 8px;
`;

export const SuggestionDropdown = styled.View<{ theme: DefaultTheme }>`
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.input};
  border-radius: 12px;
  elevation: 10;
  z-index: 9999;
  padding: 4px 0;
  max-height: 220px;
  overflow: hidden;
`;

export const SuggestionItem = styled.TouchableOpacity<{ theme: DefaultTheme }>`
  padding: 10px 16px;
  border-radius: 12px;
`;

export const SuggestionText = styled.Text<{ theme: DefaultTheme }>`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text};
  font-size: ${({ fontSize }: { fontSize?: number }) => fontSize || 16}px;
`;

export const CenteredSuggestionDropdown = styled.View<{ theme: DefaultTheme }>`
  position: absolute;
  top: 50%;
  left: 10%;
  width: 80%;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.input};
  border-radius: 12px;
  elevation: 10;
  z-index: 9999;
  padding: 4px 0;
  max-height: 220px;
  overflow: hidden;
  align-self: center;
`;

export const TabsContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  border-bottom-width: 1px;
  border-bottom-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.divider};
`;

export const TabButton = styled.TouchableOpacity<{ active?: boolean }>`
  padding: 12px 16px;
  border-bottom-width: 2px;
  border-bottom-color: ${(props: { active?: boolean; theme: DefaultTheme }) =>
    props.active ? props.theme.colors.accent : "transparent"};
`;

export const TabText = styled.Text<{ active?: boolean }>`
  color: ${(props: { active?: boolean; theme: DefaultTheme }) =>
    props.active ? props.theme.colors.accent : props.theme.colors.text};
  font-weight: ${(props: { active?: boolean }) =>
    props.active ? "bold" : "normal"};
  font-size: 16px;
`;

export const DrawerButton = styled.TouchableOpacity<{ theme: DefaultTheme }>`
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.secondary};
  padding: ${({ theme }: { theme: DefaultTheme }) =>
    theme.global.spacing.base}px;
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    theme.global.borderRadius.base}px;
  margin: ${({ theme }: { theme: DefaultTheme }) => theme.global.spacing.xs}px
    ${({ theme }: { theme: DefaultTheme }) => theme.global.spacing.sm}px;
`;

export const DrawerButtonText = styled.Text<{ theme: DefaultTheme }>`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text};
  font-size: ${({
    fontSize,
    theme,
  }: {
    fontSize?: number;
    theme: DefaultTheme;
  }) =>
    getScaledFontSize(fontSize || theme.global.fontSize.base, theme.uiSize)}px;
  font-weight: 500;
`;

export const Divider = styled.View<{ theme: DefaultTheme }>`
  height: 1px;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.divider};
  width: 100%;
  margin-vertical: ${({ theme }: { theme: DefaultTheme }) =>
    theme.global.spacing.md}px;
`;
