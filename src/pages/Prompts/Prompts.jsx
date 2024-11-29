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
  const API_KEY = "AIzaSyBRlNfkdImoF0XMv-J5jKWcWCcpL6lKPVQ";
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
    Professional Prompt Refinement:
    - Subject Focus: "${userInput}"
    - Develop a sophisticated, multi-dimensional prompt that encourages exploration of innovative ideas.
    - Integrate diverse strategic perspectives to ensure depth and originality.
    - Emphasize clarity, relevance, and actionable insights to drive meaningful outcomes.
    - Ensure the prompt inspires creative and forward-thinking responses.
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
    <div className="dypr-prompt-forge-container">
      <ToastContainer />
      <div className="dypr-neural-overlay"></div>
      <div className="dypr-content-wrapper">
        <h1 className="dypr-prompt-forge-title">
          <span className="dypr-ai-gradient-text">Prompt Forge AI</span>
        </h1>
        <p className="dypr-prompt-subtitle">
          Unleash Boundless Creativity Through Intelligent Prompting
        </p>

        <div className="dypr-input-zone">
          <div className="dypr-input-wrapper">
            <input
              type="text"
              placeholder="Spark an AI-Driven Exploration..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="dypr-neural-input"
              disabled={loading}
            />
            <div className="dypr-input-icon">🧠</div>
          </div>

          <div className="dypr-action-cluster">
            <button
              onClick={generatePrompt}
              className="dypr-forge-btn"
              disabled={loading}
            >
              {loading ? "Forging Prompt..." : "Spark Creativity"}
            </button>
            <button onClick={resetFields} className="dypr-reset-btn">
              🔄 Reset
            </button>
          </div>
        </div>

        {generatedPrompt && (
          <div className="dypr-prompt-emergence">
            <div className="dypr-emergence-header">
              <h2 className="dypr-emergence-title">
                Generated Prompt Catalyst
              </h2>
              <button
                onClick={() => copyToClipboard(generatedPrompt)}
                className="dypr-copy-btn"
              >
                📋 Copy Prompt
              </button>
            </div>
            <div
              className="dypr-prompt-display"
              dangerouslySetInnerHTML={{ __html: generatedPrompt }}
            />
          </div>
        )}

        {promptHistory.length > 0 && (
          <div className="dypr-creative-memory">
            <div className="dypr-memory-header">
              <h3>Prompt Exploration Archive</h3>
              <button onClick={clearHistory} className="dypr-clear-history-btn">
                🗑️ Clear History
              </button>
            </div>
            <div className="dypr-history-scroll">
              {promptHistory.map((item) => (
                <div key={item.id} className="dypr-memory-trace">
                  <span className="dypr-trace-topic">{item.topic}</span>
                  <div className="dypr-trace-actions">
                    <button
                      onClick={() => copyToClipboard(item.prompt)}
                      className="dypr-trace-copy"
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
