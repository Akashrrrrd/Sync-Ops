import React, { useState } from "react";
import "./Login.css";
import logo from "./../../assets/logo.png";

const Login = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminBoard, setAdminBoard] = useState("members");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      if (email && password) {
        onLogin(email, password, adminBoard);
      } else {
        setError("Please enter both email and password.");
      }
    } else {
      if (firstName && lastName && email && password) {
        onSignup(firstName, lastName, email, password, adminBoard);
      } else {
        setError("Please fill in all fields.");
      }
    }
  };

  const toggleView = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-auth-container">
      <div className="login-auth-content">
        <div className="login-auth-logo-container">
          <img src={logo} alt="SyncOps Logo" className="login-auth-logo" />
          <h2>
            Welcome to <span className="login-span-header">SyncOps</span>
          </h2>
          <p>Team Collaboration and Tools for Large Scale Projects</p>
        </div>
        <div className="login-auth-form-container">
          <h2 className="login-auth-title">
            {isLogin
              ? "Welcome Back to SyncOps"
              : "Create Your SyncOps Account"}
          </h2>
          <p className="login-auth-subtitle">
            {isLogin
              ? "Log in to your SyncOps account to continue"
              : "Sign up to start collaborating on large-scale projects"}
          </p>
          {error && <div className="login-auth-error">{error}</div>}
          <form onSubmit={handleSubmit} className="login-auth-form">
            {!isLogin && (
              <div className="login-auth-input-row">
                <div className="login-auth-input-group">
                  <label htmlFor="firstName">First Name</label>
                  <div className="login-input-wrapper">
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Your First Name"
                    />
                    <span className="login-input-icon">👤</span>
                  </div>
                </div>
                <div className="login-auth-input-group">
                  <label htmlFor="lastName">Last Name</label>
                  <div className="login-input-wrapper">
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Your Last Name"
                    />
                    <span className="login-input-icon">👤</span>
                  </div>
                </div>
              </div>
            )}
            <div className="login-auth-input-group">
              <label htmlFor="email">Email Address</label>
              <div className="login-input-wrapper">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
                <span className="login-input-icon">✉️</span>
              </div>
            </div>
            <div className="login-auth-input-group">
              <label htmlFor="password">Password</label>
              <div className="login-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    isLogin ? "Enter your password" : "Create a strong password"
                  }
                  required
                />
                <span className="login-input-icon">🔒</span>
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
            <div className="login-auth-input-group">
              <label htmlFor="adminBoard">Select Admin Panel</label>
              <select
                id="adminBoard"
                value={adminBoard}
                onChange={(e) => setAdminBoard(e.target.value)}
                className="login-auth-select"
              >
                <option value="hm">HM</option>
                <option value="manager">Manager</option>
                <option value="members">Members</option>
              </select>
            </div>
            <button type="submit" className="login-auth-button">
              {isLogin ? "Log In" : "Sign Up"}
            </button>
          </form>
          <div className="login-auth-separator">
            <span>OR</span>
          </div>
          <div className="login-auth-social-buttons">
            <button className="login-auth-social-button login-auth-github">
              Continue with GitHub
            </button>
            <button className="login-auth-social-button login-auth-facebook">
              Continue with Facebook
            </button>
          </div>
          <div className="login-auth-switch">
            <p>
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <a href="#" onClick={toggleView}>
                {isLogin ? "Sign up now" : "Log in"}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
