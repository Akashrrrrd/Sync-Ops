import React, { useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify"; // Import DOMPurify for sanitizing HTML
import "./DataInsights.css";

const DataInsights = () => {
  const [dataFile, setDataFile] = useState(null);
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const REACT_APP_GEMINI_API_KEY = "AIzaSyBRlNfkdImoF0XMv-J5jKWcWCcpL6lKPVQ";

  // Allowed mime types for Gemini API
  const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "text/plain",
    "text/csv",
    "application/pdf",
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        setError(
          `Unsupported file type: ${file.type}. Please upload an image, PDF, or text file.`
        );
        return;
      }
      setDataFile(file);
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        setError(
          `Unsupported file type: ${file.type}. Please upload an image, PDF, or text file.`
        );
        return;
      }
      setDataFile(file);
      setError(null);
    }
  };

  const analyzeFileWithGemini = async () => {
    if (!dataFile) {
      setError("Please upload a file to analyze.");
      return;
    }

    if (!ALLOWED_MIME_TYPES.includes(dataFile.type)) {
      setError(
        `Unsupported file type: ${dataFile.type}. Please upload an image, PDF, or text file.`
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(dataFile);

      reader.onloadend = async () => {
        const base64Data = reader.result.split(",")[1];

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${REACT_APP_GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: "Provide a comprehensive and well-structured analysis of this file. Format the output using Markdown syntax for clarity and presentation.",
                    },
                    {
                      inlineData: {
                        mimeType: dataFile.type,
                        data: base64Data,
                      },
                    },
                  ],
                },
              ],
              generationConfig: {
                maxOutputTokens: 2048,
                temperature: 0.4,
                topP: 1,
                topK: 32,
              },
            }),
          }
        );

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error.message || "API request failed");
        }

        const geminiResponse = data.candidates[0].content.parts[0].text;

        // Parse the Markdown content
        const sanitizedHTML = DOMPurify.sanitize(marked(geminiResponse));
        setInsights({
          markdown: sanitizedHTML,
        });

        setIsLoading(false);
      };

      reader.onerror = (error) => {
        console.error("File reading error:", error);
        setError("Failed to read file. Please try again.");
        setIsLoading(false);
      };
    } catch (error) {
      console.error("Analysis error:", error);
      setError(`Failed to analyze file: ${error.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="data-data-insights">
      <div className="data-header">
        <h1>AI-Powered File Analysis</h1>
        <p>Upload images, PDFs, or text files for comprehensive AI analysis</p>
      </div>

      <div
        className="data-upload-area"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-upload").click()}
      >
        <svg
          className="data-upload-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p>
          {dataFile
            ? dataFile.name
            : "Drag and drop supported files here or click to browse"}
        </p>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileUpload}
          className="data-hidden"
          accept=".jpg,.jpeg,.png,.gif,.webp,.txt,.csv,.pdf"
        />
      </div>

      <button
        className={`data-generate-button ${isLoading ? "loading" : ""} ${
          !dataFile ? "disabled" : ""
        }`}
        onClick={analyzeFileWithGemini}
        disabled={isLoading || !dataFile}
      >
        {isLoading ? "Analyzing File..." : "Analyze File"}
      </button>

      {error && <div className="data-error">{error}</div>}

      {insights && (
        <div className="data-insights-container">
          <div className="data-markdown-output">
            <h2>Analysis Result</h2>
            <div dangerouslySetInnerHTML={{ __html: insights.markdown }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataInsights;
