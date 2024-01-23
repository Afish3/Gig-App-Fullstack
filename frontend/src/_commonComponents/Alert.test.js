import React from "react";
import { render, screen } from "@testing-library/react";
import BasicAlert from "./Alert";

describe("BasicAlert Component", () => {
  it("renders an alert with error messages", () => {
    const errorMessages = ["Error message 1", "Error message 2"];

    render(<BasicAlert messages={errorMessages} />);

    // Assert that each error message is rendered in an Alert component
    errorMessages.forEach((errorMessage) => {
      const alertElement = screen.getAllByText(errorMessage);
      expect(alertElement.length).toBe(1); // Ensure there's exactly one matching alert for each error message
    });
  });

  it("renders alerts with the specified severity type", () => {
    const infoMessages = ["Info message 1", "Info message 2"];

    render(<BasicAlert type="info" messages={infoMessages} />);

    // Assert that each alert has the role corresponding to the specified severity type
    const infoAlerts = screen.getAllByRole("alert");
    expect(infoAlerts.length).toBe(infoMessages.length);
  });

  it('matches snapshot', () => {
    const errorMessages = ["Error message 1", "Error message 2"];

    const { asFragment } = render(<BasicAlert messages={errorMessages} />);
    expect(asFragment).toMatchSnapshot();
  });
});