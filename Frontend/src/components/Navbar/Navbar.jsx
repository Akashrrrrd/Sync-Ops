"use client";

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { marked } from "marked";
import DOMPurify from "dompurify";
import "./Navbar.css";
import "./AIModal.css";
import logo from "./../../assets/logo.png";

import { NavLink } from "react-router-dom";

// Constants
const API_KEY = "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";
const STORAGE_KEY = "ai_chat_history";

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: false,
  mangle: false,
});

// ChatMessage Component remains the same
const ChatMessage = ({ message }) => {
  const renderMarkdown = (content) => {
    const rawHtml = marked(content);
    const sanitizedHtml = DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "em",
        "code",
        "pre",
        "blockquote",
        "ul",
        "ol",
        "li",
        "a",
      ],
      ALLOWED_ATTR: ["href", "target", "rel"],
    });

    return { __html: sanitizedHtml };
  };

  return (
    <div
      className={`chat-message ${
        message.type === "user" ? "user-message" : "ai-message"
      }`}
    >
      <div className="message-content">
        <div
          dangerouslySetInnerHTML={renderMarkdown(message.content)}
          className="markdown-content"
        />
        <span className="message-timestamp">{message.timestamp}</span>
      </div>
    </div>
  );
};

// LoadingIndicator Component remains the same
const LoadingIndicator = () => (
  <div className="chat-message ai-message">
    <div className="message-content">
      <div className="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
);

// SearchBar Component remains the same
const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // Mock data for search suggestions
  const items = [
    { id: 1, name: "Dynamic Prompts", path: "/dynamic-prompts" },
    { id: 2, name: "Content Generation", path: "/content-generation" },
    { id: 3, name: "Content Rewrite", path: "/content-rewrite" },
    { id: 4, name: "Summarization", path: "/summarization" },
    { id: 5, name: "Translation", path: "/translation" },
    { id: 6, name: "Idea Generation", path: "/idea-generation" },
    { id: 7, name: "Data Insights", path: "/data-insights-generator" },
    { id: 8, name: "Contextual Learning", path: "/contextual-learning" },
    { id: 9, name: "Content Anonymizer", path: "/content-anonymizer" },
    { id: 10, name: "Vocalscript", path: "/vocal-script" },
  ];

  // Handle input change and filter suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() !== "") {
      const filteredSuggestions = items.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Handle click on a suggestion
  const handleSuggestionClick = (path) => {
    navigate(path); // Navigate to the selected path
    setQuery("");
    setSuggestions([]);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search AI-enhanced..."
        className="search-input"
        value={query}
        onChange={handleInputChange}
      />
      <button className="search-button">
        <svg
          className="search-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
      {suggestions.length > 0 && (
        <div className="dropdown">
          {suggestions.map((item) => (
            <div
              key={item.id}
              className="dropdown-item"
              onClick={() => handleSuggestionClick(item.path)}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// AIModal Component remains the same (no changes needed)
const AIModal = ({
  isOpen,
  onClose,
  chatMessages,
  aiQuery,
  setAIQuery,
  handleAISubmit,
  isLoading,
  chatContainerRef,
  handleClearChat,
}) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAISubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="ai-modal-overlay" onClick={onClose}></div>
      <div className="ai-modal">
        <div className="ai-modal-content">
          <div className="ai-modal-header">
            <h2 className="ai-modal-title">AI Assistant</h2>
            <div className="ai-modal-actions">
              <button className="clear-chat-button" onClick={handleClearChat}>
                Clear Chat
              </button>
              <button className="ai-modal-close" onClick={onClose}>
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
              </button>
            </div>
          </div>

          <div className="chat-container" ref={chatContainerRef}>
            {chatMessages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {isLoading && <LoadingIndicator />}
          </div>

          <div className="chat-input-container">
            <textarea
              className="chat-input"
              placeholder="Type your message... (Markdown supported)"
              value={aiQuery}
              onChange={(e) => setAIQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            ></textarea>
            <button
              className="chat-send-button"
              onClick={handleAISubmit}
              disabled={isLoading || !aiQuery.trim()}
            >
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
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Updated ProfileMenu Component
const ProfileMenu = ({
  userType,
  isLoggedIn,
  isProfileMenuOpen,
  toggleProfileMenu,
  handleSignOut,
}) => {
  // If user is a guest, return the login button in the same container
  if (userType === "guest") {
    return (
      <div className="profile-menu">
        <Link to="/login">
          <button className="login-button">Login</button>
        </Link>
      </div>
    );
  }

  // Existing logic for logged-in and non-guest users remains the same
  return (
    <div className="profile-menu">
      {isLoggedIn ? (
        <>
          <button className="profile-button" onClick={toggleProfileMenu}>
            <span className="profile-name">Profile</span>
            <svg
              className="chevron-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isProfileMenuOpen && (
            <div className="profile-dropdown">
              <Link to="/profile" className="dropdown-item">
                Profile
              </Link>
              <Link to="/settings" className="dropdown-item">
                Settings
              </Link>
              <Link to="/help" className="dropdown-item">
                Help & Support
              </Link>
              <div className="dropdown-divider"></div>
              <Link className="dropdown-item" onClick={handleSignOut}>
                Sign Out
              </Link>
            </div>
          )}
        </>
      ) : (
        <Link to="/login">
          <button className="login-button">Login</button>
        </Link>
      )}
    </div>
  );
};

// Main Navbar Component
const Navbar = ({ isLoggedIn, handleLogout, userType }) => {
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isAIAssistantOpen, setAIAssistantOpen] = useState(false);
  const [aiQuery, setAIQuery] = useState("");
  const [chatMessages, setChatMessages] = useState(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const toggleProfileMenu = () => setProfileMenuOpen(!isProfileMenuOpen);

  const toggleAIAssistant = () => {
    setAIAssistantOpen(!isAIAssistantOpen);
    if (!isAIAssistantOpen) {
      setAIQuery("");
    }
  };

  const handleSignOut = () => {
    handleLogout();
    setProfileMenuOpen(false);
    navigate("/login");
  };

  const handleClearChat = () => {
    setChatMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleAISubmit = async () => {
    if (!aiQuery.trim()) return;

    const userMessage = {
      type: "user",
      content: aiQuery,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Format previous messages for context
    const previousMessages = chatMessages.map((msg) => ({
      role: msg.type === "user" ? "user" : "assistant",
      content: msg.content,
    }));

    setChatMessages((prev) => [...prev, userMessage]);
    setAIQuery("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://api.perplexity.ai/chat/completions",
        {
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
                content:
                  "You are a helpful AI assistant for SyncOps, a project management and collaboration platform. Provide concise, helpful responses to user queries.",
              },
              ...previousMessages,
              {
                role: "user",
                content: aiQuery,
              },
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = {
        type: "ai",
        content:
          data.choices?.[0]?.message?.content ||
          "No response generated. Please try again.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChatMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error with Perplexity API:", error);
      const errorResponse = {
        type: "ai",
        content:
          "Sorry, I couldn't process your request at the moment. Please try again later.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img
            src={logo || "/placeholder.svg"}
            alt="Logo"
            className="logo-image"
          />
          <span className="logo-text">SyncOps</span>
        </div>

        <div className="navbar-menu">
          <NavLink to="/dashboard" className="nav-link">
            Dashboard
          </NavLink>
          <NavLink to="/projects" className="nav-link">
            Projects
          </NavLink>
          <NavLink to="/tasks" className="nav-link">
            Tasks
          </NavLink>
          <NavLink to="/analytics" className="nav-link">
            Analytics
          </NavLink>
          <NavLink to="/resources" className="nav-link">
            Resources
          </NavLink>
          <NavLink to="/chatroom" className="nav-link">
            Chat
          </NavLink>
        </div>

        <div className="navbar-actions">
          <SearchBar />

          <button className="ai-assistant-button" onClick={toggleAIAssistant}>
            <svg
              className="ai-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h11M9 21V3M4 14l5 5m0-5l-5-5"
              />
            </svg>
            AI
          </button>

          <ProfileMenu
            isLoggedIn={isLoggedIn}
            isProfileMenuOpen={isProfileMenuOpen}
            toggleProfileMenu={toggleProfileMenu}
            handleSignOut={handleSignOut}
            userType={userType}
          />
        </div>
      </div>

      <AIModal
        isOpen={isAIAssistantOpen}
        onClose={toggleAIAssistant}
        chatMessages={chatMessages}
        aiQuery={aiQuery}
        setAIQuery={setAIQuery}
        handleAISubmit={handleAISubmit}
        isLoading={isLoading}
        chatContainerRef={chatContainerRef}
        handleClearChat={handleClearChat}
      />
    </nav>
  );
};

export default Navbar;
