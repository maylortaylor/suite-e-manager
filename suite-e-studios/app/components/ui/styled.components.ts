/** @format */

import type { DefaultTheme } from "styled-components";
import { Dimensions } from "react-native";
import styled from "styled-components/native";

const screenWidth = Dimensions.get("window").width;

export const Input = styled.TextInput<{ theme: DefaultTheme }>`
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.input};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text};
  border: 1px solid #e0e7ef;
  border-radius: 6px;
  padding: 8px;
  margin-top: 4px;
  margin-bottom: 8px;
  font-size: ${({ fontSize }: { fontSize?: number }) => fontSize || 16}px;
  width: 100%;
  placeholdertextcolor: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.mutedText};
`;

export const BottomBar = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.input};
  padding: 12px 0;
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
  height: 48px;
  border-radius: 12px;
  margin: 0px 12px 0px 12px;
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
  font-size: ${({ fontSize }: { fontSize?: number }) => fontSize || 16}px;
  color: ${({ active, theme }: { active?: boolean; theme: DefaultTheme }) =>
    active ? theme.colors.input : theme.colors.text};
  font-weight: ${({ active }: { active?: boolean }) =>
    active ? "bold" : "normal"};
`;

export const Divider = styled.View`
  width: 2px;
  height: 48px;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.divider};
`;

export const Container = styled.View<{ theme: DefaultTheme }>`
  flex: 1;
  padding: 16px;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background};
`;

export const ItemBox = styled.View<{ theme: DefaultTheme }>`
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.secondary};
  border-radius: 10px;
  padding: 8px;
  margin-bottom: 8px;
  width: 100%;
  align-self: stretch;
`;

export const Label = styled.Text<{
  theme: DefaultTheme;
  fontSize?: number;
}>`
  font-size: ${({ fontSize }: { fontSize?: number }) => fontSize || 46}px;
  margin-right: 16px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text};
`;

export const ItemLabel = styled.Text<{
  theme: DefaultTheme;
  fontSize?: number;
}>`
  font-size: ${({ fontSize }: { fontSize?: number }) => fontSize || 20}px;
  font-weight: 500;
  margin-bottom: 8px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.lightText};
`;

export const ChipsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
`;

export const ChipButton = styled.TouchableOpacity<{ theme: DefaultTheme }>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.accent};
  border-radius: 16px;
  padding: 4px 10px 4px 8px;
  margin-right: 6px;
  margin-bottom: 6px;
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
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.darkText};
`;

export const TaskRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

export const TaskText = styled.Text<{ complete: boolean; theme: DefaultTheme }>`
  font-size: ${({ fontSize }: { fontSize?: number }) => fontSize || 28}px;
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
  font-size: ${({ fontSize }: { fontSize?: number }) => fontSize || 20}px;
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
