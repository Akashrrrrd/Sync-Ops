import React, { useState, useEffect } from "react";
import "./Resources.css";
import { FaFilePdf, FaVideo, FaLink, FaSearch, FaRobot } from "react-icons/fa";
import axios from "axios";

const resourceData = [
  {
    id: 1,
    title: "Project Plan",
    type: "Document",
    icon: <FaFilePdf />,
    url: "/path-to-document",
    description: "Comprehensive project plan document.",
    tags: ["planning", "documentation"],
    date: "2024-10-01",
  },
  {
    id: 2,
    title: "Introduction Video",
    type: "Video",
    icon: <FaVideo />,
    url: "/path-to-video",
    description: "Overview video about the project.",
    tags: ["video", "overview"],
    date: "2024-10-05",
  },
  {
    id: 3,
    title: "Design Guidelines",
    type: "Document",
    icon: <FaFilePdf />,
    url: "/path-to-design-guidelines",
    description: "UI/UX guidelines for the project.",
    tags: ["design", "UI/UX"],
    date: "2024-09-28",
  },
  {
    id: 4,
    title: "GitHub Repository",
    type: "Link",
    icon: <FaLink />,
    url: "https://github.com/project-repo",
    description: "Access the project’s GitHub repository.",
    tags: ["code", "repository"],
    date: "2024-10-02",
  },
  {
    id: 5,
    title: "Marketing Strategy",
    type: "Document",
    icon: <FaFilePdf />,
    url: "/path-to-marketing-strategy",
    description: "Document outlining the marketing strategy.",
    tags: ["marketing", "strategy"],
    date: "2024-09-25",
  },
  {
    id: 6,
    title: "Training Video",
    type: "Video",
    icon: <FaVideo />,
    url: "/path-to-training-video",
    description: "Recorded training session for the team.",
    tags: ["training", "video"],
    date: "2024-10-03",
  },
  {
    id: 7,
    title: "User Manual",
    type: "Document",
    icon: <FaFilePdf />,
    url: "/path-to-user-manual",
    description: "User manual for the application.",
    tags: ["manual", "documentation"],
    date: "2024-09-29",
  },
  {
    id: 8,
    title: "Feedback Form",
    type: "Link",
    icon: <FaLink />,
    url: "/path-to-feedback-form",
    description: "Link to the project feedback form.",
    tags: ["feedback", "survey"],
    date: "2024-10-04",
  },
  {
    id: 9,
    title: "Sprint Review",
    type: "Document",
    icon: <FaFilePdf />,
    url: "/path-to-sprint-review",
    description: "Document summarizing the sprint review.",
    tags: ["sprint", "review"],
    date: "2024-10-06",
  },
  {
    id: 10,
    title: "Team Meeting Notes",
    type: "Document",
    icon: <FaFilePdf />,
    url: "/path-to-meeting-notes",
    description: "Notes from the last team meeting.",
    tags: ["meeting", "notes"],
    date: "2024-10-07",
  },
  {
    id: 11,
    title: "Code Review Guidelines",
    type: "Document",
    icon: <FaFilePdf />,
    url: "/path-to-code-review-guidelines",
    description: "Guidelines for conducting code reviews.",
    tags: ["code", "review", "guidelines"],
    date: "2024-10-08",
  },
  {
    id: 12,
    title: "Project Timeline",
    type: "Document",
    icon: <FaFilePdf />,
    url: "/path-to-project-timeline",
    description: "Visual representation of the project timeline.",
    tags: ["timeline", "planning"],
    date: "2024-10-09",
  },
];

const Resources = () => {
  const [resources, setResources] = useState(resourceData);
  const [selectedType, setSelectedType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeResource, setActiveResource] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const resourcesPerPage = 3;
  const [aiContent, setAiContent] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAIContent = async (text) => {
    setLoading(true);

    const apiKey = "AIzaSyAD7SX12L7hFHWZrgqx1RtRRcc3cTjZHCE"; // Use your actual API Key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const data = {
      contents: [
        {
          parts: [{ text }], // Use the resource title or description as input
        },
      ],
    };

    try {
      const response = await axios.post(url, data, {
        headers: { "Content-Type": "application/json" },
      });
      const result = response.data;
      if (result && result.contents && result.contents[0].parts[0].text) {
        setAiContent(result.contents[0].parts[0].text);
      } else {
        setAiContent("Unable to generate content.");
      }
    } catch (error) {
      console.error("Error fetching AI content:", error);
      setAiContent("Error fetching content.");
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredResources = resources.filter((resource) => {
    const matchesType =
      selectedType === "All" || resource.type === selectedType;
    const matchesSearch = resource.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedResources = filteredResources.slice(
    (currentPage - 1) * resourcesPerPage,
    currentPage * resourcesPerPage
  );

  // Handle modal opening
  const openResourceModal = (resource) => {
    setActiveResource(resource);
    fetchAIContent(resource.description); // Fetch AI content for the selected resource
  };

  // Handle modal closing
  const closeResourceModal = () => {
    setActiveResource(null);
    setAiContent(null); // Reset AI content when closing modal
  };

  return (
    <div className="re-resources-container">
      <h1 className="re-resources-title">Project Resources</h1>

      {/* Filter and Search Section */}
      <div className="re-resources-filter">
        <div className="re-search-container">
          <FaSearch className="re-search-icon" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="re-search-bar"
          />
        </div>

        <div className="re-filter-buttons">
          <button
            className={`re-filter-button ${
              selectedType === "All" ? "re-active" : ""
            }`}
            onClick={() => setSelectedType("All")}
          >
            All
          </button>
          <button
            className={`re-filter-button ${
              selectedType === "Document" ? "re-active" : ""
            }`}
            onClick={() => setSelectedType("Document")}
          >
            Documents
          </button>
          <button
            className={`re-filter-button ${
              selectedType === "Video" ? "re-active" : ""
            }`}
            onClick={() => setSelectedType("Video")}
          >
            Videos
          </button>
          <button
            className={`re-filter-button ${
              selectedType === "Link" ? "re-active" : ""
            }`}
            onClick={() => setSelectedType("Link")}
          >
            Links
          </button>
        </div>
      </div>

      {/* Resource Cards Section */}
      <div className="re-resources-grid">
        {paginatedResources.map((resource) => (
          <div
            key={resource.id}
            className="re-resource-card"
            onClick={() => openResourceModal(resource)}
          >
            <div className="re-resource-icon">{resource.icon}</div>
            <h3 className="re-resource-title">{resource.title}</h3>
            <p className="re-resource-description">{resource.description}</p>
            <p className="re-resource-date">
              {new Date(resource.date).toLocaleDateString()}
            </p>
            <div className="re-tags">
              {resource.tags.map((tag, index) => (
                <span key={index} className="re-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="re-pagination">
        {Array.from({
          length: Math.ceil(filteredResources.length / resourcesPerPage),
        }).map((_, index) => (
          <button
            key={index}
            className={`re-page-button ${
              currentPage === index + 1 ? "re-active" : ""
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Resource Modal */}
      {activeResource && (
        <div className="re-resource-modal">
          <div className="re-modal-content">
            <button className="re-close-modal" onClick={closeResourceModal}>
              X
            </button>
            <div className="re-modal-icon">{activeResource.icon}</div>
            <h3 className="re-modal-title">{activeResource.title}</h3>
            <p className="re-modal-description">{activeResource.description}</p>
            {aiContent && (
              <div className="re-ai-content">
                <h4>AI-generated content:</h4>
                <p>{aiContent}</p>
              </div>
            )}
            <a
              href={activeResource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="re-modal-link"
            >
              {activeResource.type === "Document" ? "Download" : "Access"}{" "}
              {activeResource.type}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
