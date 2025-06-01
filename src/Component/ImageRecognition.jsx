import React, { useRef, useState, useEffect } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

const ImageRecognition = () => {
  const [image, setImage] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [model, setModel] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // Load the coco-ssd model on component mount
  useEffect(() => {
    async function loadModel() {
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
    }
    loadModel();
  }, []);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  // Run object detection when an image is loaded
  useEffect(() => {
    if (image && model) {
      const img = imageRef.current;
      img.onload = async () => {
        const preds = await model.detect(img);
        setPredictions(preds);
        drawBoundingBoxes(preds);
      };
    }
  }, [image, model]);

  // Draw bounding boxes on the canvas
  const drawBoundingBoxes = (predictions) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imageRef.current;

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    predictions.forEach((prediction) => {
      const [x, y, width, height] = prediction.bbox;
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      ctx.font = "18px Arial";
      ctx.fillStyle = "red";
      ctx.fillText(
        `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
        x,
        y > 10 ? y - 5 : y + 15
      );
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        AI-Powered Image Recognition
      </h1>
      <div className="mb-6">
        <label
          htmlFor="imageUpload"
          className="inline-block px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
        >
          Upload an Image
        </label>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
      {image && (
        <div className="relative mb-6">
          <img
            src={image}
            ref={imageRef}
            alt="Uploaded"
            className="max-w-full h-auto rounded-lg shadow-md"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0"
            style={{ pointerEvents: "none" }}
          />
        </div>
      )}
      {predictions.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Detected Objects
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            {predictions.map((pred, index) => (
              <li key={index} className="text-gray-700">
                <span className="font-medium">{pred.class}</span> - Confidence:{" "}
                {Math.round(pred.score * 100)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageRecognition;
