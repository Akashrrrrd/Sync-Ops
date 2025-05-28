import React, { useState, useEffect } from "react";
import "./Profile.css";
import { getUserData, setUserData } from "../../api/userApi";
import { auth } from "../../firebase";

const Profile = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    about: "",
    profileImage: null,
    skills: [],
    projects: [],
    socialMedia: [],
  });

  // Fetch user data from backend on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const uid = auth.currentUser.uid;
        try {
          const data = await getUserData(uid);
          setProfileData(data);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };
    fetchUserData();
  }, []);

  // Save user data to backend when editing is toggled off
  useEffect(() => {
    const saveUserData = async () => {
      if (!isEditing && auth.currentUser) {
        const uid = auth.currentUser.uid;
        try {
          await setUserData(uid, profileData);
        } catch (error) {
          console.error("Failed to save user data:", error);
        }
      }
    };
    saveUserData();
  }, [isEditing, profileData]);

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
      name: "",
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
      title: "",
      description: "",
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

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({
          ...prev,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addSocialMedia = () => {
    const newSocialMedia = {
      id: Date.now(),
      platform: "",
      url: "",
      icon: "",
    };
    setProfileData((prev) => ({
      ...prev,
      socialMedia: [...prev.socialMedia, newSocialMedia],
    }));
  };

  const handleSocialMediaChange = (index, field, value) => {
    const updatedSocialMedia = [...profileData.socialMedia];
    updatedSocialMedia[index] = {
      ...updatedSocialMedia[index],
      [field]: value,
    };
    setProfileData((prev) => ({
      ...prev,
      socialMedia: updatedSocialMedia,
    }));
  };

  const deleteSocialMedia = (id) => {
    setProfileData((prev) => ({
      ...prev,
      socialMedia: prev.socialMedia.filter((social) => social.id !== id),
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
          {isEditing ? (
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageUpload}
              className="pro-file-input"
            />
          ) : (
            <img
              src={
                profileData.profileImage || "https://via.placeholder.com/250"
              }
              alt="Profile"
              className="pro-profile-image"
            />
          )}
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
                {profileData.email && (
                  <a
                    href={`mailto:${profileData.email}`}
                    className="pro-contact-link"
                  >
                    <i className="fas fa-envelope"></i> {profileData.email}
                  </a>
                )}
                {profileData.phone && (
                  <a
                    href={`tel:${profileData.phone}`}
                    className="pro-contact-link"
                  >
                    <i className="fas fa-phone-alt"></i> {profileData.phone}
                  </a>
                )}
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
            profileData.about && <p>{profileData.about}</p>
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
                      className="pro-delete-btns"
                    >
                      Delete Project
                    </button>
                  </div>
                ) : (
                  <>
                    {project.title && <h3>{project.title}</h3>}
                    {project.description && <p>{project.description}</p>}
                    {project.technologies.length > 0 && (
                      <div className="pro-project-technologies">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="pro-tech-badge">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="pro-social-media">
          <div className="pro-section-header">
            <h2>Social Media</h2>
            {isEditing && (
              <button onClick={addSocialMedia} className="pro-add-btn">
                Add Social Media
              </button>
            )}
          </div>
          <div className="pro-social-media-list">
            {profileData.socialMedia.map((social, index) => (
              <div className="pro-social-media-item" key={social.id}>
                {isEditing ? (
                  <div className="pro-social-media-edit">
                    <input
                      type="text"
                      className="pro-input"
                      value={social.platform}
                      onChange={(e) =>
                        handleSocialMediaChange(
                          index,
                          "platform",
                          e.target.value
                        )
                      }
                      placeholder="Platform"
                    />
                    <input
                      type="text"
                      className="pro-input"
                      value={social.url}
                      onChange={(e) =>
                        handleSocialMediaChange(index, "url", e.target.value)
                      }
                      placeholder="URL"
                    />
                    <input
                      type="text"
                      className="pro-input"
                      value={social.icon}
                      onChange={(e) =>
                        handleSocialMediaChange(index, "icon", e.target.value)
                      }
                      placeholder="Icon Class"
                    />
                    <button
                      onClick={() => deleteSocialMedia(social.id)}
                      className="pro-delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  social.url && (
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pro-social-media-link"
                    >
                      {social.icon && <i className={social.icon}></i>}
                      {social.platform}
                    </a>
                  )
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
