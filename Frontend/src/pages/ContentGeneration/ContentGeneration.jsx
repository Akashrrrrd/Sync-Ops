"use client"

import { useState, useEffect, useRef } from "react"
import "./ContentGeneration.css"
import { marked } from "marked"
import DOMPurify from "dompurify"
import "react-toastify/dist/ReactToastify.css"

const PERPLEXITY_API_KEY = "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"

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
})

const ContentGeneration = () => {
  const [apiKey, setApiKey] = useState("")
  const [inputPrompt, setInputPrompt] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copySuccess, setCopySuccess] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [contentHistory, setContentHistory] = useState([])
  const [selectedTone, setSelectedTone] = useState("professional")
  const [selectedLength, setSelectedLength] = useState("medium")
  const [saveStatus, setSaveStatus] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)
  const [markdownMode, setMarkdownMode] = useState(true)
  const textareaRef = useRef(null)

  const toneOptions = [
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual" },
    { value: "friendly", label: "Friendly" },
    { value: "formal", label: "Formal" },
    { value: "technical", label: "Technical" },
  ]

  const lengthOptions = [
    { value: "short", label: "Short (100 words)", maxTokens: 400 },
    { value: "medium", label: "Medium (300 words)", maxTokens: 600 },
    { value: "long", label: "Long (500 words)", maxTokens: 1000 },
    { value: "custom", label: "Custom Length", maxTokens: 1200 },
  ]

  const promptTemplates = [
    "Write a blog post about technology trends in 2024.",
    "Create a social media caption for a new product launch.",
    "Draft an email announcing a company event.",
    "Generate a product description for a fitness gadget.",
    "Compose a business proposal about renewable energy.",
  ]

  // Comprehensive initialization from localStorage
  useEffect(() => {
    // Restore API Key
    const savedApiKey = localStorage.getItem("perplexityApiKey")
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }

    // Restore Content History
    const savedHistory = localStorage.getItem("contentHistory")
    if (savedHistory) {
      setContentHistory(JSON.parse(savedHistory))
    }

    // Restore Last Used Prompt
    const savedPrompt = localStorage.getItem("lastUsedPrompt")
    if (savedPrompt) {
      setInputPrompt(savedPrompt)
    }

    // Restore Last Used Tone
    const savedTone = localStorage.getItem("lastUsedTone")
    if (savedTone) {
      setSelectedTone(savedTone)
    }

    // Restore Last Used Length
    const savedLength = localStorage.getItem("lastUsedLength")
    if (savedLength) {
      setSelectedLength(savedLength)
    }

    // Restore Generated Content
    const savedContent = localStorage.getItem("lastGeneratedContent")
    if (savedContent) {
      setGeneratedContent(savedContent)
    }
  }, [])

  // Update localStorage when key states change
  useEffect(() => {
    if (inputPrompt) {
      localStorage.setItem("lastUsedPrompt", inputPrompt)
    }
  }, [inputPrompt])

  useEffect(() => {
    localStorage.setItem("lastUsedTone", selectedTone)
  }, [selectedTone])

  useEffect(() => {
    localStorage.setItem("lastUsedLength", selectedLength)
  }, [selectedLength])

  useEffect(() => {
    if (generatedContent) {
      localStorage.setItem("lastGeneratedContent", generatedContent)
    }
  }, [generatedContent])

  // Word and character count tracking
  useEffect(() => {
    if (inputPrompt) {
      const words = inputPrompt.trim().split(/\s+/).length
      const chars = inputPrompt.length
      setWordCount(words)
      setCharCount(chars)
    } else {
      setWordCount(0)
      setCharCount(0)
    }
  }, [inputPrompt])

  // Content Generation Function
  const handleGenerateContent = async () => {
    if (!PERPLEXITY_API_KEY) {
      setError("Perplexity API key is missing.")
      return
    }

    if (!inputPrompt.trim()) {
      setError("Please enter a prompt to generate content.")
      return
    }

    setError("")
    setLoading(true)
    setGeneratedContent("")
    setCopySuccess(false)

    const selectedLengthConfig = lengthOptions.find((l) => l.value === selectedLength)

    try {
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
              content: `You are an expert content creator that generates high-quality content in the specified tone and length. Always format your response appropriately.`,
            },
            {
              role: "user",
              content: `Generate content with these specifications:
              - Tone: ${selectedTone}
              - Approximate Length: ${selectedLength} (around ${selectedLengthConfig.maxTokens} words)
              - Format: ${markdownMode ? "Use Markdown formatting" : "Plain text"}
              - Be clear, engaging, and directly address this prompt: ${inputPrompt}`,
            },
          ],
          temperature: 0.7,
          max_tokens: selectedLengthConfig.maxTokens,
        }),
      })

      if (!response.ok) {
        const errorResponse = await response.json()
        throw new Error(errorResponse.error?.message || "API request failed")
      }

      const data = await response.json()
      const generatedText = data.choices[0].message.content.trim()

      setGeneratedContent(generatedText)
      localStorage.setItem("lastGeneratedContent", generatedText)

      // Add to history
      const newHistoryItem = {
        id: Date.now(),
        prompt: inputPrompt,
        content: generatedText,
        timestamp: new Date().toISOString(),
        tone: selectedTone,
        length: selectedLength,
      }

      const updatedHistory = [newHistoryItem, ...contentHistory].slice(0, 10)
      setContentHistory(updatedHistory)
      localStorage.setItem("contentHistory", JSON.stringify(updatedHistory))
    } catch (err) {
      setError(`Content generation failed: ${err.message}`)
      console.error("Generation Error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Input Change Handler
  const handleInputChange = (e) => {
    setInputPrompt(e.target.value)
    setError("")
    autoResizeTextarea()
  }

  // Textarea Auto-resize
  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
    }
  }

  // Copy Generated Content
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy text:", err)
      setError("Failed to copy to clipboard")
    }
  }

  // Save Generated Content
  const handleSave = () => {
    if (!generatedContent) return

    const blob = new Blob([generatedContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `generated-content-${Date.now()}.${markdownMode ? "md" : "txt"}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setSaveStatus("Content saved successfully!")
    setTimeout(() => setSaveStatus(""), 2000)
  }

  // Template Selection
  const handleTemplateSelect = (template) => {
    setInputPrompt(template)
    textareaRef.current?.focus()
  }

  // API Key Saving
  const handleSaveApiKey = () => {
    if (apiKey) {
      localStorage.setItem("perplexityApiKey", apiKey)
      setShowApiKeyInput(false)
    }
  }

  // Clear Generation History
  const clearHistory = () => {
    setContentHistory([])
    localStorage.removeItem("contentHistory")
    localStorage.removeItem("lastGeneratedContent")
    localStorage.removeItem("lastUsedPrompt")
    setGeneratedContent("")
    setInputPrompt("")
  }

  // Markdown Rendering
  const renderContent = (content) => {
    if (!content) return ""

    if (markdownMode) {
      // Convert markdown to HTML and sanitize
      const rawHtml = marked(content)
      const sanitizedHtml = DOMPurify.sanitize(rawHtml, {
        USE_PROFILES: { html: true },
        ALLOWED_TAGS: [
          "p",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "ul",
          "ol",
          "li",
          "strong",
          "em",
          "code",
          "pre",
          "blockquote",
          "a",
        ],
        ALLOWED_ATTR: ["href", "target", "rel"],
      })
      return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
    }

    return <pre>{content}</pre>
  }

  return (
    <div className="coge-content-generator">
      <div className="coge-content-generator__header">
        <h1 className="coge-content-generator__title">AI Content Studio</h1>
        <p className="coge-content-generator__subtitle">
          Transform your ideas into powerful content with advanced AI assistance
        </p>
      </div>

      <div className="coge-content-generator__controls">
        <div className="coge-content-generator__control-group">
          <label className="coge-content-generator__label">Tone</label>
          <select
            className="coge-content-generator__select"
            value={selectedTone}
            onChange={(e) => setSelectedTone(e.target.value)}
          >
            {toneOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="coge-content-generator__control-group">
          <label className="coge-content-generator__label">Length</label>
          <select
            className="coge-content-generator__select"
            value={selectedLength}
            onChange={(e) => setSelectedLength(e.target.value)}
          >
            {lengthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="coge-content-generator__control-group">
          <div className="coge-content-generator__toggle"></div>
        </div>
      </div>

      <div className="coge-content-generator__templates">
        <h3 className="coge-content-generator__templates-title">Quick Templates</h3>
        <div className="coge-content-generator__templates-grid">
          {promptTemplates.map((template, index) => (
            <button
              key={index}
              className="coge-content-generator__template-button"
              onClick={() => handleTemplateSelect(template)}
            >
              {template}
            </button>
          ))}
        </div>
      </div>

      <div className="coge-content-generator__input-section">
        <div className="coge-content-generator__input-header">
          <label className="coge-content-generator__label">Your Prompt</label>
          <div className="coge-content-generator__counts">
            <span>{wordCount} words</span>
            <span>{charCount} characters</span>
          </div>
        </div>

        <textarea
          ref={textareaRef}
          className="coge-content-generator__textarea"
          placeholder="Enter your prompt here... Be specific about your requirements."
          value={inputPrompt}
          onChange={handleInputChange}
          rows={4}
        />

        <button
          className={`coge-content-generator__button ${loading ? "coge-content-generator__button--loading" : ""}`}
          onClick={handleGenerateContent}
          disabled={loading}
        >
          {loading ? (
            <span className="coge-content-generator__loading-text">
              Generating Content...
              <span className="coge-content-generator__loading-dots"></span>
            </span>
          ) : (
            "Generate Content"
          )}
        </button>

        {error && (
          <div className="coge-content-generator__error" role="alert">
            {error}
          </div>
        )}
      </div>

      {generatedContent && (
        <div className="coge-content-generator__output">
          <div className="coge-content-generator__output-header">
            <h2 className="coge-content-generator__output-title">Generated Content</h2>
            <div className="coge-content-generator__output-actions">
              <button
                className={`coge-content-generator__action-button ${
                  copySuccess ? "coge-content-generator__action-button--success" : ""
                }`}
                onClick={handleCopy}
              >
                {copySuccess ? "Copied!" : "Copy"}
              </button>
              <button className="coge-content-generator__action-button" onClick={handleSave}>
                Save as File
              </button>
            </div>
          </div>
          <div className="coge-content-generator__output-content">{renderContent(generatedContent)}</div>
          {saveStatus && <div className="coge-content-generator__save-status">{saveStatus}</div>}
        </div>
      )}

      {contentHistory.length > 0 && (
        <div
          className={`coge-content-generator__history ${isExpanded ? "coge-content-generator__history--expanded" : ""}`}
        >
          <div className="coge-content-generator__history-header">
            <h3 className="coge-content-generator__history-title">Generation History</h3>
            <div className="coge-content-generator__history-actions">
              <button className="coge-content-generator__history-toggle" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? "Show Less" : "Show More"}
              </button>
              <button className="coge-content-generator__history-clear" onClick={clearHistory}>
                Clear History
              </button>
            </div>
          </div>
          <div className="coge-content-generator__history-list">
            {contentHistory.map((item) => (
              <div key={item.id} className="coge-content-generator__history-item">
                <div className="coge-content-generator__history-item-header">
                  <span className="coge-content-generator__history-item-prompt">{item.prompt.substring(0, 50)}...</span>
                  <span className="coge-content-generator__history-item-date">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="coge-content-generator__history-item-tags">
                  <span className="coge-content-generator__history-item-tag">{item.tone}</span>
                  <span className="coge-content-generator__history-item-tag">{item.length}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ContentGeneration
