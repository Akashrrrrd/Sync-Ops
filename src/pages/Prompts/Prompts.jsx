import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Prompts.css";

const Prompts = () => {
  const { t, i18n } = useTranslation();
  const [inputQuery, setInputQuery] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [suggestions] = useState([
    "How AI works",
    "What is machine learning?",
    "Explain deep learning",
    "Artificial Intelligence is the future",
    "Machine Learning helps in predictions",
  ]);

  // Hardcoded API key (not recommended for production)
  const GEMINI_API_KEY = "AIzaSyBRlNfkdImoF0XMv-J5jKWcWCcpL6lKPVQ";

  // Comprehensive manual translations
  const manualTranslations = {
    "how ai works": "Cómo funciona la IA",
    "what is machine learning?": "¿Qué es el aprendizaje automático?",
    "explain deep learning": "Explicar el aprendizaje profundo",
    "artificial intelligence is the future":
      "La inteligencia artificial es el futuro",
    "machine learning helps in predictions":
      "El aprendizaje automático ayuda en las predicciones",
  };

  // Enhanced language switch with animation
  const handleLanguageSwitch = useCallback(() => {
    const newLang = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(newLang);

    const container = document.querySelector(".prompts-container");
    container.classList.add("language-switch");
    setTimeout(() => container.classList.remove("language-switch"), 500);
  }, [i18n]);

  // Comprehensive query translation method
  const sendQuery = async () => {
    if (!inputQuery.trim()) {
      toast.error(t("Please enter a query"));
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);
    setResponseText("");

    try {
      // First, check manual translations
      const normalizedInput = inputQuery.trim().toLowerCase();
      const manualTranslation = manualTranslations[normalizedInput];

      if (manualTranslation) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setResponseText(manualTranslation);
        setSuccess(true);
        setLoading(false);
        toast.success(t("Translation found!"));
        return;
      }

      // Fallback to Gemini API for translation
      const targetLanguage = i18n.language === "en" ? "Spanish" : "English";

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Translate the following text to ${targetLanguage} in a clear and concise manner: "${inputQuery}"`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 200,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Translation request failed");
      }

      const data = await response.json();
      const translatedText = data.candidates[0].content.parts[0].text.trim();

      setResponseText(translatedText);
      setSuccess(true);
      toast.success(t("Translation successful!"));
    } catch (err) {
      console.error("Translation error", err);
      setError(t("Unable to translate. Please try a different query."));
      toast.error(t("Unable to translate. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  // Copy to clipboard functionality
  const handleCopyToClipboard = () => {
    if (responseText) {
      navigator.clipboard
        .writeText(responseText)
        .then(() => {
          toast.success(t("Text copied to clipboard!"));
        })
        .catch((err) => {
          toast.error(t("Failed to copy text"));
          console.error(err);
        });
    }
  };

  // Keyboard submission handler
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      sendQuery();
    }
  };

  // Suggestion click handler
  const handleSuggestionClick = (suggestion) => {
    setInputQuery(suggestion);
    setResponseText("");
    setError("");
  };

  // Reset states on input change
  useEffect(() => {
    setResponseText("");
    setError("");
    setSuccess(false);
  }, [inputQuery]);

  return (
    <div className="prompts-container">
      <ToastContainer />
      <div className="prompts-content">
        <h2 className="prompts-heading">💬 {t("AI Powered Assistance")}</h2>

        <div className="prompts-search-bar">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="prompts-search-input"
              placeholder={t("Search for tasks or content...")}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              aria-label={t("Query input")}
            />
          </div>
          <button
            className={`prompts-toggle-button ${loading ? "loading" : ""}`}
            onClick={sendQuery}
            disabled={loading}
            aria-label={t("Submit query")}
          >
            {loading ? "⏳" : t("Submit")}
          </button>
        </div>

        <div className="prompts-suggestions">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="suggestion-chip"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>

        {error && <div className="error-alert">⚠️ {error}</div>}

        {(responseText || loading) && (
          <div className="prompts-grid">
            <div className={`prompts-card ${loading ? "loading" : ""}`}>
              <h3 className="prompts-card-heading">{t("Response")}</h3>
              <p className="prompts-response">
                {loading ? t("Translating...") : responseText}
              </p>

              {/* Copy button */}
              <button
                className="copy-button"
                onClick={handleCopyToClipboard}
                disabled={loading || !responseText}
                aria-label={t("Copy to clipboard")}
              >
                📋 {t("Copy")}
              </button>
            </div>
          </div>
        )}

        <div className="prompts-language-toggle">
          <button
            className="language-switch-button"
            onClick={handleLanguageSwitch}
            aria-label={t("Switch language")}
          >
            🌐{" "}
            {i18n.language === "en" ? "Switch to Español" : "Switch to English"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Prompts;
