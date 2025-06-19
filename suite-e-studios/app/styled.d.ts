/** @format */

import "styled-components";

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
