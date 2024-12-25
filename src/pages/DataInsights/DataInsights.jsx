import React, { useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import "./DataInsights.css";

const DataInsights = () => {
  const [dataFile, setDataFile] = useState(null);
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = "AIzaSyAM0_OZ2s6FBeazWBsn3n4y5I1_SX03HmU"; 

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

    if (!API_KEY) {
      setError("Gemini API key is missing. Please provide a valid key.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(dataFile);
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
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
                    text: "Provide a comprehensive and detailed analysis of this file. Use clear, structured Markdown formatting.",
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
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${errorText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || "API request failed");
      }

      const geminiResponse = data.candidates[0].content.parts[0].text;

      const sanitizedHTML = DOMPurify.sanitize(marked(geminiResponse));
      setInsights({ markdown: sanitizedHTML });
      setIsLoading(false);
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
