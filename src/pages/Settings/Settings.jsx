// Settings.jsx
import React, { useState, useEffect } from "react";
import "./Settings.css";

const Settings = () => {
  const [preferences, setPreferences] = useState({
    theme: localStorage.getItem("theme") || "light",
    notifications: JSON.parse(localStorage.getItem("notifications")) ?? true,
    dataSharing: JSON.parse(localStorage.getItem("dataSharing")) ?? false,
    language: localStorage.getItem("language") || "English",
    fontSize: localStorage.getItem("fontSize") || "medium",
    autoSave: JSON.parse(localStorage.getItem("autoSave")) ?? true,
    sound: JSON.parse(localStorage.getItem("sound")) ?? true,
    timezone:
      localStorage.getItem("timezone") ||
      Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    // Apply theme on mount and change
    document.documentElement.setAttribute("data-theme", preferences.theme);
  }, [preferences.theme]);

  const handleToggle = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    setIsDirty(true);
  };

  const handleChange = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    setSaveStatus("saving");
    // Simulate API call
    setTimeout(() => {
      Object.entries(preferences).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      });
      setIsDirty(false);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 2000);
    }, 800);
  };

  const handleReset = () => {
    const defaultSettings = {
      theme: "light",
      notifications: true,
      dataSharing: false,
      language: "English",
      fontSize: "medium",
      autoSave: true,
      sound: true,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    setPreferences(defaultSettings);
    setIsDirty(true);
  };

  const timezones = [
    "UTC",
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Asia/Tokyo",
    "Australia/Sydney",
  ];

  return (
    <div className="settings-container">
      <header className="settings-header">
        <h1>Settings</h1>
        {isDirty && (
          <span className="unsaved-changes">You have unsaved changes</span>
        )}
      </header>

      <main className="settings-main">
        <section className="settings-section">
          <h2>Appearance</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label htmlFor="theme">Theme</label>
              <select
                id="theme"
                value={preferences.theme}
                onChange={(e) => handleChange("theme", e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>

            <div className="setting-item">
              <label htmlFor="fontSize">Font Size</label>
              <select
                id="fontSize"
                value={preferences.fontSize}
                onChange={(e) => handleChange("fontSize", e.target.value)}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h2>Preferences</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label htmlFor="notifications">Notifications</label>
              <div className="toggle-wrapper">
                <button
                  className={`toggle ${
                    preferences.notifications ? "active" : ""
                  }`}
                  onClick={() => handleToggle("notifications")}
                  aria-pressed={preferences.notifications}
                >
                  <span className="toggle-thumb"></span>
                  <span className="toggle-label">
                    {preferences.notifications ? "On" : "Off"}
                  </span>
                </button>
              </div>
            </div>

            <div className="setting-item">
              <label htmlFor="sound">Sound Effects</label>
              <div className="toggle-wrapper">
                <button
                  className={`toggle ${preferences.sound ? "active" : ""}`}
                  onClick={() => handleToggle("sound")}
                  aria-pressed={preferences.sound}
                >
                  <span className="toggle-thumb"></span>
                  <span className="toggle-label">
                    {preferences.sound ? "On" : "Off"}
                  </span>
                </button>
              </div>
            </div>

            <div className="setting-item">
              <label htmlFor="autoSave">Auto Save</label>
              <div className="toggle-wrapper">
                <button
                  className={`toggle ${preferences.autoSave ? "active" : ""}`}
                  onClick={() => handleToggle("autoSave")}
                  aria-pressed={preferences.autoSave}
                >
                  <span className="toggle-thumb"></span>
                  <span className="toggle-label">
                    {preferences.autoSave ? "On" : "Off"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h2>Privacy & Security</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label htmlFor="dataSharing">Data Analytics</label>
              <div className="toggle-wrapper">
                <button
                  className={`toggle ${
                    preferences.dataSharing ? "active" : ""
                  }`}
                  onClick={() => handleToggle("dataSharing")}
                  aria-pressed={preferences.dataSharing}
                >
                  <span className="toggle-thumb"></span>
                  <span className="toggle-label">
                    {preferences.dataSharing ? "On" : "Off"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h2>Regional</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label htmlFor="language">Language</label>
              <select
                id="language"
                value={preferences.language}
                onChange={(e) => handleChange("language", e.target.value)}
              >
                <option value="English">English</option>
                <option value="Spanish">Español</option>
                <option value="French">Français</option>
                <option value="German">Deutsch</option>
                <option value="Japanese">日本語</option>
                <option value="Chinese">中文</option>
              </select>
            </div>

            <div className="setting-item">
              <label htmlFor="timezone">Time Zone</label>
              <select
                id="timezone"
                value={preferences.timezone}
                onChange={(e) => handleChange("timezone", e.target.value)}
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>
      </main>

      <footer className="settings-footer">
        <button className="button secondary" onClick={handleReset}>
          Reset to Defaults
        </button>
        <button
          className={`button primary ${saveStatus}`}
          onClick={handleSave}
          disabled={!isDirty || saveStatus === "saving"}
        >
          {saveStatus === "saving"
            ? "Saving..."
            : saveStatus === "saved"
            ? "Saved!"
            : "Save Changes"}
        </button>
      </footer>
    </div>
  );
};

export default Settings;
