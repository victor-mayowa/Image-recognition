import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ImageRecognition from "../src/Component/ImageRecognition";

// Mock TensorFlow model
jest.mock("@tensorflow-models/coco-ssd", () => ({
  load: jest.fn().mockResolvedValue({
    detect: jest
      .fn()
      .mockResolvedValue([
        { class: "person", score: 0.96, bbox: [10, 20, 100, 200] },
      ]),
  }),
}));
jest.mock("@tensorflow/tfjs", () => ({}));

global.URL.createObjectURL = jest.fn(() => "mock-url");

describe("ImageRecognition - Image Processing & Predictions", () => {
  test("1. Handles no predictions gracefully", async () => {
    const coco = require("@tensorflow-models/coco-ssd");
    coco.load.mockResolvedValueOnce({
      detect: jest.fn().mockResolvedValue([]),
    });

    render(<ImageRecognition />);
    const input = screen.getByLabelText(/Upload an Image/i);
    const file = new File(["dummy"], "image.png", { type: "image/png" });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.queryByText(/Detected Objects/i)).not.toBeInTheDocument();
    });
  });

  test("2. Skips prediction if image is not uploaded", async () => {
    render(<ImageRecognition />);
    expect(screen.queryByText(/Detected Objects/i)).not.toBeInTheDocument();
  });

  test("3. renders the heading 'AI-Powered Image Recognition'", () => {
    render(<ImageRecognition />);
    const headingElement = screen.getByRole("heading", {
      name: /AI-Powered Image Recognition/i,
    });
    expect(headingElement).toBeInTheDocument();
  });
});
