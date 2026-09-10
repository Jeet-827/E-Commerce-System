import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import Footer from "../Footer.jsx";

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Footer Component Unit Tests", () => {
  it("renders store value proposition badges", () => {
    renderWithRouter(<Footer />);

    expect(screen.getByText("Fast Shipping")).toBeInTheDocument();
    expect(screen.getByText("100% Genuine")).toBeInTheDocument();
    expect(screen.getByText("Easy Returns")).toBeInTheDocument();
    expect(screen.getByText("24/7 Support")).toBeInTheDocument();
  });

  it("renders Brand info and copyright text", () => {
    renderWithRouter(<Footer />);

    expect(screen.getByText("E-System")).toBeInTheDocument();
    expect(screen.getByText(/E-System Store. All rights reserved/i)).toBeInTheDocument();
  });

  it("handles newsletter subscription correctly", async () => {
    renderWithRouter(<Footer />);

    const emailInput = screen.getByPlaceholderText(/enter your email address/i);
    const subscribeButton = screen.getByRole("button", { name: /subscribe/i });

    expect(emailInput).toBeInTheDocument();
    expect(subscribeButton).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: "testuser@example.com" } });
    fireEvent.click(subscribeButton);

    await waitFor(() => {
      expect(screen.getByText(/thank you for subscribing/i)).toBeInTheDocument();
    });
  });
});
