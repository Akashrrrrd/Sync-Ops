import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Projects from "./pages/Projects/Projects";
import "./App.css";
import "./components/i18n/i18n";
import Tasks from "./pages/Tasks/Tasks";
import Analytics from "./pages/Analytics/Analytics";
import Resources from "./pages/Resources/Resources";
import Login from "./components/Login/Login";
import ChatRoom from "./pages/ChatRoom/ChatRoom";
import Prompts from "./pages/Prompts/Prompts";
import Summarization from "./pages/Summarization/Summarization";
import ContentGeneration from "./pages/ContentGeneration/ContentGeneration";
import IdeaGeneration from "./pages/IdeaGeneration/IdeaGeneration";
import ContentRewrite from "./pages/ContentRewrite/ContentRewrite";
import Translation from "./pages/Translation/Translation";
import FormFiller from "./pages/FormFiller/FormFiller";
import DataInsights from "./pages/DataInsights/DataInsights";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";
import FAQ from "./pages/FAQ/FAQ";
import AIFeedback from "./pages/AIFeedback/AIFeedback";
import AIWorkflow from "./pages/AIWorkflow/AIWorkflow";
import ContextualLearning from "./pages/ContextualLearning/ContextualLearning";
import ContentAnonymizer from "./pages/ContentAnonymizer/ContentAnonymizer";
import AIAccessibility from "./pages/AIAccessibility/AIAccessibility";

const App = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleLogin = () => {
    setIsLoggedIn(true); // Set login state to true after successful login
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Set login state to false after logout
  };

  return (
    <BrowserRouter>
      <div className="app">
        {isLoggedIn ? (
          <>
            <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
            <div className="app-container">
              <Sidebar
                isExpanded={isSidebarExpanded}
                toggleSidebar={toggleSidebar}
              />
              <div
                className={`main-content ${
                  isSidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed"
                }`}
              >
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/chatroom" element={<ChatRoom />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                  <Route path="/dynamic-prompts" element={<Prompts />} />
                  <Route path="/summarization" element={<Summarization />} />
                  <Route
                    path="/content-generation"
                    element={<ContentGeneration />}
                  />
                  <Route path="/idea-generation" element={<IdeaGeneration />} />
                  <Route path="/content-rewrite" element={<ContentRewrite />} />
                  <Route path="/translation" element={<Translation />} />
                  <Route
                    path="/intelligent-form-filler"
                    element={<FormFiller />}
                  />
                  <Route
                    path="/data-insights-generator"
                    element={<DataInsights />}
                  />
                  <Route path="/ai-feedback" element={<AIFeedback />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/help" element={<FAQ />} />
                  <Route path="/ai-workflow" element={<AIWorkflow />} />
                  <Route
                    path="/contextual-learning"
                    element={<ContextualLearning />}
                  />
                  <Route
                    path="/content-anonymizer"
                    element={<ContentAnonymizer />}
                  />
                  <Route
                    path="/accessibility-enhancer"
                    element={<AIAccessibility />}
                  />
                </Routes>
              </div>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;
