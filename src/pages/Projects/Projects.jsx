import React, { useState, useEffect } from "react";
import "./Projects.css";
import { FiSearch, FiSun, FiMoon } from "react-icons/fi";
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

const Projects = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "AI Chatbot Integration Application",
      status: "Ongoing",
      deadline: "2024-11-25",
      progress: 65,
      team: ["Alice", "Bob", "Charlie"],
    },
    {
      id: 2,
      name: "Blockchain Payment System",
      status: "Completed",
      deadline: "2024-09-15",
      progress: 100,
      team: ["David", "Eve", "Frank"],
    },
    {
      id: 3,
      name: "Real-time Data Analytics Platform",
      status: "Ongoing",
      deadline: "2024-12-01",
      progress: 45,
      team: ["Grace", "Hannah", "Isaac"],
    },
    {
      id: 4,
      name: "E-commerce Platform Redesign",
      status: "Ongoing",
      deadline: "2024-10-15",
      progress: 30,
      team: ["Jack", "Kelly", "Liam"],
    },
    {
      id: 5,
      name: "Mobile Banking App",
      status: "Completed",
      deadline: "2024-08-30",
      progress: 100,
      team: ["Mia", "Noah", "Olivia"],
    },
    {
      id: 6,
      name: "Cloud Storage Integration System",
      status: "Ongoing",
      deadline: "2024-12-20",
      progress: 50,
      team: ["Paul", "Quincy", "Rachel"],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [newProject, setNewProject] = useState({
    id: null,
    name: "",
    status: "Ongoing",
    deadline: "",
    progress: 0,
    team: [],
  });
  const [newTeamMember, setNewTeamMember] = useState(""); // Store new team member input

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProject = () => {
    setShowModal(true);
    setNewProject({
      id: projects.length + 1,
      name: "",
      status: "Ongoing",
      deadline: "",
      progress: 0,
      team: [],
    });
    setNewTeamMember(""); // Clear new team member input
    setIsEditing(false);
  };

  const handleEditProject = (project) => {
    setShowModal(true);
    setIsEditing(true);
    setCurrentProject(project.id);
    setNewProject({ ...project });
  };

  const handleSaveProject = () => {
    if (isEditing) {
      setProjects(
        projects.map((project) =>
          project.id === currentProject ? newProject : project
        )
      );
    } else {
      setProjects([...projects, newProject]);
    }
    setShowModal(false);
  };

  const handleDeleteProject = (id) => {
    setProjects(projects.filter((project) => project.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({
      ...newProject,
      [name]: value,
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleAddTeamMember = () => {
    if (newTeamMember && !newProject.team.includes(newTeamMember)) {
      setNewProject({
        ...newProject,
        team: [...newProject.team, newTeamMember],
      });
      setNewTeamMember(""); // Clear input after adding
    }
  };

  const handleRemoveTeamMember = (member) => {
    setNewProject({
      ...newProject,
      team: newProject.team.filter((teamMember) => teamMember !== member),
    });
  };

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>Projects Management</h1>
        <p>Manage your ongoing and completed projects in real-time.</p>
      </div>

      <div className="projects-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search Projects"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FiSearch className="search-icon" />
        </div>
        <div className="toolbar-actions">
          <button className="add-project-btn" onClick={handleAddProject}>
            <AiOutlinePlus /> Add Project
          </button>
          {/* <button className="toggle-theme-btn" onClick={toggleDarkMode}>
            {isDarkMode ? <FiSun /> : <FiMoon />}
          </button> */}
        </div>
      </div>

      <div className="projects-list">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div className="project-card" key={project.id}>
              <div className="project-header">
                <h3>{project.name}</h3>
                <div className={`status ${project.status.toLowerCase()}`}>
                  {project.status}
                </div>
              </div>
              <div className="project-info">
                <p>Deadline: {project.deadline}</p>
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <p>{project.progress}% Completed</p>
              </div>
              <div className="team-info">
                <h4>Team:</h4>
                <ul>
                  {project.team.map((member, index) => (
                    <li key={index}>{member}</li>
                  ))}
                </ul>
              </div>
              <div className="project-actions">
                <button
                  className="action-btn edit-btn"
                  onClick={() => handleEditProject(project)}
                >
                  <AiOutlineEdit /> Edit
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  <AiOutlineDelete /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No projects found.</p>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>{isEditing ? "Edit Project" : "Add Project"}</h2>
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                name="name"
                value={newProject.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={newProject.status}
                onChange={handleInputChange}
              >
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <input
                type="date"
                name="deadline"
                value={newProject.deadline}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Progress</label>
              <input
                type="number"
                name="progress"
                value={newProject.progress}
                onChange={handleInputChange}
                min="0"
                max="100"
              />
            </div>
            <div className="form-group">
              <label>Team Members</label>
              <div className="team-input">
                <input
                  type="text"
                  value={newTeamMember}
                  onChange={(e) => setNewTeamMember(e.target.value)}
                  placeholder="Add team member"
                />
                <button
                  className="add-team-member-btn"
                  onClick={handleAddTeamMember}
                >
                  Add
                </button>
              </div>
              <ul className="team-list">
                {newProject.team.map((member, index) => (
                  <li key={index}>
                    {member}{" "}
                    <button
                      className="remove-team-member-btn"
                      onClick={() => handleRemoveTeamMember(member)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="modal-actions">
              <button
                className="btn cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="btn submit-btn" onClick={handleSaveProject}>
                {isEditing ? "Save Changes" : "Add Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
