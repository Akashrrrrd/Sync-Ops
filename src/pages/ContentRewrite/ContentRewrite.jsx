import React, { useState, useEffect } from "react";
import "./ContentRewrite.css";

const ContentRewrite = () => {
  const [inputContent, setInputContent] = useState("");
  const [rewrittenContent, setRewrittenContent] = useState("");
  const [tone, setTone] = useState("neutral");
  const [loading, setLoading] = useState(false);
  const [wordLimit, setWordLimit] = useState("");
  const [keywords, setKeywords] = useState("");
  const [language, setLanguage] = useState("english");
  const [complexity, setComplexity] = useState("medium");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [wordCount, setWordCount] = useState(0);
  const [saveHistory, setSaveHistory] = useState([]);
  const [showAllHistory, setShowAllHistory] = useState(false);

  const GEMINI_API_KEY = "AIzaSyBRlNfkdImoF0XMv-J5jKWcWCcpL6lKPVQ";

  const tones = [
    "Neutral",
    "Formal",
    "Casual",
    "Persuasive",
    "Creative",
    "Professional",
    "Friendly",
    "Academic",
  ];
  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
  ];
  const complexityLevels = [
    "Simple",
    "Medium",
    "Advanced",
    "Technical",
    "Academic",
  ];

  useEffect(() => {
    const words = inputContent
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);
  }, [inputContent]);

  const generateAiSuggestions = () => {
    const suggestions = [
      "Consider using more active voice",
      "Add statistical data for credibility",
      "Include industry-specific terminology",
      "Strengthen your call-to-action",
      "Add relevant examples",
    ];
    setAiSuggestions(suggestions);
  };

  const constructPrompt = () => {
    let prompt = `Rewrite the following content in a ${tone} tone with ${complexity} complexity level in ${language} language.`;

    if (wordLimit) {
      prompt += ` The response should be approximately ${wordLimit} words.`;
    }

    if (keywords) {
      prompt += ` Please incorporate these keywords naturally: ${keywords}.`;
    }

    prompt += `\n\nOriginal content:\n${inputContent}`;
    return prompt;
  };

  const handleRewrite = async () => {
    if (!inputContent.trim()) {
      showNotification("Please provide content to rewrite.");
      return;
    }

    setLoading(true);
    try {
      const prompt = constructPrompt();
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
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
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      let rewrittenText = "";

      if (data.candidates && data.candidates[0].content.parts[0].text) {
        rewrittenText = data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Invalid response from API");
      }

      setRewrittenContent(rewrittenText);
      generateAiSuggestions();

      setSaveHistory([
        ...saveHistory,
        {
          original: inputContent,
          rewritten: rewrittenText,
          timestamp: new Date().toLocaleString(),
        },
      ]);
    } catch (error) {
      console.error("Error rewriting content:", error);
      showNotification("Something went wrong! Please try again.", "error");
    }
    setLoading(false);
  };

  const showNotification = (message, type = "info") => {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("fade-out");
      setTimeout(() => document.body.removeChild(notification), 500);
    }, 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rewrittenContent);
    showNotification("Content copied to clipboard!");
  };

  const handleClearHistory = () => {
    setSaveHistory([]);
    showNotification("History cleared successfully!");
  };

  const renderHistorySection = () => {
    if (saveHistory.length === 0) return null;

    const displayedHistory = showAllHistory
      ? saveHistory
      : saveHistory.slice(-3);

    return (
      <div className="history-section">
        <div className="history-header">
          <h3>Recent Rewrites</h3>
          <div className="history-controls">
            <button
              className="history-control-btn"
              onClick={() => setShowAllHistory(!showAllHistory)}
            >
              {showAllHistory ? "Show Less" : "Show More"}
            </button>
            <button
              className="history-control-btn clear-btn"
              onClick={handleClearHistory}
            >
              Clear History
            </button>
          </div>
        </div>
        <div className="history-list">
          {displayedHistory.map((item, index) => (
            <div key={index} className="history-item">
              <div className="history-timestamp">{item.timestamp}</div>
              <div className="history-text">
                <div className="history-original">
                  {item.original.substring(0, 100)}...
                </div>
                <div className="history-arrow">→</div>
                <div className="history-rewritten">
                  {item.rewritten.substring(0, 100)}...
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="rewrite-container">
      <div className="rewrite-header">
        <h1 className="rewrite-title">
          <span className="rewrite-title-gradient">Advanced AI</span> Content
          Rewriter
        </h1>
        <p className="rewrite-subtitle">
          Transform your content with advanced AI-powered writing assistance
        </p>
      </div>

      <div className="rewrite-main">
        <div className="input-section">
          <div className="content-input">
            <textarea
              className="rewrite-input"
              placeholder="Enter your content here..."
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
            ></textarea>
            <div className="word-counter">Words: {wordCount}</div>
          </div>

          <div className="controls-grid">
            <div className="control-group">
              <label>Tone:</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)}>
                {tones.map((t) => (
                  <option key={t.toLowerCase()} value={t.toLowerCase()}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label>Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang.toLowerCase()} value={lang.toLowerCase()}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label>Complexity:</label>
              <select
                value={complexity}
                onChange={(e) => setComplexity(e.target.value)}
              >
                {complexityLevels.map((level) => (
                  <option key={level.toLowerCase()} value={level.toLowerCase()}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label>Word Limit:</label>
              <input
                type="number"
                value={wordLimit}
                onChange={(e) => setWordLimit(e.target.value)}
                placeholder="Optional"
              />
            </div>

            <div className="control-group">
              <label>Keywords:</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Separate with commas"
              />
            </div>
          </div>

          <button
            className={`rewrite-button ${loading ? "loading" : ""}`}
            onClick={handleRewrite}
            disabled={loading}
          >
            {loading ? "Processing..." : "Rewrite Content"}
          </button>
        </div>

        {rewrittenContent && (
          <div className="output-section">
            <div className="result-header">
              <h2>Enhanced Content</h2>
              <button className="copy-button" onClick={handleCopy}>
                Copy to Clipboard
              </button>
            </div>
            <textarea
              className="rewrite-output"
              readOnly
              value={rewrittenContent}
            ></textarea>

            <div className="ai-suggestions">
              <h3>AI Writing Suggestions</h3>
              <ul>
                {aiSuggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {renderHistorySection()}
    </div>
  );
};

export default ContentRewrite;
