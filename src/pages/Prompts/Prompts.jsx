"use client"

import { useState, useCallback, useEffect } from "react"
import axios from "axios"
import { marked } from "marked"
import DOMPurify from "dompurify"
import { ToastContainer, toast, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./Prompts.css"

const RECOMMENDED_PROMPTS = [
  {
    id: 1,
    topic: "Creative Writing",
    description: "Generate a unique story premise that blends sci-fi and historical fiction",
  },
  {
    id: 2,
    topic: "Business Strategy",
    description: "Develop an innovative business model for sustainable technology",
  },
  {
    id: 3,
    topic: "Product Design",
    description: "Create a revolutionary product that solves an everyday problem",
  },
  {
    id: 4,
    topic: "Educational Innovation",
    description: "Design an immersive learning experience for complex scientific concepts",
  },
  {
    id: 5,
    topic: "Social Impact",
    description: "Craft a comprehensive strategy to address urban sustainability",
  },
  {
    id: 6,
    topic: "Health & Wellness",
    description: "Propose a cutting-edge solution to improve mental health care access",
  },
  {
    id: 7,
    topic: "Technology",
    description: "Outline the potential applications of AI in disaster management",
  },
  {
    id: 8,
    topic: "Entertainment",
    description: "Pitch an original concept for a TV series that targets Gen Z audiences",
  },
]

const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Slide,
}

const DynamicPrompts = () => {
  // Initialize state from localStorage with fallback
  const [userInput, setUserInput] = useState(() => localStorage.getItem("currentUserInput") || "")

  const [generatedPrompt, setGeneratedPrompt] = useState(() => localStorage.getItem("currentGeneratedPrompt") || "")

  const [promptHistory, setPromptHistory] = useState(() => {
    const savedHistory = localStorage.getItem("promptHistory")
    return savedHistory
      ? JSON.parse(savedHistory).map((item) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }))
      : []
  })

  const [loading, setLoading] = useState(false)
  const [activeModal, setActiveModal] = useState(null)

  const API_KEY = "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"

  // Persist user input to localStorage
  useEffect(() => {
    localStorage.setItem("currentUserInput", userInput)
  }, [userInput])

  // Persist generated prompt to localStorage
  useEffect(() => {
    localStorage.setItem("currentGeneratedPrompt", generatedPrompt)
  }, [generatedPrompt])

  // Update localStorage whenever promptHistory changes
  useEffect(() => {
    localStorage.setItem("promptHistory", JSON.stringify(promptHistory))
  }, [promptHistory])

  const generatePrompt = useCallback(async () => {
    if (!userInput.trim()) {
      toast.info("Please enter a topic to spark AI creativity", toastConfig)
      return
    }

    setLoading(true)
    try {
      const promptTemplate = `
Professional Prompt Engineering Framework:
- Domain: "${userInput}"
- Objective: Craft a multidimensional, strategically nuanced prompt
- Requirements:
  1. Demonstrate intellectual depth
  2. Encourage innovative thinking
  3. Provide clear, actionable guidance
  4. Stimulate comprehensive exploration
`

      const response = await axios.post(
        "https://api.perplexity.ai/chat/completions",
        {
          model: "sonar",
          messages: [
            {
              role: "system",
              content:
                "You are an expert prompt engineer who creates sophisticated, nuanced prompts that inspire creativity and deep thinking.",
            },
            {
              role: "user",
              content: promptTemplate,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        },
      )

      const text = response.data.choices[0].message.content

      const sanitizedText = DOMPurify.sanitize(marked(text))
      setGeneratedPrompt(sanitizedText)

      const newPromptItem = {
        id: Date.now(),
        topic: userInput,
        prompt: sanitizedText,
        timestamp: new Date(),
      }

      // Limit history to 10 most recent items
      setPromptHistory((prev) => {
        const updatedHistory = [newPromptItem, ...prev.slice(0, 9)]
        return updatedHistory
      })

      toast.success("Prompt Generated Successfully!", toastConfig)
    } catch (error) {
      console.error("Prompt Generation Error:", error)
      toast.error("AI Creativity Temporarily Unavailable", {
        ...toastConfig,
        autoClose: 7500,
      })
    } finally {
      setLoading(false)
    }
  }, [userInput, API_KEY])

  const copyToClipboard = useCallback((text) => {
    const plainText = text.replace(/<[^>]*>/g, "")
    navigator.clipboard
      .writeText(plainText)
      .then(() => toast.success("Prompt Copied to Clipboard", toastConfig))
      .catch(() => toast.error("Clipboard Copy Failed", toastConfig))
  }, [])

  const resetFields = useCallback(() => {
    setUserInput("")
    setGeneratedPrompt("")
    localStorage.removeItem("currentUserInput")
    localStorage.removeItem("currentGeneratedPrompt")
    toast.info("Fields Reset", toastConfig)
  }, [])

  const clearHistory = useCallback(() => {
    setPromptHistory([])
    localStorage.removeItem("promptHistory")
    toast.info("Prompt History Cleared", toastConfig)
  }, [])

  const openHistoryModal = useCallback((prompt) => {
    setActiveModal(prompt)
  }, [])

  const closeModal = useCallback(() => {
    setActiveModal(null)
  }, [])

  const selectRecommendedPrompt = useCallback((prompt) => {
    setUserInput(prompt.description)
    toast.info(`Selected: ${prompt.topic}`, toastConfig)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && userInput.trim()) {
        generatePrompt()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [userInput, generatePrompt])

  return (
    <div className="prompt-forge-container">
      <div className="prompt-forge-header">
        <h1>
          Prompt <span className="gradient-text">Forge AI</span>
        </h1>
        <p>Elevate Your Creative Potential Through Intelligent Prompt Engineering</p>
      </div>

      <div className="prompt-input-section">
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Enter your creative domain..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={loading}
            className="prompt-input"
          />
          <button onClick={generatePrompt} disabled={loading} className="generate-btn">
            {loading ? "Generating..." : "Spark Ideas"}
          </button>
          <button onClick={resetFields} className="reset-btn">
            Reset
          </button>
        </div>
      </div>

      {/* Recommended Prompts Section */}
      <div className="recommended-prompts-section">
        <h3>Recommended Prompts</h3>
        <div className="recommended-prompts-grid">
          {RECOMMENDED_PROMPTS.map((prompt) => (
            <div key={prompt.id} className="recommended-prompt-card" onClick={() => selectRecommendedPrompt(prompt)}>
              <h4>{prompt.topic}</h4>
              <p>{prompt.description}</p>
            </div>
          ))}
        </div>
      </div>

      {generatedPrompt && (
        <div className="generated-prompt-section">
          <div className="generated-prompt-header">
            <h2>Generated Prompt</h2>
            <button onClick={() => copyToClipboard(generatedPrompt)} className="copy-btn">
              Copy Prompt
            </button>
          </div>
          <div className="generated-prompt-content" dangerouslySetInnerHTML={{ __html: generatedPrompt }} />
        </div>
      )}

      {promptHistory.length > 0 && (
        <div className="prompt-history-section">
          <div className="prompt-history-header">
            <h3>Prompt History</h3>
            <button onClick={clearHistory} className="clear-history-btn">
              Clear History
            </button>
          </div>
          <div className="prompt-history-list">
            {promptHistory.map((item) => (
              <div key={item.id} className="history-item">
                <span className="history-topic">{item.topic}</span>
                <span className="history-timestamp">{item.timestamp.toLocaleString()}</span>
                <button onClick={() => openHistoryModal(item)} className="view-history-btn">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Historical Prompt Details</h2>
              <button onClick={closeModal} className="modal-close-btn">
                ×
              </button>
            </div>
            <div className="modal-body" dangerouslySetInnerHTML={{ __html: activeModal.prompt }} />
            <div className="modal-footer">
              <button onClick={() => copyToClipboard(activeModal.prompt)} className="modal-copy-btn">
                Copy Prompt
              </button>
              <button onClick={closeModal} className="modal-close-action-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  )
}

export default DynamicPrompts
