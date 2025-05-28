import React, { useState, useEffect, useCallback } from "react";
import './FAQ.css';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchFocus, setSearchFocus] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [recentSearches, setRecentSearches] = useState([]);
  const [helpfulCounts, setHelpfulCounts] = useState({});
  const [relatedQuestions, setRelatedQuestions] = useState([]);

  const categories = [
    { id: "all", label: "All Questions", icon: "🔍" },
    { id: "getting-started", label: "Getting Started", icon: "🚀" },
    { id: "features", label: "Features", icon: "⚡" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "integration", label: "Integration", icon: "🔄" },
    { id: "billing", label: "Billing", icon: "💳" },
  ];

  const faqs = [
    {
      id: 1,
      category: "getting-started",
      question: "What is SyncOps and how can it benefit my workflow?",
      answer: `SyncOps is a comprehensive AI-powered platform that revolutionizes your workflow through:

• Intelligent Content Generation
• Advanced Translation Services
• Real-time Collaboration Tools
• Automated Data Processing

Our platform reduces manual work by up to 60% and improves content quality by leveraging cutting-edge AI technology.`,
      tags: ["basics", "introduction"],
      relatedIds: [2, 3],
    },
    {
      id: 2,
      category: "features",
      question:
        "How does the Dynamic Prompts feature enhance content creation?",
      answer: `Dynamic Prompts is our flagship feature that uses contextual AI to:

1. Analyze your writing style and tone
2. Generate personalized suggestions
3. Adapt to your specific industry needs
4. Learn from your preferences over time

This results in more relevant and effective content generation, saving you valuable time while maintaining consistency.`,
      tags: ["ai", "content"],
      relatedIds: [1, 4],
    },
    {
      id: 3,
      category: "features",
      question: "What makes Content Rewrite different from other tools?",
      answer: `Content Rewrite stands out through its:

• Context-aware rewriting algorithms
• Tone and style preservation
• Multi-language support
• SEO optimization capabilities

Unlike traditional tools, it maintains the original message while improving clarity and engagement.`,
      tags: ["content", "optimization"],
      relatedIds: [2, 5],
    },
    {
      id: 4,
      category: "integration",
      question: "How can I integrate external AI APIs with SyncOps?",
      answer: `Integration with external APIs is straightforward:

1. Access the Integration Dashboard
2. Select "Add New Integration"
3. Choose from our supported API providers
4. Enter your API credentials
5. Configure preferences and permissions

We support major AI providers including OpenAI, Google AI, and Azure Cognitive Services.`,
      tags: ["technical", "api"],
      relatedIds: [6, 7],
    },
    {
      id: 5,
      category: "security",
      question: "What security measures does SyncOps implement?",
      answer: `We maintain enterprise-grade security through:

• End-to-end encryption (AES-256)
• Regular security audits
• SOC 2 Type II compliance
• GDPR compliance
• Multi-factor authentication
• Role-based access control

Your data is encrypted both in transit and at rest, with regular backups stored in secure locations.`,
      tags: ["security", "compliance"],
      relatedIds: [8, 9],
    },
    {
      id: 6,
      category: "features",
      question: "What languages are supported for Translation?",
      answer: `Our Translation feature supports:

• 100+ languages for text translation
• 50+ languages for real-time translation
• 30+ languages for document translation
• 20+ languages for audio translation

All translations maintain context and nuance through our advanced NLP models.`,
      tags: ["translation", "languages"],
      relatedIds: [3, 7],
    },
    {
      id: 7,
      category: "features",
      question: "How do I generate and customize data insight reports?",
      answer: `Generate comprehensive reports through these steps:

1. Select your data source
2. Choose visualization types
3. Set custom parameters
4. Apply filters and transformations
5. Export in multiple formats

Our AI automatically identifies trends and provides actionable insights.`,
      tags: ["analytics", "reporting"],
      relatedIds: [4, 8],
    },
  ];

  const handleSearch = useCallback((e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    updateRelatedQuestions(value);
  }, []);

  const updateRelatedQuestions = (search) => {
    if (search.length > 2) {
      const related = faqs
        .filter(
          (faq) =>
            faq.tags.some((tag) => tag.includes(search)) &&
            !faq.question.toLowerCase().includes(search)
        )
        .slice(0, 3);
      setRelatedQuestions(related);
    } else {
      setRelatedQuestions([]);
    }
  };

  const saveRecentSearch = (term) => {
    if (term.length > 2) {
      setRecentSearches((prev) => {
        const updated = [term, ...prev.filter((t) => t !== term)].slice(0, 5);
        return updated;
      });
    }
  };

  const toggleAnswer = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const markHelpful = (id) => {
    setHelpfulCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm) ||
      faq.answer.toLowerCase().includes(searchTerm) ||
      faq.tags.some((tag) => tag.includes(searchTerm));
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="faq-container">
      <div className="faq-header">
        <h1 className="faq-title">How can we help you?</h1>
        <p className="faq-subtitle">
          Search our knowledge base or browse categories below
        </p>
      </div>

      <div className={`search-section ${searchFocus ? "focused" : ""}`}>
        <div className="search-wrapper">
          <input
            type="text"
            className="faq-search"
            placeholder="Type your question here..."
            value={searchTerm}
            onChange={handleSearch}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => {
              setSearchFocus(false);
              saveRecentSearch(searchTerm);
            }}
          />
          {/* <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg> */}
        </div>

        {searchFocus && recentSearches.length > 0 && (
          <div className="recent-searches">
            <h3>Recent Searches</h3>
            {recentSearches.map((term, index) => (
              <button
                key={index}
                className="recent-search-item"
                onClick={() => setSearchTerm(term)}
              >
                {term}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="categories-section">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-button ${
              activeCategory === category.id ? "active" : ""
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      <div className="faq-content">
        <div className="faq-list">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div
                key={faq.id}
                className={`faq-item ${
                  expandedIndex === index ? "expanded" : ""
                }`}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleAnswer(index)}
                  aria-expanded={expandedIndex === index}
                >
                  <span className="question-text">{faq.question}</span>
                  <div className="question-meta">
                    {faq.tags.map((tag) => (
                      <span key={tag} className="question-tag">
                        {tag}
                      </span>
                    ))}
                    <span className="faq-toggle-icon"></span>
                  </div>
                </button>

                <div
                  className={`faq-answer-wrapper ${
                    expandedIndex === index ? "expanded" : ""
                  }`}
                >
                  <div className="faq-answer">
                    <div className="answer-content">{faq.answer}</div>
                    <div className="answer-footer">
                      <div className="helpful-section">
                        <span>Was this helpful?</span>
                        <button
                          className="helpful-button"
                          onClick={() => markHelpful(faq.id)}
                        >
                          👍 Yes{" "}
                          {helpfulCounts[faq.id]
                            ? `(${helpfulCounts[faq.id]})`
                            : ""}
                        </button>
                      </div>
                      {faq.relatedIds && (
                        <div className="related-questions">
                          <h4>Related Questions:</h4>
                          {faqs
                            .filter((f) => faq.relatedIds.includes(f.id))
                            .map((related) => (
                              <button
                                key={related.id}
                                className="related-question-link"
                                onClick={() => {
                                  const newIndex = filteredFaqs.findIndex(
                                    (f) => f.id === related.id
                                  );
                                  if (newIndex !== -1) {
                                    setExpandedIndex(newIndex);
                                  }
                                }}
                              >
                                {related.question}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="faq-no-results">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9l-6 6M9 9l6 6" />
              </svg>
              <p>No matching questions found</p>
              <span>
                Try adjusting your search terms or browsing categories
              </span>

              {relatedQuestions.length > 0 && (
                <div className="suggested-questions">
                  <h3>You might be interested in:</h3>
                  {relatedQuestions.map((question, index) => (
                    <button
                      key={index}
                      className="suggested-question"
                      onClick={() =>
                        setSearchTerm(question.question.toLowerCase())
                      }
                    >
                      {question.question}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
