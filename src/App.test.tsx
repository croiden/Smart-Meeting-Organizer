import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders meeting react app", () => {
  render(<App />);
  expect(screen.getByText(/Buildings/i)).toBeInTheDocument();
  expect(screen.getByText(/Rooms/i)).toBeInTheDocument();
  expect(screen.getByText(/Meetings/i)).toBeInTheDocument();
});

test("renders Add a Meeting button", () => {
  render(<App />);
  expect(screen.getByText(/Add a Meeting/i)).toBeInTheDocument();
});
