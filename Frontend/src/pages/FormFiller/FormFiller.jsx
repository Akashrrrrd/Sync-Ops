import React, { useState } from "react";
import "./FormFiller.css";

const FormFiller = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    company: "",
  });
  const [suggestions, setSuggestions] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Gemini API Key (embedded directly in the code)
  const GEMINI_API_KEY = 'AIzaSyBRlNfkdImoF0XMv-J5jKWcWCcpL6lKPVQ';

  // Validation patterns
  const validationPatterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?[\d\s-]{10,}$/,
  };

  const validateField = (name, value) => {
    if (!value) return "This field is required";
    
    switch (name) {
      case "email":
        return validationPatterns.email.test(value) ? "" : "Invalid email format";
      case "phone":
        return validationPatterns.phone.test(value) ? "" : "Invalid phone format";
      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    const error = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleFocus = (fieldName) => {
    setActiveField(fieldName);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  const handleAutofill = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: "Generate a professional profile with name, email, address, phone, and company. Format: Name: [Name], Email: [Email], Address: [Address], Phone: [Phone], Company: [Company]"
            }]
          }]
        })
      });

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;

      // Parse the generated text
      const profileDetails = parseGeneratedProfile(generatedText);
      
      setFormData(profileDetails);
      setSuggestions({});
      setValidationErrors({});
      
      setSubmitStatus("success");
      setTimeout(() => setSubmitStatus(null), 2000);
    } catch (error) {
      console.error("Autofill error:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(null), 2000);
    }
    setIsLoading(false);
  };

  const parseGeneratedProfile = (text) => {
    const defaultProfile = {
      name: "John Doe",
      email: "john.doe@example.com",
      address: "123 Tech Lane, San Francisco, CA 94105",
      phone: "+1 (555) 123-4567",
      company: "Tech Innovations Inc."
    };

    try {
      const profileData = {};
      const fields = ['Name', 'Email', 'Address', 'Phone', 'Company'];
      
      fields.forEach(field => {
        const regex = new RegExp(`${field}:\\s*([^,\\n]+)`, 'i');
        const match = text.match(regex);
        profileData[field.toLowerCase()] = match ? match[1].trim() : defaultProfile[field.toLowerCase()];
      });

      return profileData;
    } catch (error) {
      console.error("Profile parsing error:", error);
      return defaultProfile;
    }
  };

  const handleSuggest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: "Generate an alternative professional profile. Format: Name: [Name], Email: [Email], Address: [Address], Phone: [Phone], Company: [Company]"
            }]
          }]
        })
      });

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      
      const suggestedProfile = parseGeneratedProfile(generatedText);
      setSuggestions(suggestedProfile);
    } catch (error) {
      console.error("Suggestions error:", error);
    }
    setIsLoading(false);
  };

  const applySuggestion = (key) => {
    if (suggestions[key]) {
      setFormData(prev => ({ ...prev, [key]: suggestions[key] }));
      setSuggestions(prev => ({ ...prev, [key]: null }));
    }
  };

  const clearForm = () => {
    setFormData({
      name: "",
      email: "",
      address: "",
      phone: "",
      company: "",
    });
    setSuggestions({});
    setValidationErrors({});
    setSubmitStatus(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) errors[key] = error;
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(null), 2000);
      return;
    }

    setSubmitStatus("success");
    setTimeout(() => setSubmitStatus(null), 2000);
  };

  return (
    <div className="form-filler-container">
      <div className="form-header">
        <h1>Smart Form Filler</h1>
        <p>Experience AI-powered form filling with Gemini</p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        {Object.keys(formData).map((key) => (
          <div key={key} className="form-group">
            <label className="filler-label" htmlFor={key} >
              {key.charAt(0).toUpperCase() + key.slice(1)}
              <span className="required">*</span>
            </label>
            <div className={`input-wrapper ${activeField === key ? 'active' : ''} ${validationErrors[key] ? 'error' : ''}`}>
              <input
                type="text"
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleInputChange}
                onFocus={() => handleFocus(key)}
                onBlur={handleBlur}
                placeholder={`Enter your ${key.toLowerCase()}`}
                className={suggestions[key] ? 'has-suggestion' : ''}
              />
              {suggestions[key] && (
                <button
                  type="button"
                  className="suggestion-button"
                  onClick={() => applySuggestion(key)}
                >
                  Use Suggestion
                </button>
              )}
            </div>
            {validationErrors[key] && (
              <span className="error-message">{validationErrors[key]}</span>
            )}
          </div>
        ))}

        <div className="form-actions">
          <button
            type="button"
            className={`action-button autofill ${isLoading ? 'loading' : ''}`}
            onClick={handleAutofill}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Auto-Fill Form'}
          </button>
          <button
            type="button"
            className={`action-button suggest ${isLoading ? 'loading' : ''}`}
            onClick={handleSuggest}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Get Suggestions'}
          </button>
          <button
            type="button"
            className="action-button clear"
            onClick={clearForm}
          >
            Clear All
          </button>
        </div>

        <button 
          type="submit" 
          className={`submit-button ${submitStatus || ''}`}
          disabled={isLoading}
        >
          Submit Form
        </button>
      </form>

      {submitStatus && (
        <div className={`status-message ${submitStatus}`}>
          {submitStatus === 'success' ? 'Form submitted successfully!' : 'Please fix the errors above.'}
        </div>
      )}
    </div>
  );
};

export default FormFiller;