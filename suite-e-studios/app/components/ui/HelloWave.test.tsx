/** @format */

import { HelloWave } from "./HelloWave";
import React from "react";
import { render } from "@testing-library/react-native";

describe("HelloWave", () => {
  it("renders without crashing", () => {
    const { getByText } = render(<HelloWave />);
    // The component renders an emoji, so check for that
    expect(getByText("👋")).toBeTruthy();
  });
});
