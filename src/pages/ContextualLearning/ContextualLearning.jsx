"use client"

import { useState, useCallback, useEffect } from "react"
import DOMPurify from "dompurify"
import { marked } from "marked"
import "./ContextualLearning.css"

const API_KEY = "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"

// Configure marked options for better parsing
marked.setOptions({
  gfm: true,
  breaks: true,
  smartLists: true,
  headerIds: false,
  mangle: false,
})

const AIExplorer = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchHistory, setSearchHistory] = useState([])
  const [cachedResults, setCachedResults] = useState({})

  useEffect(() => {
    const cached = localStorage.getItem("aiExplorerCache")
    if (cached) {
      setCachedResults(JSON.parse(cached))
    }
  }, [])

  const debouncedSetQuery = useCallback((value) => {
    setQuery(value)
    setError(null)
  }, [])

  const handleInputChange = (e) => {
    debouncedSetQuery(e.target.value)
  }

  const generatePrompt = useCallback((topic) => {
    return `Analyze ${topic} using Perplexity Sonar AI and provide 3 key insights. For each insight include:
    1. A concise title (max 8 words)
    2. A detailed explanation (2-3 sentences)
    3. Focus on current trends and future implications
    
    Format your response clearly without using markdown symbols like * or #. Avoid using bullet points.`
  }, [])

  const sanitizeAndParseMarkdown = (text) => {
    const cleanedText = text
      .replace(/\*\*/g, "") // Remove bold markers
      .replace(/\*/g, "") // Remove italic markers
      .replace(/^#+\s*/gm, "") // Remove header markers
      .trim()

    const rawHTML = marked(cleanedText)
    return DOMPurify.sanitize(rawHTML)
  }

  const fetchResults = async () => {
    if (!query.trim()) {
      setError("Please enter a topic to explore")
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (cachedResults[query.toLowerCase()]) {
        setResults(cachedResults[query.toLowerCase()])
        setLoading(false)
        return
      }

      const prompt = generatePrompt(query)

      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "sonar",
          messages: [
            {
              role: "system",
              content: "You are an expert analyst that provides clear, concise insights on any topic.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      const text = data.choices[0].message.content

      const parsedResults = text
        .split("\n")
        .filter((line) => line.trim() !== "")
        .reduce((acc, line) => {
          if (/^[A-Z]/.test(line.trim())) {
            acc.push({
              title: line.trim(),
              summary: "",
              timestamp: new Date().toISOString(),
            })
          } else if (acc.length > 0) {
            acc[acc.length - 1].summary += (acc[acc.length - 1].summary ? " " : "") + line.trim()
          }
          return acc
        }, [])
        .map((result) => ({
          ...result,
          title: sanitizeAndParseMarkdown(result.title),
          summary: sanitizeAndParseMarkdown(result.summary),
        }))
        .filter((result) => result.title && result.summary)

      const updatedCache = {
        ...cachedResults,
        [query.toLowerCase()]: parsedResults,
      }
      setCachedResults(updatedCache)
      localStorage.setItem("aiExplorerCache", JSON.stringify(updatedCache))

      setResults(parsedResults)
      setSearchHistory((prev) => [...new Set([query, ...prev])].slice(0, 5))
    } catch (err) {
      console.error("API Error:", err)
      setError("Failed to fetch insights from Perplexity Sonar AI.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchResults()
  }

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
          <h1>Sonar Insight Explorer</h1>
          <p className="learn-subtitle">Powered by Perplexity Sonar AI</p>
        </header>

        <section className="learn-search-section">
          <form onSubmit={handleSearch} className="learn-search-form">
            <div className="learn-search-input-container">
              <input
                type="text"
                className="learn-search-input"
                placeholder="Explore any topic with Perplexity Sonar..."
                value={query}
                onChange={handleInputChange}
                autoComplete="off"
              />
              <button type="submit" className="learn-search-button" disabled={loading}>
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
              <p>Recent topics:</p>
              <div className="learn-history-tags">
                {searchHistory.map((item, index) => (
                  <button
                    key={index}
                    className="learn-history-tag"
                    onClick={() => {
                      setQuery(item)
                      fetchResults()
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
              <p>Perplexity Sonar analyzing your query...</p>
            </div>
          )}

          {!loading && results.length === 0 && !error && (
            <div className="learn-empty-state">
              <div className="learn-empty-illustration">
                <div className="learn-brain-wave"></div>
                <div className="learn-brain-wave"></div>
                <div className="learn-brain-wave"></div>
              </div>
              <p>Enter a topic to explore with Perplexity Sonar AI</p>
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
                    <div dangerouslySetInnerHTML={{ __html: result.summary }}></div>
                  </div>
                  <div className="learn-card-footer">
                    <div className="learn-insight-tag">Sonar Analysis</div>
                    {result.timestamp && (
                      <div className="learn-timestamp">{new Date(result.timestamp).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default AIExplorer
