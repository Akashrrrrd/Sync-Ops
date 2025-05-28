import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  auth,
  googleProvider,
  githubProvider,
} from "./../../firebase";

import { getUserData, setUserData } from "../../api/userApi";

import logo from "./../../assets/logo.png";
import google_icon from "./../../assets/google-icon.png";
import github_icon from "./../../assets/github-icon.png";
import "./Login.css";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleUserData = async (user, additionalData = {}) => {
    try {
      // Try to get user data from backend
      let userData = await getUserData(user.uid);

      // If no user data, set it
      if (!userData) {
        userData = {
          uid: user.uid,
          email: user.email,
          firstName: additionalData.firstName || "",
          lastName: additionalData.lastName || "",
          createdAt: new Date(),
          ...additionalData,
        };
        await setUserData(user.uid, userData);
      }

      onLogin(userData);
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving user data:", error);
      toast.error("Unable to save user data", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        await handleUserData(userCredential.user);
      } else {
        if (!firstName || !lastName) {
          toast.error("Please provide first and last name", {
            position: "top-right",
            autoClose: 3000,
          });
          return;
        }

        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await handleUserData(userCredential.user, {
          firstName,
          lastName,
        });
      }
    } catch (error) {
      console.error("Authentication error:", error);
      switch (error.code) {
        case "auth/email-already-in-use":
          toast.error("Email is already registered", {
            position: "top-right",
            autoClose: 3000,
          });
          break;
        case "auth/invalid-email":
          toast.error("Invalid email address", {
            position: "top-right",
            autoClose: 3000,
          });
          break;
        case "auth/weak-password":
          toast.error("Password is too weak", {
            position: "top-right",
            autoClose: 3000,
          });
          break;
        case "auth/wrong-password":
          toast.error("Incorrect password", {
            position: "top-right",
            autoClose: 3000,
          });
          break;
        default:
          toast.error("Authentication failed", {
            position: "top-right",
            autoClose: 3000,
          });
      }
    }
  };

  const handleGuestLogin = async () => {
    try {
      const guestEmail = `guest_${Date.now()}@syncops.com`;
      const guestPassword = `Guest_${Math.random().toString(36).substring(2)}`;

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        guestEmail,
        guestPassword
      );
      await handleUserData(userCredential.user, {
        isGuest: true,
        firstName: "Guest",
        lastName: "User",
      });
    } catch (error) {
      console.error("Guest login error:", error);
      toast.error("Guest login failed", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleSocialLogin = async (providerType) => {
    try {
      const provider =
        providerType === "google" ? googleProvider : githubProvider;
      const userCredential = await signInWithPopup(auth, provider);

      const nameParts = userCredential.user.displayName
        ? userCredential.user.displayName.split(" ")
        : ["", ""];

      await handleUserData(userCredential.user, {
        firstName: nameParts[0],
        lastName: nameParts[1] || "",
        photoURL: userCredential.user.photoURL,
      });
    } catch (error) {
      console.error("Social login error:", error);
      toast.error("Social login failed", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const toggleView = (e) => {
    // Prevent the default link behavior
    e.preventDefault();
    // Reset form fields when switching views
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    // Toggle between login and signup
    setIsLogin(!isLogin);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-auth-container">
      <ToastContainer />
      <div className="login-auth-content">
        {/* Logo Section */}
        <div className="login-auth-logo-container">
          <img src={logo} alt="SyncOps Logo" className="login-auth-logo" />
          <h2>
            Welcome to <span className="login-span-header">SyncOps</span>
          </h2>
          <p>Team Collaboration and Tools for Large Scale Projects</p>
        </div>

        {/* Form Section */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-auth-form">
            {/* Signup Fields */}
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
                      required
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
                      required
                    />
                    <span className="login-input-icon">👤</span>
                  </div>
                </div>
              </div>
            )}

            {/* Common Fields */}
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

            {/* Submit Button */}
            <button type="submit" className="login-auth-button">
              {isLogin ? "Log In" : "Sign Up"}
            </button>
          </form>

          {/* Guest Login Button */}
          <button onClick={handleGuestLogin} className="login-guest-button">
            Continue as Guest
          </button>

          {/* Social Login */}
          <div className="login-auth-separator">
            <span>OR</span>
          </div>
          <div className="login-auth-social-buttons">
            <button
              className="login-auth-social-button login-auth-google"
              onClick={() => handleSocialLogin("google")}
            >
              <img src={google_icon} alt="Google" className="social-icon" />
            </button>
            <button
              className="login-auth-social-button login-auth-github"
              onClick={() => handleSocialLogin("github")}
            >
              <img src={github_icon} alt="GitHub" className="social-icon" />
            </button>
          </div>

          {/* Switch between login and signup */}
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
