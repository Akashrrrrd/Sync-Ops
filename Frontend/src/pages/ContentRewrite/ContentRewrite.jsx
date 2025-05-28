"use client"

import { useState, useEffect } from "react"
import DOMPurify from "dompurify"
import { marked } from "marked"
import "./ContentRewrite.css"

const ContentRewrite = () => {
  // Load initial state from localStorage or use default values
  const [inputContent, setInputContent] = useState(() => localStorage.getItem("lastInputContent") || "")
  const [rewrittenContent, setRewrittenContent] = useState(() => localStorage.getItem("lastRewrittenContent") || "")
  const [rewrittenMarkdown, setRewrittenMarkdown] = useState(() => localStorage.getItem("lastRewrittenMarkdown") || "")
  const [tone, setTone] = useState(() => localStorage.getItem("lastTone") || "neutral")
  const [loading, setLoading] = useState(false)
  const [wordLimit, setWordLimit] = useState(() => localStorage.getItem("lastWordLimit") || "")
  const [keywords, setKeywords] = useState(() => localStorage.getItem("lastKeywords") || "")
  const [language, setLanguage] = useState(() => localStorage.getItem("lastLanguage") || "english")
  const [complexity, setComplexity] = useState(() => localStorage.getItem("lastComplexity") || "medium")
  const [aiSuggestions, setAiSuggestions] = useState([])
  const [wordCount, setWordCount] = useState(0)

  // Load history from localStorage
  const [saveHistory, setSaveHistory] = useState(() => {
    const savedHistory = localStorage.getItem("rewriteHistory")
    return savedHistory ? JSON.parse(savedHistory) : []
  })

  const [showAllHistory, setShowAllHistory] = useState(false)
  const [displayMode, setDisplayMode] = useState(() => localStorage.getItem("lastDisplayMode") || "text")

  const PERPLEXITY_API_KEY = "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"

  const tones = ["Neutral", "Formal", "Casual", "Persuasive", "Creative", "Professional", "Friendly", "Academic"]
  const languages = ["English", "Spanish", "French", "German", "Italian", "Portuguese"]
  const complexityLevels = ["Simple", "Medium", "Advanced", "Technical", "Academic"]

  // Update localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("lastInputContent", inputContent)
  }, [inputContent])

  useEffect(() => {
    localStorage.setItem("lastRewrittenContent", rewrittenContent)
  }, [rewrittenContent])

  useEffect(() => {
    localStorage.setItem("lastRewrittenMarkdown", rewrittenMarkdown)
  }, [rewrittenMarkdown])

  useEffect(() => {
    localStorage.setItem("lastTone", tone)
  }, [tone])

  useEffect(() => {
    localStorage.setItem("lastWordLimit", wordLimit)
  }, [wordLimit])

  useEffect(() => {
    localStorage.setItem("lastKeywords", keywords)
  }, [keywords])

  useEffect(() => {
    localStorage.setItem("lastLanguage", language)
  }, [language])

  useEffect(() => {
    localStorage.setItem("lastComplexity", complexity)
  }, [complexity])

  useEffect(() => {
    localStorage.setItem("lastDisplayMode", displayMode)
  }, [displayMode])

  // Update localStorage when history changes
  useEffect(() => {
    localStorage.setItem("rewriteHistory", JSON.stringify(saveHistory))
  }, [saveHistory])

  // Word count calculation
  useEffect(() => {
    const words = inputContent
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)
    setWordCount(words.length)
  }, [inputContent])

  const generateAiSuggestions = () => {
    const suggestions = [
      "Consider using more active voice",
      "Add statistical data for credibility",
      "Include industry-specific terminology",
      "Strengthen your call-to-action",
      "Add relevant examples",
    ]
    setAiSuggestions(suggestions)
  }

  const constructPrompt = () => {
    let prompt = `Rewrite the following content in a ${tone} tone with ${complexity} complexity level in ${language} language.`

    if (wordLimit) {
      prompt += ` The response should be approximately ${wordLimit} words.`
    }

    if (keywords) {
      prompt += ` Please incorporate these keywords naturally: ${keywords}.`
    }

    prompt += `\n\nOriginal content:\n${inputContent}`
    return prompt
  }

  const handleRewrite = async () => {
    if (!inputContent.trim()) {
      showNotification("Please provide content to rewrite.")
      return
    }

    setLoading(true)
    try {
      const prompt = constructPrompt()
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        },
        body: JSON.stringify({
          model: "sonar",
          messages: [
            {
              role: "system",
              content:
                "You are an expert content writer that specializes in rewriting content while maintaining the original meaning but improving the style, clarity, and engagement.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      })

      const data = await response.json()
      let rewrittenText = ""

      if (data.choices && data.choices[0].message.content) {
        rewrittenText = data.choices[0].message.content
      } else {
        throw new Error("Invalid response from API")
      }

      const sanitizedText = DOMPurify.sanitize(rewrittenText)
      const markdownText = marked(sanitizedText)

      setRewrittenContent(rewrittenText)
      setRewrittenMarkdown(markdownText)
      generateAiSuggestions()

      // Add to history
      const newHistoryItem = {
        original: inputContent,
        rewritten: rewrittenText,
        timestamp: new Date().toLocaleString(),
        tone,
        language,
        complexity,
        wordLimit,
        keywords,
      }

      const updatedHistory = [...saveHistory, newHistoryItem]

      // Limit history to last 20 items
      const limitedHistory = updatedHistory.slice(-20)

      setSaveHistory(limitedHistory)
    } catch (error) {
      console.error("Error rewriting content:", error)
      showNotification("Something went wrong! Please try again.", "error")
    }
    setLoading(false)
  }

  const showNotification = (message, type = "info") => {
    const notification = document.createElement("div")
    notification.className = `core-notification core-notification-${type}`
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add("core-fade-out")
      setTimeout(() => document.body.removeChild(notification), 500)
    }, 3000)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(rewrittenContent)
    showNotification("Content copied to clipboard!")
  }

  const handleClearHistory = () => {
    setSaveHistory([])
    localStorage.removeItem("rewriteHistory")
    showNotification("History cleared successfully!")
  }

  const renderHistorySection = () => {
    if (saveHistory.length === 0) return null

    const displayedHistory = showAllHistory
      ? saveHistory
          .slice()
          .reverse() // Show most recent first
      : saveHistory.slice(-3).reverse()

    return (
      <div className="core-history-section">
        <div className="core-history-header">
          <h3>Recent Rewrites</h3>
          <div className="core-history-controls">
            <button className="core-history-control-btn" onClick={() => setShowAllHistory(!showAllHistory)}>
              {showAllHistory ? "Show Less" : "Show More"}
            </button>
            <button className="core-history-control-btn core-clear-btn" onClick={handleClearHistory}>
              Clear History
            </button>
          </div>
        </div>
        <div className="core-history-list">
          {displayedHistory.map((item, index) => (
            <div key={index} className="core-history-item">
              <div className="core-history-timestamp">{item.timestamp}</div>
              <div className="core-history-text">
                <div className="core-history-original">{item.original.substring(0, 100)}...</div>
                <div className="core-history-arrow">→</div>
                <div className="core-history-rewritten">{item.rewritten.substring(0, 100)}...</div>
              </div>
              <div className="core-history-details">
                <span>Tone: {item.tone}</span>
                <span>Language: {item.language}</span>
                <span>Complexity: {item.complexity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="core-rewrite-container">
      <div className="core-rewrite-header">
        <h1 className="core-rewrite-title">
          <span className="core-rewrite-title-gradient">Advanced AI</span> Content Rewriter
        </h1>
        <p className="core-rewrite-subtitle">Transform your content with advanced AI-powered writing assistance</p>
      </div>

      <div className="core-rewrite-main">
        <div className="core-input-section">
          <div className="core-content-input">
            <textarea
              className="core-rewrite-input"
              placeholder="Enter your content here..."
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
            ></textarea>
            <div className="core-word-counter">Words: {wordCount}</div>
          </div>

          <div className="core-controls-grid">
            <div className="core-control-group">
              <label>Tone:</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)}>
                {tones.map((t) => (
                  <option key={t.toLowerCase()} value={t.toLowerCase()}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="core-control-group">
              <label>Language:</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                {languages.map((lang) => (
                  <option key={lang.toLowerCase()} value={lang.toLowerCase()}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div className="core-control-group">
              <label>Complexity:</label>
              <select value={complexity} onChange={(e) => setComplexity(e.target.value)}>
                {complexityLevels.map((level) => (
                  <option key={level.toLowerCase()} value={level.toLowerCase()}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div className="core-control-group">
              <label>Word Limit:</label>
              <input
                type="number"
                value={wordLimit}
                onChange={(e) => setWordLimit(e.target.value)}
                placeholder="Optional"
              />
            </div>

            <div className="core-control-group">
              <label>Keywords:</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Separate with commas"
              />
            </div>

            {rewrittenContent && (
              <div className="core-control-group">
                <label>Display Mode:</label>
                <select value={displayMode} onChange={(e) => setDisplayMode(e.target.value)}>
                  <option value="text">Plain Text</option>
                  <option value="markdown">Markdown</option>
                </select>
              </div>
            )}
          </div>

          <button
            className={`core-rewrite-button ${loading ? "core-loading" : ""}`}
            onClick={handleRewrite}
            disabled={loading}
          >
            {loading ? "Processing..." : "Rewrite Content"}
          </button>
        </div>

        {rewrittenContent && (
          <div className="core-output-section">
            <div className="core-result-header">
              <h2>Enhanced Content</h2>
              <button className="core-copy-button" onClick={handleCopy}>
                Copy to Clipboard
              </button>
            </div>
            {displayMode === "text" ? (
              <textarea className="core-rewrite-output" readOnly value={rewrittenContent}></textarea>
            ) : (
              <div
                className="core-rewrite-output core-markdown-content"
                dangerouslySetInnerHTML={{ __html: rewrittenMarkdown }}
              />
            )}

            <div className="core-ai-suggestions">
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
  )
}

export default ContentRewrite
