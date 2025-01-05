import React, { useState, useCallback, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import DOMPurify from "dompurify";
import { marked } from "marked";
import "./ContextualLearning.css";

const API_KEY = "AIzaSyCKhpM1JaW7YZlOyauvRLkBHobJqCUouwU";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Configure marked options for better parsing
marked.setOptions({
  gfm: true,
  breaks: true,
  smartLists: true,
  headerIds: false,
  mangle: false,
});

const AIExplorer = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [cachedResults, setCachedResults] = useState({});

  useEffect(() => {
    const cached = localStorage.getItem("aiExplorerCache");
    if (cached) {
      setCachedResults(JSON.parse(cached));
    }
  }, []);

  const debouncedSetQuery = useCallback((value) => {
    setQuery(value);
    setError(null);
  }, []);

  const handleInputChange = (e) => {
    debouncedSetQuery(e.target.value);
  };

  const generatePrompt = useCallback((topic) => {
    return `Analyze ${topic} and provide 3 key insights. For each insight include:
    1. A concise title (max 8 words)
    2. A detailed explanation (2-3 sentences)
    3. Focus on current trends and future implications
    
    Format your response clearly without using markdown symbols like * or #. Avoid using bullet points.`;
  }, []);

  const sanitizeAndParseMarkdown = (text) => {
    // Remove markdown symbols while preserving readability
    const cleanedText = text
      .replace(/\*\*/g, "") // Remove bold markers
      .replace(/\*/g, "") // Remove italic markers
      .replace(/^#+\s*/gm, "") // Remove header markers
      .trim();

    // Convert to HTML and sanitize
    const rawHTML = marked(cleanedText);
    return DOMPurify.sanitize(rawHTML);
  };

  const fetchResults = async () => {
    if (!query.trim()) {
      setError("Please enter a topic to explore");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (cachedResults[query.toLowerCase()]) {
        setResults(cachedResults[query.toLowerCase()]);
        setLoading(false);
        return;
      }

      const prompt = generatePrompt(query);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const parsedResults = text
        .split("\n")
        .filter((line) => line.trim() !== "")
        .reduce((acc, line) => {
          // Look for lines that seem to be titles (typically start with a capital letter)
          if (/^[A-Z]/.test(line.trim())) {
            acc.push({
              title: line.trim(),
              summary: "",
              timestamp: new Date().toISOString(),
            });
          } else if (acc.length > 0) {
            // Add to the most recent result's summary
            acc[acc.length - 1].summary +=
              (acc[acc.length - 1].summary ? " " : "") + line.trim();
          }
          return acc;
        }, [])
        .map((result) => ({
          ...result,
          title: sanitizeAndParseMarkdown(result.title),
          summary: sanitizeAndParseMarkdown(result.summary),
        }))
        .filter((result) => result.title && result.summary);

      const updatedCache = {
        ...cachedResults,
        [query.toLowerCase()]: parsedResults,
      };
      setCachedResults(updatedCache);
      localStorage.setItem("aiExplorerCache", JSON.stringify(updatedCache));

      setResults(parsedResults);
      setSearchHistory((prev) => [...new Set([query, ...prev])].slice(0, 5));
    } catch (err) {
      console.error("AI API Error:", err);
      setError("Failed to fetch AI insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResults();
  };

  return (
    <div className="learn-explorer-container">
      <div className="learn-explorer-content">
        <header className="learn-explorer-header">
          <div className="learn-logo-container">
            <div className="learn-neural-network">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="learn-neural-layer">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="learn-neuron">
                      <div className="learn-pulse"></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <h1>Neural Insight Explorer</h1>
          <p className="learn-subtitle">
            Advanced AI-Powered Knowledge Discovery
          </p>
        </header>

        <section className="learn-search-section">
          <form onSubmit={handleSearch} className="learn-search-form">
            <div className="learn-search-input-container">
              <input
                type="text"
                className="learn-search-input"
                placeholder="Explore any topic with AI..."
                value={query}
                onChange={handleInputChange}
                autoComplete="off"
              />
              <button
                type="submit"
                className="learn-search-button"
                disabled={loading}
              >
                {loading ? (
                  <div className="learn-loading-spinner" />
                ) : (
                  <svg className="learn-search-icon" viewBox="0 0 24 24">
                    <path d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.39zM11 18a7 7 0 1 1 7-7 7 7 0 0 1-7 7z" />
                  </svg>
                )}
              </button>
            </div>
          </form>
          {error && <div className="learn-error-message">{error}</div>}

          {searchHistory.length > 0 && (
            <div className="learn-search-history">
              <p>Recent searches:</p>
              <div className="learn-history-tags">
                {searchHistory.map((item, index) => (
                  <button
                    key={index}
                    className="learn-history-tag"
                    onClick={() => {
                      setQuery(item);
                      fetchResults();
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="learn-results-section">
          {loading && (
            <div className="learn-loading-container">
              <div className="learn-processing-animation">
                <div className="learn-processing-circle"></div>
                <div className="learn-processing-circle"></div>
                <div className="learn-processing-circle"></div>
              </div>
              <p>Neural networks processing your query...</p>
            </div>
          )}

          {!loading && results.length === 0 && !error && (
            <div className="learn-empty-state">
              <div className="learn-empty-illustration">
                <div className="learn-brain-wave"></div>
                <div className="learn-brain-wave"></div>
                <div className="learn-brain-wave"></div>
              </div>
              <p>Enter a topic to discover AI-powered insights</p>
            </div>
          )}

          <div className="learn-results-grid">
            {!loading &&
              results.map((result, index) => (
                <div
                  key={index}
                  className="learn-result-card"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className="learn-card-header">
                    <div className="learn-insight-number">{index + 1}</div>
                    <h2 dangerouslySetInnerHTML={{ __html: result.title }}></h2>
                  </div>
                  <div className="learn-card-content">
                    <div
                      dangerouslySetInnerHTML={{ __html: result.summary }}
                    ></div>
                  </div>
                  <div className="learn-card-footer">
                    <div className="learn-insight-tag">AI Analysis</div>
                    {result.timestamp && (
                      <div className="learn-timestamp">
                        {new Date(result.timestamp).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AIExplorer;
