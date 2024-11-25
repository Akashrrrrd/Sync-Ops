import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Prompts.css";

const DynamicPrompts = () => {
  // State Variables
  const [userInput, setUserInput] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [promptHistory, setPromptHistory] = useState([]);
  const [error, setError] = useState(null);

  // API Configuration
  const API_KEY = "AIzaSyBRlNfkdImoF0XMv-J5jKWcWCcpL6lKPVQ"; // Replace with secure key management
  const genAI = new GoogleGenerativeAI(API_KEY);

  // Handler to Generate Prompts
  const generatePrompt = async () => {
    if (!userInput.trim()) {
      showToast("Enter a topic to spark AI creativity", "error");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const promptTemplate = `
        Advanced AI Prompt Generation:
        - Transform the topic: "${userInput}"
        - Generate a multi-dimensional, thought-provoking prompt
        - Include strategic angles, innovative perspectives
        - Craft a prompt that challenges conventional thinking
        - Ensure actionable and inspiring content
      `;

      const result = await model.generateContent(promptTemplate);
      const response = await result.response;
      const text = response.text();

      // Sanitize and Markdown the generated text
      const sanitizedText = DOMPurify.sanitize(text);
      const markedText = marked(sanitizedText);

      // Update state
      setGeneratedPrompt(markedText);
      setPromptHistory((prev) => [
        { id: Date.now(), topic: userInput, prompt: markedText },
        ...prev.slice(0, 9),
      ]);

      showToast("Prompt Generated Successfully!", "success");
    } catch (err) {
      console.error("Prompt Generation Error:", err);
      showToast("AI Creativity Unavailable. Try Again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Utility Functions
  const resetFields = () => {
    setUserInput("");
    setGeneratedPrompt("");
    setError(null);
    showToast("Fields Reset", "info");
  };

  const clearHistory = () => {
    setPromptHistory([]);
    showToast("Prompt History Cleared", "info");
  };

  const copyToClipboard = (text) => {
    const plainText = text.replace(/<[^>]*>/g, "");
    navigator.clipboard.writeText(plainText);
    showToast("Prompt Copied! 🚀", "success");
  };

  const showToast = (message, type) => {
    const options = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
    };
    switch (type) {
      case "success":
        toast.success(message, options);
        break;
      case "error":
        toast.error(message, options);
        break;
      case "info":
        toast.info(message, options);
        break;
      default:
        toast(message, options);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") generatePrompt();
  };

  // Render
  return (
    <div className="dp-prompt-forge-container">
      <ToastContainer />
      <div className="dp-neural-overlay"></div>
      <div className="dp-content-wrapper">
        <h1 className="dp-prompt-forge-title">
          <span className="dp-ai-gradient-text">Prompt Forge AI</span>
        </h1>
        <p className="dp-prompt-subtitle">
          Unleash Boundless Creativity Through Intelligent Prompting
        </p>

        <div className="dp-input-zone">
          <div className="dp-input-wrapper">
            <input
              type="text"
              placeholder="Spark an AI-Driven Exploration..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="dp-neural-input"
              disabled={loading}
            />
            <div className="dp-input-icon">🧠</div>
          </div>

          <div className="dp-action-cluster">
            <button
              onClick={generatePrompt}
              className="dp-forge-btn"
              disabled={loading}
            >
              {loading ? "Forging Prompt..." : "Spark Creativity"}
            </button>
            <button onClick={resetFields} className="dp-reset-btn">
              🔄 Reset
            </button>
          </div>
        </div>

        {generatedPrompt && (
          <div className="dp-prompt-emergence">
            <div className="dp-emergence-header">
              <h2 className="dp-emergence-title">Generated Prompt Catalyst</h2>
              <button
                onClick={() => copyToClipboard(generatedPrompt)}
                className="dp-copy-btn"
              >
                📋 Copy Prompt
              </button>
            </div>
            <div
              className="dp-prompt-display"
              dangerouslySetInnerHTML={{ __html: generatedPrompt }}
            />
          </div>
        )}

        {promptHistory.length > 0 && (
          <div className="dp-creative-memory">
            <div className="dp-memory-header">
              <h3>Prompt Exploration Archive</h3>
              <button onClick={clearHistory} className="dp-clear-history-btn">
                🗑️ Clear History
              </button>
            </div>
            <div className="dp-history-scroll">
              {promptHistory.map((item) => (
                <div key={item.id} className="dp-memory-trace">
                  <span className="dp-trace-topic">{item.topic}</span>
                  <div className="dp-trace-actions">
                    <button
                      onClick={() => copyToClipboard(item.prompt)}
                      className="dp-trace-copy"
                    >
                      📋
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicPrompts;
