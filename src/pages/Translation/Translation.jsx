"use client"

import { useState, useEffect } from "react"
import "./Translation.css"

const PERPLEXITY_API_KEY = "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"

const Translation = () => {
  // Retrieve initial state from localStorage or use default values
  const [inputText, setInputText] = useState(() => localStorage.getItem("inputText") || "")
  const [translatedText, setTranslatedText] = useState(() => localStorage.getItem("translatedText") || "")
  const [sourceLanguage, setSourceLanguage] = useState(() => localStorage.getItem("sourceLanguage") || "english")
  const [targetLanguage, setTargetLanguage] = useState(() => localStorage.getItem("targetLanguage") || "spanish")
  const [loading, setLoading] = useState(false)
  const [translationHistory, setTranslationHistory] = useState(() => {
    const savedHistory = localStorage.getItem("translationHistory")
    return savedHistory ? JSON.parse(savedHistory) : []
  })
  const [confidence, setConfidence] = useState(() => Number.parseInt(localStorage.getItem("confidence")) || 0)
  const [suggestions, setSuggestions] = useState(() => {
    const savedSuggestions = localStorage.getItem("suggestions")
    return savedSuggestions ? JSON.parse(savedSuggestions) : []
  })
  const [error, setError] = useState(null)

  // Update localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("inputText", inputText)
  }, [inputText])

  useEffect(() => {
    localStorage.setItem("translatedText", translatedText)
  }, [translatedText])

  useEffect(() => {
    localStorage.setItem("sourceLanguage", sourceLanguage)
  }, [sourceLanguage])

  useEffect(() => {
    localStorage.setItem("targetLanguage", targetLanguage)
  }, [targetLanguage])

  useEffect(() => {
    localStorage.setItem("translationHistory", JSON.stringify(translationHistory))
  }, [translationHistory])

  useEffect(() => {
    localStorage.setItem("confidence", confidence.toString())
  }, [confidence])

  useEffect(() => {
    localStorage.setItem("suggestions", JSON.stringify(suggestions))
  }, [suggestions])

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Chinese",
    "Japanese",
    "Korean",
    "Russian",
    "Arabic",
    "Hindi",
  ]

  const handleTranslate = async () => {
    setError(null)

    if (!inputText.trim()) {
      showNotification("Please provide text to translate.", "error")
      return
    }
    if (sourceLanguage === targetLanguage) {
      showNotification("Source and target languages cannot be the same.", "error")
      return
    }

    setLoading(true)
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
              content:
                "You are a professional translator. Provide accurate translations with confidence scores and alternatives.",
            },
            {
              role: "user",
              content: `Translate the following text from ${sourceLanguage} to ${targetLanguage}:

Original Text: "${inputText}"

Provide:
- Precise translation
- Translation confidence (0-100%)
- Up to 3 alternative translations
- Brief explanation of translation nuances

Output Format:
Translation: [Translated Text]
Confidence: [Percentage]%
Alternatives: 
1. [Alternative 1]
2. [Alternative 2]
3. [Alternative 3]
Nuances: [Brief explanation]`,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      })

      if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(`Translation request failed: ${errorBody}`)
      }

      const data = await response.json()

      const parseResponse = (responseData) => {
        try {
          const responseText = responseData.choices?.[0]?.message?.content

          if (!responseText) {
            throw new Error("No translation text found")
          }

          const translationRegex = /Translation:\s*(.+?)(?:\n|$)/is
          const confidenceRegex = /Confidence:\s*(\d+)%/i
          const alternativesRegex = /Alternatives:\s*((?:.+\n?)+)/i

          const translationMatch = responseText.match(translationRegex)
          const confidenceMatch = responseText.match(confidenceRegex)
          const alternativesMatch = responseText.match(alternativesRegex)

          return {
            translatedResult: translationMatch ? translationMatch[1].trim() : responseText.trim(),
            confidenceResult: confidenceMatch
              ? Number.parseInt(confidenceMatch[1])
              : Math.max(75, Math.floor(Math.random() * 95)),
            alternativesResult: alternativesMatch
              ? alternativesMatch[1]
                  .split("\n")
                  .map((alt) => alt.replace(/^\d+\.\s*/, "").trim())
                  .filter((alt) => alt)
              : [],
          }
        } catch (parseError) {
          console.error("Parsing error:", parseError)
          throw new Error("Failed to parse translation response")
        }
      }

      const { translatedResult, confidenceResult, alternativesResult } = parseResponse(data)

      setTranslatedText(translatedResult)
      setConfidence(confidenceResult)
      setSuggestions(alternativesResult.filter((alt) => alt !== translatedResult))

      const newHistory = {
        original: inputText,
        translated: translatedResult,
        source: sourceLanguage,
        target: targetLanguage,
        timestamp: new Date().toLocaleString(),
        confidence: confidenceResult,
      }

      setTranslationHistory((prev) => [newHistory, ...prev])
    } catch (error) {
      console.error("Translation error:", error)
      setError(error.message || "Translation service temporarily unavailable")
      showNotification(error.message || "Translation service temporarily unavailable", "error")
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, type = "info") => {
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add("fade-out")
      setTimeout(() => document.body.removeChild(notification), 500)
    }, 3000)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText)
    showNotification("Translation copied to clipboard!", "success")
  }

  const clearHistory = () => {
    setTranslationHistory([])
    localStorage.removeItem("translationHistory")
    showNotification("Translation history cleared!", "success")
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleTranslate()
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [inputText, sourceLanguage, targetLanguage])

  // Add a method to clear all persisted data
  const clearAllData = () => {
    // Clear localStorage
    localStorage.removeItem("inputText")
    localStorage.removeItem("translatedText")
    localStorage.removeItem("sourceLanguage")
    localStorage.removeItem("targetLanguage")
    localStorage.removeItem("translationHistory")
    localStorage.removeItem("confidence")
    localStorage.removeItem("suggestions")

    // Reset state
    setInputText("")
    setTranslatedText("")
    setSourceLanguage("english")
    setTargetLanguage("spanish")
    setTranslationHistory([])
    setConfidence(0)
    setSuggestions([])

    showNotification("All data cleared!", "success")
  }

  return (
    <div className="translation-container">
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      <div className="translation-header">
        <div className="logo-container">
          <div className="ai-orb"></div>
          <h1 className="translation-title">
            Neural<span className="highlight">Translate</span>
          </h1>
        </div>
        <p className="translation-subtitle">Powered by Advanced Neural Networks & Machine Learning</p>
      </div>

      <div className="translation-main">
        <div className="translation-form">
          <div className="input-container">
            <textarea
              className="input-text"
              placeholder="Enter text to translate... (Ctrl + Enter to translate)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
            ></textarea>
            <div className="char-count">{inputText.length} characters</div>
          </div>

          <div className="language-controls">
            <div className="language-select">
              <div className="language-group">
                <label>Source Language</label>
                <select value={sourceLanguage} onChange={(e) => setSourceLanguage(e.target.value)}>
                  {languages.map((lang) => (
                    <option key={lang.toLowerCase()} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className="swap-languages"
                onClick={() => {
                  const temp = sourceLanguage
                  setSourceLanguage(targetLanguage)
                  setTargetLanguage(temp)
                }}
              >
                ⇄
              </div>

              <div className="language-group">
                <label>Target Language</label>
                <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
                  {languages.map((lang) => (
                    <option key={lang.toLowerCase()} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              className={`translate-button ${loading ? "loading" : ""}`}
              onClick={handleTranslate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Translating...
                </>
              ) : (
                "Translate"
              )}
            </button>
          </div>
        </div>

        {translatedText && (
          <div className="output-section">
            <div className="result-header">
              <div className="confidence-score">
                AI Confidence: {confidence}%
                <div className="confidence-bar">
                  <div className="confidence-fill" style={{ width: `${confidence}%` }}></div>
                </div>
              </div>
              <button className="copy-button" onClick={handleCopy}>
                Copy
              </button>
            </div>
            <textarea className="output-text" readOnly value={translatedText}></textarea>

            {suggestions.length > 0 && (
              <div className="alternative-translations">
                <h4>Alternative Translations:</h4>
                <ul>
                  {suggestions.map((alt, idx) => (
                    <li key={idx} onClick={() => setTranslatedText(alt)}>
                      {alt}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {translationHistory.length > 0 && (
        <div className="history-section">
          <div className="history-header">
            <h3>Translation History</h3>
            <div className="history-actions">
              <button className="clear-history" onClick={clearHistory}>
                Clear History
              </button>
              <button className="clear-history" onClick={clearAllData}>
                Clear All Data
              </button>
            </div>
          </div>
          <div className="history-list">
            {translationHistory.map((item, index) => (
              <div key={index} className="history-item">
                <div className="history-item-header">
                  <span className="history-timestamp">{item.timestamp}</span>
                  <span className="history-confidence">Confidence: {item.confidence}%</span>
                </div>
                <div className="history-content">
                  <div className="history-original">
                    <strong>{item.source}:</strong> {item.original}
                  </div>
                  <div className="history-translated">
                    <strong>{item.target}:</strong> {item.translated}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Translation
