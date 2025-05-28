"use client"

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FaBars,
  FaRobot, // AI Icon for Dynamic Prompts
  FaTextWidth, // For Summarization
  FaLanguage, // For Translation
  FaPen, // For Write API
  FaSync, // For Content Rewrite
  FaRegLightbulb, // For Idea Generation
  FaChartLine,
  FaBrain,
  FaUserSecret,
  FaMicrophoneAlt
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  // Check if a link is active based on the current path
  const isActive = (path) => {
    // Convert both to lowercase for case-insensitive comparison
    const currentPath = location.pathname.toLowerCase();
    path = path.toLowerCase();
    
    // Check if the current path matches the link path
    return currentPath === path;
  };

  useEffect(() => {
    document.body.style.setProperty(
      "--sidebar-width",
      isExpanded ? "240px" : "70px"
    );
  }, [isExpanded]);

  const sidebarItems = [
    {
      icon: <FaRobot />,
      name: "Dynamic Prompts",
      link: "/dynamic-prompts",
    },
    {
      icon: <FaPen />,
      name: "Content Generation",
      link: "/content-generation",
    },
    {
      icon: <FaSync />,
      name: "Content Rewrite",
      link: "/content-rewrite",
    },
    {
      icon: <FaTextWidth />,
      name: "Summarization",
      link: "/summarization",
    },
    {
      icon: <FaLanguage />,
      name: "Translation",
      link: "/translation",
    },
    {
      icon: <FaRegLightbulb />,
      name: "Idea Generation",
      link: "/idea-generation",
    },
    {
      icon: <FaChartLine />,
      name: "Data Insights",
      link: "/data-insights-generator",
    },
    {
      icon: <FaBrain />,
      name: "Contextual Learning",
      link: "/contextual-learning",
    },
    {
      icon: <FaUserSecret />,
      name: "Content Anonymizer",
      link: "/content-anonymizer",
    },
    {
      icon: <FaMicrophoneAlt />,
      name: "VocalScript",
      link: "/vocal-script",
    },
  ];

  return (
    <nav className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
      <div className="sidebar-header">
        <button onClick={toggleSidebar} className="menu-button">
          <FaBars />
        </button>
      </div>
      <ul className="sidebar-list">
        {sidebarItems.map((item, index) => (
          <li key={index} className="sidebar-item">
            <Link
              to={item.link}
              className={`sidebar-link ${isActive(item.link) ? "active-link" : ""}`}
              data-title={item.name}
            >
              <span className="icon">{item.icon}</span>
              {isExpanded && <span className="label">{item.name}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;