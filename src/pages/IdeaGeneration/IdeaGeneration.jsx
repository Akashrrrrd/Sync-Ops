"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./IdeaGeneration.css"

const PERPLEXITY_API_KEY = "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"

const IdeaGeneration = () => {
  const [userInput, setUserInput] = useState("")
  const [generatedIdeas, setGeneratedIdeas] = useState([])
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState("all")
  const [aiConfidence, setAiConfidence] = useState(0)
  const [copiedIdeas, setCopiedIdeas] = useState([])
  const [showTips, setShowTips] = useState(false)

  const categories = ["All Ideas", "Technology", "Business", "Creative", "Innovation", "SocialImpact"]

  const aiTips = [
    "Be specific with your problem statement",
    "Consider adding constraints",
    "Think about the end user",
    "Include market context if relevant",
    "Specify desired outcome",
  ]

  const generateIdeas = async () => {
    if (!userInput.trim()) {
      showNotification("Please enter a topic or problem to generate ideas!")
      return
    }

    setLoading(true)
    setAiConfidence(0)
    setGeneratedIdeas([])

    try {
      await simulateAIProgress()

      // Specific prompt based on selected category
      const categoryPrompt =
        category === "all"
          ? `Generate one innovative idea for each category: Technology, Business, Creative, Innovation, and Social Impact. 
           The ideas should be unique and relate to the broad topic: ${userInput}`
          : `Generate 5 innovative ideas specifically in the ${category} category related to: ${userInput}`

      try {
        const response = await axios.post(
          "https://api.perplexity.ai/chat/completions",
          {
            model: "sonar",
            messages: [
              {
                role: "system",
                content: "You are a creative idea generation assistant that provides innovative ideas in JSON format.",
              },
              {
                role: "user",
                content: `${categoryPrompt}
                
                Provide the response strictly as a valid JSON array with each idea having these properties:
                [
                  {
                    "text": "idea description",
                    "category": "Category Name",
                    "confidence": number between 70-100
                  }
                ]`,
              },
            ],
            temperature: 0.7,
            max_tokens: 500,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
            },
          },
        )

        const responseText = response.data.choices?.[0]?.message?.content || "[]"

        const cleanedResponseText = responseText
          .replace(/```(json)?/g, "")
          .replace(/\n/g, "")
          .trim()

        let parsedIdeas = []
        try {
          parsedIdeas = JSON.parse(cleanedResponseText)
        } catch (parseError) {
          try {
            parsedIdeas = JSON.parse(`[${cleanedResponseText}]`)
          } catch (secondParseError) {
            console.error("Failed to parse AI response:", parseError)
            console.error("Raw response:", responseText)
            showNotification("Error parsing AI response", "error")
            throw secondParseError
          }
        }

        const formattedIdeas = parsedIdeas.map((idea) => ({
          id: Math.random().toString(36).substr(2, 9),
          text: idea.text,
          category: category === "all" ? idea.category : category.charAt(0).toUpperCase() + category.slice(1),
          timestamp: new Date().toISOString(),
          confidence: idea.confidence || Math.floor(Math.random() * 30) + 70,
        }))

        setGeneratedIdeas(formattedIdeas)
        setAiConfidence(85)
      } catch (apiError) {
        console.error("API generation failed:", apiError)
        showNotification("Failed to generate ideas", "error")
      }
    } catch (error) {
      console.error("Error generating ideas:", error)
      showNotification("Something went wrong!", "error")
    }

    setLoading(false)
  }

  const simulateAIProgress = async () => {
    for (let i = 0; i <= 100; i += 20) {
      setAiConfidence(i)
      await new Promise((resolve) => setTimeout(resolve, 400))
    }
  }

  const copyIdea = (idea) => {
    // Copy to clipboard
    navigator.clipboard
      .writeText(`${idea.category} Idea (${idea.confidence}% Match):\n${idea.text}`)
      .then(() => {
        // Add to copied ideas to show visual feedback
        if (!copiedIdeas.some((copied) => copied.id === idea.id)) {
          setCopiedIdeas((prev) => [...prev, idea])
          showNotification("Idea copied to clipboard!")
        }
      })
      .catch((err) => {
        console.error("Failed to copy:", err)
        showNotification("Failed to copy idea", "error")
      })
  }

  const showNotification = (message, type = "info") => {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add("fade-out")
      setTimeout(() => document.body.removeChild(notification), 500)
    }, 3000)
  }

  useEffect(() => {
    setAiConfidence(100)
  }, [])

  return (
    <div className="idea-container">
      <div className="idea-header">
        <h1 className="idea-title">
          <span className="idea-title-gradient">AI-Powered</span> Idea Generator
        </h1>
        <p className="idea-subtitle">Transform your challenges into opportunities with advanced AI assistance</p>
        <div className="ai-status">
          <div className="ai-confidence">
            <div className="confidence-bar" style={{ width: `${aiConfidence}%` }}></div>
          </div>
          <span className="ai-status-text">AI System Confidence: {aiConfidence}%</span>
        </div>
      </div>

      <div className="category-selector">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-button ${category === cat.toLowerCase() ? "active" : ""}`}
            onClick={() => setCategory(cat.toLowerCase())}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="idea-input-container">
        <div className="input-header">
          <h3>Describe Your Challenge</h3>
          <button className="tips-toggle" onClick={() => setShowTips(!showTips)}>
            {showTips ? "Hide Tips" : "Show AI Tips"}
          </button>
        </div>

        {showTips && (
          <div className="ai-tips">
            {aiTips.map((tip, index) => (
              <div key={index} className="tip-item">
                <span className="tip-number">{index + 1}</span>
                {tip}
              </div>
            ))}
          </div>
        )}

        <textarea
          className="idea-input"
          placeholder="Describe your topic or problem in detail..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        ></textarea>

        <button className={`generate-button ${loading ? "loading" : ""}`} onClick={generateIdeas} disabled={loading}>
          {loading ? (
            <span className="loading-text">
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </span>
          ) : (
            "Generate Ideas"
          )}
        </button>
      </div>

      {generatedIdeas.length > 0 && (
        <div className="idea-results">
          <h2 className="results-title">Generated Ideas</h2>
          <div className="ideas-grid">
            {generatedIdeas.map((idea) => (
              <div key={idea.id} className="idea-card">
                <div className="idea-card-header">
                  <span className="idea-category">{idea.category}</span>
                  <span className="idea-confidence">{idea.confidence}% Match</span>
                </div>
                <p className="idea-text">{idea.text}</p>
                <div className="idea-card-footer">
                  <button
                    className="copy-button"
                    onClick={() => copyIdea(idea)}
                    disabled={copiedIdeas.some((copied) => copied.id === idea.id)}
                  >
                    {copiedIdeas.some((copied) => copied.id === idea.id) ? "Copied" : "Copy Idea"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default IdeaGeneration
