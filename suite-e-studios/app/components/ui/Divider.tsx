/** @format */

import { ViewProps, useWindowDimensions } from "react-native";

import { DefaultTheme } from "styled-components";
import React from "react";
import styled from "styled-components/native";

interface DividerProps extends ViewProps {
  orientation?: "horizontal" | "vertical";
  color?: string;
  thickness?: number;
  length?: number | string;
  marginVertical?: number;
  marginHorizontal?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  paddingVertical?: number;
  paddingHorizontal?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
}

interface StyledDividerProps {
  orientation: "horizontal" | "vertical";
  color: string;
  thickness: number;
  length: number | string;
  theme: DefaultTheme;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
}

const StyledDivider = styled.View<StyledDividerProps>`
  background-color: ${({ color, theme }: StyledDividerProps) =>
    color || theme.colors.divider};
  align-self: center;
  margin-top: ${({ marginTop }: StyledDividerProps) => marginTop}px;
  margin-bottom: ${({ marginBottom }: StyledDividerProps) => marginBottom}px;
  margin-left: ${({ marginLeft }: StyledDividerProps) => marginLeft}px;
  margin-right: ${({ marginRight }: StyledDividerProps) => marginRight}px;
  padding-top: ${({ paddingTop }: StyledDividerProps) => paddingTop}px;
  padding-bottom: ${({ paddingBottom }: StyledDividerProps) => paddingBottom}px;
  padding-left: ${({ paddingLeft }: StyledDividerProps) => paddingLeft}px;
  padding-right: ${({ paddingRight }: StyledDividerProps) => paddingRight}px;
  ${({ orientation, thickness, length }: StyledDividerProps) =>
    orientation === "horizontal"
      ? `
    height: ${thickness}px;
    width: ${typeof length === "number" ? `${length}px` : length};
  `
      : `
    width: ${thickness}px;
    height: ${typeof length === "number" ? `${length}px` : length};
  `}
`;

export function Divider({
  orientation = "horizontal",
  color,
  thickness = 1,
  length = "80%",
  marginVertical = 8,
  marginHorizontal = 0,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  paddingVertical = 0,
  paddingHorizontal = 0,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  style,
  ...props
}: DividerProps) {
  const { width, height } = useWindowDimensions();

  // If length is a number, calculate it as a percentage of the screen dimension
  const calculatedLength =
    typeof length === "number"
      ? (orientation === "horizontal" ? width : height) * (length / 100)
      : length;

  // Calculate final margin values, prioritizing individual values over vertical/horizontal
  const finalMarginTop = marginTop ?? marginVertical;
  const finalMarginBottom = marginBottom ?? marginVertical;
  const finalMarginLeft = marginLeft ?? marginHorizontal;
  const finalMarginRight = marginRight ?? marginHorizontal;

  // Calculate final padding values, prioritizing individual values over vertical/horizontal
  const finalPaddingTop = paddingTop ?? paddingVertical;
  const finalPaddingBottom = paddingBottom ?? paddingVertical;
  const finalPaddingLeft = paddingLeft ?? paddingHorizontal;
  const finalPaddingRight = paddingRight ?? paddingHorizontal;

  return (
    <StyledDivider
      orientation={orientation}
      color={color}
      thickness={thickness}
      length={calculatedLength}
      marginTop={finalMarginTop}
      marginBottom={finalMarginBottom}
      marginLeft={finalMarginLeft}
      marginRight={finalMarginRight}
      paddingTop={finalPaddingTop}
      paddingBottom={finalPaddingBottom}
      paddingLeft={finalPaddingLeft}
      paddingRight={finalPaddingRight}
      style={style}
      {...props}
    />
  );
}
