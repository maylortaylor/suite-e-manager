/** @format */

import "styled-components";
import "styled-components/native";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      background: string;
      primary: string;
      secondary: string;
      accent: string;
      highlight: string;
      lightText: string;
      text: string;
      darkText: string;
      mutedText: string;
      input: string;
      divider: string;
    };
  }
}

declare module "styled-components/native" {
  export interface DefaultTheme {
    colors: {
      text: string;
      background: string;
      primary: string;
      secondary: string;
      accent: string;
      highlight: string;
      input: string;
      divider: string;
      lightText: string;
      mutedText: string;
    };
    uiSize: "comfy" | "large";
    global: {
      fontSize: {
        xs: number;
        sm: number;
        base: number;
        md: number;
        lg: number;
        xl: number;
        "2xl": number;
        "3xl": number;
        "4xl": number;
      };
      lineHeight: {
        tight: number;
        normal: number;
        relaxed: number;
      };
      spacing: {
        xs: number;
        sm: number;
        base: number;
        md: number;
        lg: number;
        xl: number;
        "2xl": number;
      };
      borderRadius: {
        sm: number;
        base: number;
        md: number;
        lg: number;
        xl: number;
        full: number;
      };
    };
  }
}
