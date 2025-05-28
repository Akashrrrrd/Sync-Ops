import React, { useState, useRef, useEffect } from "react";
import "./AIFeedback.css";

// Advanced AI Mock Services
const AIServices = {
  analyzeSentiment: (text) => {
    const sentimentKeywords = {
      positive: ["good", "great", "excellent", "amazing", "love", "improve"],
      negative: [
        "bad",
        "terrible",
        "worst",
        "horrible",
        "disappointing",
        "issue",
      ],
    };

    const calculateSentiment = (text) => {
      const lowerText = text.toLowerCase();
      const positiveScore = sentimentKeywords.positive.filter((word) =>
        lowerText.includes(word)
      ).length;
      const negativeScore = sentimentKeywords.negative.filter((word) =>
        lowerText.includes(word)
      ).length;

      if (positiveScore > negativeScore) return "Positive";
      if (negativeScore > positiveScore) return "Negative";
      return "Neutral";
    };

    return {
      sentiment: calculateSentiment(text),
      toxicity: Math.random() < 0.2 ? "High" : "Low",
      complexity: text.split(/\s+/).length > 50 ? "Complex" : "Simple",
    };
  },

  suggestImprovements: (text) => {
    const improvements = [
      "Consider providing more specific details",
      "Your feedback could benefit from concrete examples",
      "Try to elaborate on the key points",
      "Clarify the context of your concern",
    ];

    return improvements[Math.floor(Math.random() * improvements.length)];
  },

  predictCategory: (text) => {
    const categories = [
      "Product Feedback",
      "User Experience",
      "Technical Support",
      "Feature Request",
      "Performance Improvement",
    ];

    return categories[Math.floor(Math.random() * categories.length)];
  },
};

const AIFeedback = () => {
  const [aiState, setAIState] = useState({
    feedback: "",
    response: null,
    analysis: null,
    isLoading: false,
    error: null,
    attachments: [],
    aiInsights: null,
  });

  const fileInputRef = useRef(null);

  const updateState = (updates) => {
    setAIState((prev) => ({ ...prev, ...updates }));
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    const { feedback } = aiState;

    if (!feedback.trim()) return;

    updateState({
      isLoading: true,
      error: null,
      aiInsights: null,
    });

    try {
      // Simulate AI processing
      const aiAnalysis = AIServices.analyzeSentiment(feedback);
      const aiCategory = AIServices.predictCategory(feedback);
      const aiSuggestion = AIServices.suggestImprovements(feedback);

      const simulatedResponse = await new Promise((resolve) =>
        setTimeout(() => {
          resolve({
            analysis: aiAnalysis,
            category: aiCategory,
            suggestion: aiSuggestion,
          });
        }, 2000)
      );

      updateState({
        isLoading: false,
        aiInsights: simulatedResponse,
        feedback: "",
        response: "AI has processed your feedback and generated insights.",
      });
    } catch (error) {
      updateState({
        isLoading: false,
        error: "AI processing failed. Please try again.",
      });
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) =>
      ["image/jpeg", "image/png", "application/pdf"].includes(file.type)
    );

    updateState({
      attachments: [
        ...aiState.attachments,
        ...validFiles.map((file) => ({
          file,
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : null,
        })),
      ],
    });
  };

  return (
    <div className="ai-feedback-container">
      <div className="ai-feedback-wrapper">
        <header className="ai-feedback-header">
          <h1 className="ai-feedback-title">AI Insight Generator</h1>
          <p className="ai-feedback-description">
            Leverage AI to transform your feedback into actionable insights
          </p>
        </header>

        <form onSubmit={handleFeedbackSubmit} className="ai-feedback-form">
          <textarea
            className="ai-feedback-textarea"
            placeholder="Share your thoughts for AI-powered analysis..."
            value={aiState.feedback}
            onChange={(e) => updateState({ feedback: e.target.value })}
          />

          <div className="ai-attachment-section">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              hidden
              accept=".jpg,.jpeg,.png,.pdf"
            />
            <button
              type="button"
              className="ai-attachment-button"
              onClick={() => fileInputRef.current.click()}
            >
              🔗 Attach Files
            </button>
          </div>

          <button
            type="submit"
            className="ai-submit-button"
            disabled={aiState.isLoading || !aiState.feedback.trim()}
          >
            {aiState.isLoading ? "AI Analyzing..." : "Generate AI Insights"}
          </button>
        </form>

        {aiState.aiInsights && (
          <div className="ai-insights-panel">
            <h3>AI Analysis</h3>
            <div className="ai-insights-grid">
              <div className="ai-insight-item">
                <strong>Sentiment:</strong>
                {aiState.aiInsights.analysis.sentiment}
              </div>
              <div className="ai-insight-item">
                <strong>Category:</strong>
                {aiState.aiInsights.category}
              </div>
              <div className="ai-insight-item">
                <strong>Complexity:</strong>
                {aiState.aiInsights.analysis.complexity}
              </div>
            </div>
            <div className="ai-suggestion-panel">
              <h4>AI Suggestion</h4>
              <p>{aiState.aiInsights.suggestion}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIFeedback;
