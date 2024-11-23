import React, { useState } from "react";
import "./Profile.css";

const Profile = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Akash R",
    title: "Full Stack MERN Developer | AI Enthusiast",
    email: "akashr.ece2022@citchennai.com",
    phone: "+123 456 7890",
    about:
      "I'm a Full Stack Developer with a passion for AI and innovative web solutions. I specialize in MERN stack development, building scalable, dynamic web applications, and integrating AI-driven features into real-world solutions.",
    skills: [
      { id: 1, name: "React.js", level: 85 },
      { id: 2, name: "Node.js", level: 80 },
      { id: 3, name: "MongoDB", level: 75 },
      { id: 4, name: "AI / Machine Learning", level: 70 },
    ],
    projects: [
      {
        id: 1,
        title: "AI-Powered E-Commerce",
        description:
          "Created an AI-driven product recommendation system for an e-commerce platform using machine learning algorithms.",
        technologies: ["React", "Node.js", "MongoDB", "AI"],
      },
      {
        id: 2,
        title: "Real-Time Collaboration App",
        description:
          "A full-stack web app that integrates live chat, file sharing, and real-time collaboration features for remote teams.",
        technologies: ["React", "WebSockets", "Express", "MongoDB"],
      },
      {
        id: 3,
        title: "Smart Home Automation",
        description:
          "Developed a smart home management system that uses AI to optimize energy consumption and automate home devices.",
        technologies: ["React Native", "IoT", "Machine Learning"],
      },
    ],
    socialMedia: [
      {
        id: 1,
        platform: "LinkedIn",
        url: "https://www.linkedin.com/in/akashr",
        icon: "fab fa-linkedin-in",
      },
      {
        id: 2,
        platform: "GitHub",
        url: "https://github.com/akashr",
        icon: "fab fa-github",
      },
      {
        id: 3,
        platform: "Twitter",
        url: "https://twitter.com/akashr",
        icon: "fab fa-twitter",
      },
    ],
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("pro-dark-mode");
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...profileData.skills];
    updatedSkills[index] = { ...updatedSkills[index], [field]: value };
    setProfileData((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));
  };

  const addSkill = () => {
    const newSkill = {
      id: Date.now(),
      name: "New Skill",
      level: 50,
    };
    setProfileData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  };

  const deleteSkill = (id) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.id !== id),
    }));
  };

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...profileData.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setProfileData((prev) => ({
      ...prev,
      projects: updatedProjects,
    }));
  };

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      title: "New Project",
      description: "Project description",
      technologies: [],
    };
    setProfileData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  };

  const deleteProject = (id) => {
    setProfileData((prev) => ({
      ...prev,
      projects: prev.projects.filter((project) => project.id !== id),
    }));
  };

  const renderSkillProgressBar = (skill, index) => {
    return (
      <div className="pro-skill" key={skill.id}>
        {isEditing ? (
          <div className="pro-skill-edit">
            <input
              type="text"
              value={skill.name}
              onChange={(e) => handleSkillChange(index, "name", e.target.value)}
              className="pro-input pro-skill-name"
              placeholder="Skill Name"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={skill.level}
              onChange={(e) =>
                handleSkillChange(index, "level", parseInt(e.target.value))
              }
              className="pro-skill-range"
            />
            <button
              onClick={() => deleteSkill(skill.id)}
              className="pro-delete-btn"
            >
              Delete
            </button>
          </div>
        ) : (
          <>
            <div className="pro-skill-header">
              <label>{skill.name}</label>
              <span className="pro-skill-percentage">{skill.level}%</span>
            </div>
            <div className="pro-progress-bar">
              <div
                className="pro-progress-bar-fill"
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={`pro-profile-container ${darkMode ? "pro-dark" : ""}`}>
      <div className="pro-header">
        <div className="pro-theme-toggle">
          <button onClick={toggleDarkMode} className="pro-toggle-btn">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>

      <div className="pro-profile-header">
        <div className="pro-image-container">
          <img
            src="https://via.placeholder.com/250"
            alt="Profile"
            className="pro-profile-image"
          />
        </div>
        <div className="pro-info">
          {isEditing ? (
            <>
              <input
                type="text"
                className="pro-input"
                value={profileData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Name"
              />
              <input
                type="text"
                className="pro-input"
                value={profileData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Professional Title"
              />
            </>
          ) : (
            <>
              <h1 className="pro-name">{profileData.name}</h1>
              <p className="pro-title">{profileData.title}</p>
            </>
          )}
          <div className="pro-contact-info">
            {isEditing ? (
              <>
                <input
                  type="email"
                  className="pro-input"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Email"
                />
                <input
                  type="tel"
                  className="pro-input"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Phone"
                />
              </>
            ) : (
              <>
                <a
                  href={`mailto:${profileData.email}`}
                  className="pro-contact-link"
                >
                  <i className="fas fa-envelope"></i> {profileData.email}
                </a>
                <a
                  href={`tel:${profileData.phone}`}
                  className="pro-contact-link"
                >
                  <i className="fas fa-phone-alt"></i> {profileData.phone}
                </a>
              </>
            )}
          </div>
          <button onClick={handleEditToggle} className="pro-edit-btn">
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>
      </div>

      <div className="pro-profile-content">
        <section className="pro-about">
          <h2>About Me</h2>
          {isEditing ? (
            <textarea
              className="pro-input pro-textarea"
              value={profileData.about}
              onChange={(e) => handleInputChange("about", e.target.value)}
              placeholder="About Me"
            />
          ) : (
            <p>{profileData.about}</p>
          )}
        </section>

        <section className="pro-skills">
          <div className="pro-section-header">
            <h2>Skills</h2>
            {isEditing && (
              <button onClick={addSkill} className="pro-add-btn">
                Add Skill
              </button>
            )}
          </div>
          <div className="pro-skills-list">
            {profileData.skills.map(renderSkillProgressBar)}
          </div>
        </section>

        <section className="pro-projects">
          <div className="pro-section-header">
            <h2>Projects</h2>
            {isEditing && (
              <button onClick={addProject} className="pro-add-btn">
                Add Project
              </button>
            )}
          </div>
          <div className="pro-projects-list">
            {profileData.projects.map((project, index) => (
              <div className="pro-project" key={project.id}>
                {isEditing ? (
                  <div className="pro-project-edit">
                    <input
                      type="text"
                      className="pro-input"
                      value={project.title}
                      onChange={(e) =>
                        handleProjectChange(index, "title", e.target.value)
                      }
                      placeholder="Project Title"
                    />
                    <textarea
                      className="pro-input pro-textarea"
                      value={project.description}
                      onChange={(e) =>
                        handleProjectChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Project Description"
                    />
                    <div className="pro-project-technologies">
                      {project.technologies.map((tech, techIndex) => (
                        <input
                          key={techIndex}
                          type="text"
                          className="pro-input pro-tech-input"
                          value={tech}
                          onChange={(e) => {
                            const updatedTechs = [...project.technologies];
                            updatedTechs[techIndex] = e.target.value;
                            handleProjectChange(
                              index,
                              "technologies",
                              updatedTechs
                            );
                          }}
                          placeholder="Technology"
                        />
                      ))}
                      <button
                        onClick={() => {
                          const updatedTechs = [...project.technologies, ""];
                          handleProjectChange(
                            index,
                            "technologies",
                            updatedTechs
                          );
                        }}
                        className="pro-add-tech-btn"
                      >
                        Add Tech
                      </button>
                    </div>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="pro-delete-btn"
                    >
                      Delete Project
                    </button>
                  </div>
                ) : (
                  <>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="pro-project-technologies">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="pro-tech-badge">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
