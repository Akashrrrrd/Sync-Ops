"use client"

import { useState, useRef, useEffect } from "react"
import "./AIBot.css"

// It's better to use environment variables for API keys
// For this example, we'll keep it in the code but in production
// you should use environment variables
const PERPLEXITY_API_KEY = "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"
const STORAGE_KEY = "ai_bot_chat_history"

const AIBot = ({ isOpen, toggleAIBot }) => {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY)
    return savedMessages
      ? JSON.parse(savedMessages)
      : [
          {
            type: "bot",
            content: "Hi there! I'm your AI assistant. How can I help you today?",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]
  })

  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus()
      }, 100)
    }
  }, [isOpen])

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      type: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      // Format previous messages for context (last 5 messages)
      const previousMessages = messages.slice(-5).map((msg) => ({
        role: msg.type === "user" ? "user" : "assistant",
        content: msg.content,
      }))

      // Fixed API request format for Perplexity AI
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        },
        body: JSON.stringify({
          model: "sonar-small-chat",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful AI assistant for a project management and collaboration platform. Provide concise, helpful responses to user queries. Keep responses brief and focused.",
            },
            ...previousMessages,
            {
              role: "user",
              content: inputValue,
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
          stream: false,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error:", response.status, errorText)
        throw new Error(`API request failed with status: ${response.status}`)
      }

      const data = await response.json()

      // Check if the response has the expected structure
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error("Unexpected API response structure:", data)
        throw new Error("Unexpected API response format")
      }

      const botResponse = {
        type: "bot",
        content: data.choices[0].message.content,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }

      setMessages((prev) => [...prev, botResponse])
    } catch (error) {
      console.error("Error with AI API:", error)

      // Fallback response if API fails
      const errorMessage = {
        type: "bot",
        content:
          "I'm having trouble connecting to my knowledge base right now. Please check your internet connection or try again later.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    const initialMessage = {
      type: "bot",
      content: "Chat history cleared. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
    setMessages([initialMessage])
  }

  return (
    <>
      {/* Bot toggle button - always visible */}
      <button
        className={`ai-bot-toggle ${isOpen ? "active" : ""}`}
        onClick={toggleAIBot}
        aria-label="Toggle AI Assistant"
      >
        <div className="ai-bot-icon">
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          )}
        </div>
        {!isOpen && <div className="ai-bot-pulse"></div>}
      </button>

      {/* Bot chat window */}
      <div className={`ai-bot-container ${isOpen ? "open" : ""}`}>
        <div className="ai-bot-header">
          <div className="ai-bot-title">
            <div className="ai-bot-avatar">
              <div className="ai-bot-avatar-icon">AI</div>
            </div>
            <h3>Perplexity AI Assistant</h3>
          </div>
          <div className="ai-bot-actions">
            <button className="ai-bot-clear" onClick={clearChat} title="Clear chat">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
            <button className="ai-bot-close" onClick={toggleAIBot} title="Close chat">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className="ai-bot-messages">
          {messages.map((message, index) => (
            <div key={index} className={`ai-bot-message ${message.type}`}>
              {message.type === "bot" && (
                <div className="ai-bot-avatar">
                  <div className="ai-bot-avatar-icon">AI</div>
                </div>
              )}
              <div className="ai-bot-message-content">
                <div className="ai-bot-message-text">{message.content}</div>
                <div className="ai-bot-message-time">{message.timestamp}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="ai-bot-message bot">
              <div className="ai-bot-avatar">
                <div className="ai-bot-avatar-icon">AI</div>
              </div>
              <div className="ai-bot-message-content">
                <div className="ai-bot-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="ai-bot-input-container">
          <textarea
            ref={inputRef}
            className="ai-bot-input"
            placeholder="Type your message..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            rows={1}
          />
          <button className="ai-bot-send" onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}

export default AIBot
