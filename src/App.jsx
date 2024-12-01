import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleLogin = (role = "user") => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <BrowserRouter>
      <div className="app">
        {isLoggedIn ? (
          <>
            <Navbar
              isLoggedIn={isLoggedIn}
              handleLogout={handleLogout}
              userRole={userRole}
            />
            <div className="app-container">
              <Sidebar
                isExpanded={isSidebarExpanded}
                toggleSidebar={toggleSidebar}
                userRole={userRole}
              />
              <div
                className={`main-content ${
                  isSidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed"
                }`}
              >
                <Routes>
                  <Route
                    path="/dashboard"
                    element={<Dashboard userRole={userRole} />}
                  />
                  <Route
                    path="/projects"
                    element={<Projects userRole={userRole} />}
                  />
                  <Route
                    path="/tasks"
                    element={<Tasks userRole={userRole} />}
                  />
                  <Route
                    path="/analytics"
                    element={<Analytics userRole={userRole} />}
                  />
                  <Route
                    path="/resources"
                    element={<Resources userRole={userRole} />}
                  />
                  <Route
                    path="/chatroom"
                    element={<ChatRoom userRole={userRole} />}
                  />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                  <Route
                    path="/dynamic-prompts"
                    element={<Prompts userRole={userRole} />}
                  />
                  <Route
                    path="/summarization"
                    element={<Summarization userRole={userRole} />}
                  />
                  <Route
                    path="/content-generation"
                    element={<ContentGeneration userRole={userRole} />}
                  />
                  <Route
                    path="/idea-generation"
                    element={<IdeaGeneration userRole={userRole} />}
                  />
                  <Route
                    path="/content-rewrite"
                    element={<ContentRewrite userRole={userRole} />}
                  />
                  <Route
                    path="/translation"
                    element={<Translation userRole={userRole} />}
                  />
                  <Route
                    path="/intelligent-form-filler"
                    element={<FormFiller userRole={userRole} />}
                  />
                  <Route
                    path="/data-insights-generator"
                    element={<DataInsights userRole={userRole} />}
                  />
                  <Route
                    path="/ai-feedback"
                    element={<AIFeedback userRole={userRole} />}
                  />
                  <Route
                    path="/profile"
                    element={<Profile userRole={userRole} />}
                  />
                  <Route
                    path="/settings"
                    element={<Settings userRole={userRole} />}
                  />
                  <Route path="/help" element={<FAQ userRole={userRole} />} />
                  <Route
                    path="/ai-workflow"
                    element={<AIWorkflow userRole={userRole} />}
                  />
                  <Route
                    path="/contextual-learning"
                    element={<ContextualLearning userRole={userRole} />}
                  />
                  <Route
                    path="/content-anonymizer"
                    element={<ContentAnonymizer userRole={userRole} />}
                  />
                  <Route
                    path="/vocal-script"
                    element={<AIAccessibility userRole={userRole} />}
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
