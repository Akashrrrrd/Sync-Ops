import React, { useState } from 'react';
import './ContentAnonymizer.css';

const ContentAnonymizer = () => {
  const [inputText, setInputText] = useState('');
  const [anonymizedText, setAnonymizedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = 'AIzaSyCFtYlPZVjqZuE6si1piEshIVbFmBfLy7g'; // Replace with your actual API key

  const anonymizeContent = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to anonymize');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Please anonymize the following text by replacing all sensitive information (including names, email addresses, phone numbers, physical addresses, dates, identification numbers, and other personal information) with appropriate descriptive placeholders in square brackets. Maintain the original structure and context of the text. Here's the text to anonymize:\n\n${inputText}`
              }]
            }],
            generationConfig: {
              temperature: 0.3,
              topK: 1,
              topP: 1,
              maxOutputTokens: 1024,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        setAnonymizedText(data.candidates[0].content.parts[0].text);
        setError('');
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (err) {
      console.error('Anonymization error:', err);
      setError('Failed to anonymize content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="anonymizer-container">
      <div className="anonymizer-header">
        <div className="logo">
          <span className="logo-icon">🔒</span>
          <h1 className="anonymizer-title">AI-Powered Content Anonymizer</h1>
        </div>
        <p className="anonymizer-description">
          Protect sensitive information using advanced AI technology
        </p>
      </div>

      <div className="anonymizer-content">
        <div className="input-group">
          <label htmlFor="input-text" className="input-label">
            Enter Text to Anonymize:
          </label>
          <textarea
            id="input-text"
            className="anonymizer-input"
            placeholder="Type or paste your text here. For example:
John Doe works at Tech Corp.
Email: john.doe@techcorp.com
Phone: (555) 123-4567"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={6}
          />
        </div>

        <button
          className={`anonymizer-button ${isLoading ? 'loading' : ''}`}
          onClick={anonymizeContent}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="button-content">
              <span className="loading-text">Processing with AI</span>
              <div className="loading-dots">
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          ) : (
            'Anonymize Content'
          )}
        </button>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {anonymizedText && (
          <div className="output-section">
            <div className="output-header">
              <h2 className="output-title">Anonymized Content</h2>
              <button 
                className="copy-button"
                onClick={() => {
                  navigator.clipboard.writeText(anonymizedText);
                  alert('Copied to clipboard!');
                }}
              >
                <span>📋</span> Copy
              </button>
            </div>
            <div className="output-content">
              <p>{anonymizedText}</p>
            </div>
          </div>
        )}

        <div className="info-section">
          <p>This tool can anonymize:</p>
          <ul>
            <li>Names and titles</li>
            <li>Email addresses</li>
            <li>Phone numbers</li>
            <li>Physical addresses</li>
            <li>Dates and timestamps</li>
            <li>Identification numbers</li>
            <li>Company names</li>
            <li>Other sensitive information</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContentAnonymizer;