// import React from "react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import ImageRecognition from "./ImageRecognition";

// // Mock TensorFlow coco-ssd model
// jest.mock("@tensorflow-models/coco-ssd", () => ({
//   load: jest.fn().mockResolvedValue({
//     detect: jest.fn().mockResolvedValue([
//       {
//         class: "person",
//         score: 0.98,
//         bbox: [10, 20, 100, 200],
//       },
//     ]),
//   }),
// }));

// // Mock tfjs to avoid errors
// jest.mock("@tensorflow/tfjs", () => ({}));

// // Mock URL.createObjectURL
// global.URL.createObjectURL = jest.fn(() => "mock-url");

// describe("ImageRecognition Component", () => {
//   test("renders upload input", () => {
//     render(<ImageRecognition />);
//     expect(screen.getByLabelText(/Upload an Image/i)).toBeInTheDocument();
//   });

//   test("loads model on mount", async () => {
//     render(<ImageRecognition />);
//     await waitFor(() => {
//       expect(screen.getByText(/AI-Powered Image Recognition/i)).toBeInTheDocument();
//     });
//   });

//   test("displays image and predictions after upload", async () => {
//     render(<ImageRecognition />);

//     const file = new File(["(⌐□_□)"], "test-image.png", { type: "image/png" });

//     const input = screen.getByLabelText(/Upload an Image/i);
//     fireEvent.change(input, { target: { files: [file] } });

//     // Wait for predictions to appear
//     await waitFor(() =>
//       expect(screen.getByText(/Detected Objects/i)).toBeInTheDocument()
//     );

//     expect(screen.getByText(/person/i)).toBeInTheDocument();
//     expect(screen.getByText(/Confidence: 98%/i)).toBeInTheDocument();
//   });
// });