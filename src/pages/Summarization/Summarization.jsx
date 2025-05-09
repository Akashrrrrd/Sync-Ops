"use client"

import { useState } from "react"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./Summarization.css"

// Perplexity API key
const PERPLEXITY_API_KEY = "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"

const Summarization = () => {
  const [inputText, setInputText] = useState("")
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [charCount, setCharCount] = useState(0)
  const [copySuccess, setCopySuccess] = useState(false)

  const manualData = [
    {
      input:
        "Artificial Intelligence is a branch of computer science aimed at creating systems that can perform tasks typically requiring human intelligence.",
      output: "AI focuses on creating systems that perform tasks requiring human intelligence.",
    },
    {
      input:
        "React is a JavaScript library for building user interfaces, maintained by Meta and a community of individual developers and companies.",
      output: "React is a JavaScript library for building user interfaces, maintained by Meta.",
    },
    {
      input:
        "Climate change refers to significant, long-term changes in the global climate. It is driven by human activities, particularly the burning of fossil fuels, which increase greenhouse gas levels.",
      output:
        "Climate change is significant, long-term shifts in climate caused by human activities like fossil fuel burning.",
    },
  ]

  const handleInputChange = (e) => {
    const text = e.target.value
    setInputText(text)
    setCharCount(text.length)
    setError("")
  }

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to summarize.")
      setError("Please enter some text to summarize.")
      return
    }

    if (inputText.length < 50) {
      toast.warning("Please enter at least 50 characters for better summarization.")
      setError("Please enter at least 50 characters for better summarization.")
      return
    }

    setError("")
    setLoading(true)
    setSummary("")
    setCopySuccess(false)

    const toastId = toast.loading("Generating summary...")

    try {
      // Search for manual data match
      const manualMatch = manualData.find((data) => data.input.trim() === inputText.trim())

      if (manualMatch) {
        setSummary(manualMatch.output)
        toast.update(toastId, {
          render: "Summary generated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        })
      } else {
        // API call to Perplexity
        const response = await axios.post(
          "https://api.perplexity.ai/chat/completions",
          {
            model: "sonar",
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant that provides concise summaries of text.",
              },
              {
                role: "user",
                content: `Please provide a concise summary of the following text:\n\n${inputText}`,
              },
            ],
            temperature: 0.7,
            max_tokens: 256,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
            },
          },
        )

        const summaryText = response.data.choices?.[0]?.message?.content || ""

        if (summaryText) {
          setSummary(summaryText)
          toast.update(toastId, {
            render: "Summary generated successfully!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          })
        } else {
          setError("No summary could be generated. Please try rephrasing your input.")
          toast.update(toastId, {
            render: "No summary could be generated. Please try rephrasing your input.",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          })
        }
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message || "An error occurred. Please check your input and try again."
      setError(errorMessage)
      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      })
      console.error("Error details:", err.response?.data || err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      toast.success("Text copied to clipboard!")
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      toast.error("Failed to copy text to clipboard")
      console.error("Failed to copy text:", err)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSummarize()
      toast.info("Shortcut detected: Ctrl + Enter")
    }
  }

  return (
    <div className="sum-summarization-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="sum-summarization-header">
        <h1>✨ AI Text Summarization</h1>
        <p className="sum-subtitle">Transform long text into concise summaries instantly</p>
      </div>

      <div className="sum-input-section">
        <div className="sum-textarea-wrapper">
          <textarea
            placeholder="Enter your text here (minimum 50 characters)..."
            value={inputText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="sum-summarization-textarea"
          />
          <div className="sum-char-count">
            {charCount} characters {charCount < 50 && charCount > 0 && "(minimum 50)"}
          </div>
        </div>

        <button
          onClick={handleSummarize}
          disabled={loading || charCount < 50}
          className={`sum-summarization-button ${loading ? "loading" : ""}`}
        >
          {loading ? (
            <span className="sum-loading-text">
              <span className="sum-dot">.</span>
              <span className="sum-dot">.</span>
              <span className="sum-dot">.</span>
            </span>
          ) : (
            "Summarize"
          )}
        </button>

        {error && <div className="sum-error-message">❌ {error}</div>}
      </div>

      {summary && (
        <div className="sum-summary-output">
          <div className="sum-summary-header">
            <h2>Summary</h2>
            <button onClick={() => handleCopy(summary)} className="sum-copy-button" title="Copy to clipboard">
              {copySuccess ? "✅ Copied!" : "📋 Copy"}
            </button>
          </div>
          <div className="sum-summary-content">
            <p>{summary}</p>
          </div>
        </div>
      )}

      <div className="sum-keyboard-shortcut">Pro tip: Press Ctrl + Enter to summarize quickly</div>
    </div>
  )
}

export default Summarization
