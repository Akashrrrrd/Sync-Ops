import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaRobot, // AI Icon for Dynamic Prompts
  FaTextWidth, // For Summarization
  FaLanguage, // For Translation
  FaPen, // For Write API
  FaSync, // For Content Rewrite
  FaRegLightbulb, // For Idea Generation (optional new feature)
  FaClipboardList,
  FaChartLine,
  FaBrain,
  FaUserSecret,
  FaMicrophoneAlt,
  FaUniversalAccess,
  FaCommentDots,
  FaProjectDiagram,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
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
            <NavLink
              to={item.link}
              className="sidebar-link"
              activeClassName="active-link"
            >
              <span className="icon">{item.icon}</span>
              {isExpanded && <span className="label">{item.name}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
