import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../CSS/signup.css";
import logo from "./images/logo.png";
import bg from "./images/bg-color.jpeg";
import google from "./images/google.png";
import facebook from "./images/facebook.png";
import x from "./images/x.png";
import AdminLogo from "./images/Admin.png";

const LoginPage = () => {
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    emailOrMobile: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [emailOrMobileError, setEmailOrMobileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isAdmin, setIsAdmin] = useState(false); // Unused, kept for future use
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "emailOrMobile") {
      setEmailOrMobileError("");
    }
    if (name === "password") {
      setPasswordError("");
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (!formData.emailOrMobile) {
      setEmailOrMobileError("Email or mobile number is required.");
      isValid = false;
    } else if (
      !/^\S+@\S+\.\S+$/.test(formData.emailOrMobile) &&
      !/^\d{10}$/.test(formData.emailOrMobile)
    ) {
      setEmailOrMobileError(
        "Please enter a valid email address or 10-digit mobile number."
      );
      isValid = false;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!formData.password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (!passwordRegex.test(formData.password)) {
      setPasswordError(
        "Password must be at least 6 characters, include one uppercase, lowercase, number, and special character."
      );
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post("http://localhost:4501/api/login", {
        emailOrMobile: formData.emailOrMobile,
        password: formData.password,
      });

      if (response.data && response.data.user) {
        const userData = response.data.user;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("userId", userData._id); // Store userId separately
        navigate("/landing");
      } else {
        setError("Invalid email/mobile or password.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    // Add Google login logic here if needed
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login clicked");
    // Add Facebook login logic here if needed
  };

  const handleXLogin = () => {
    console.log("X login clicked");
    // Add X login logic here if needed
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <div
        className="position-absolute top-0 start-0"
        style={{
          zIndex: 9999,
          paddingTop: "20px",
          paddingLeft: "20px",
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            width: "8rem",
            height: "auto",
            maxWidth: "100%",
          }}
        />
      </div>
      <div
        className="position-absolute top-0 end-0"
        style={{
          zIndex: 9999,
          paddingTop: "20px",
          paddingRight: "0px",
          textAlign: "center",
        }}
      >
        <img
          src={AdminLogo}
          onClick={() => navigate("/AdminDashboard")}
          alt="AdminLogo"
          style={{
            width: "8rem",
            height: "auto",
            maxWidth: "50%",
            cursor: "pointer",
          }}
        />
        <div
          style={{
            color: "black",
            fontWeight: "bold",
            marginTop: "5px",
            userSelect: "none",
          }}
        >
          Admin
        </div>
      </div>

      <div
        className="mx-4 shadow-lg form-bg"
        style={{
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          position: "relative",
          borderRadius: "20px",
        }}
      >
        <div className="text-center mt-5 mb-4">
          <h2
            className="fw-bolder"
            style={{
              color: "black",
              fontSize: "2rem",
              marginBottom: "10px",
            }}
          >
            Welcome Back!
          </h2>
          <p style={{ color: "#666", fontSize: "1.1rem" }}>
            Please login to your account.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          style={{ width: "60%" }}
          className="mx-auto"
        >
          <div className="mb-3">
            <label htmlFor="emailOrMobile" className="form-label fw-bold">
              Email or Mobile
            </label>
            <input
              type="text"
              id="emailOrMobile"
              name="emailOrMobile"
              className="form-control"
              value={formData.emailOrMobile}
              onChange={handleChange}
              placeholder="Enter your email or mobile number"
              style={{
                borderRadius: "8px",
                border: "1px solid #ccc",
                padding: "12px",
                backgroundColor: "#f9f9f9",
                boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}
            />
            {emailOrMobileError && (
              <div className="text-danger" style={{ fontSize: "0.9rem", marginTop: "5px" }}>
                {emailOrMobileError}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-bold">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              style={{
                borderRadius: "8px",
                border: "1px solid #ccc",
                padding: "12px",
                backgroundColor: "#f9f9f9",
                boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}
            />
            {passwordError && (
              <div className="text-danger" style={{ fontSize: "0.9rem", marginTop: "5px" }}>
                {passwordError}
              </div>
            )}
          </div>

          {error && (
            <div className="text-danger mb-3" style={{ fontSize: "0.9rem" }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="btn button w-100 justify-content-center"
            style={{
              borderRadius: "8px",
              background: "linear-gradient(135deg, #5885b8, #66a6ff)",
              color: "white",
              border: "none",
              padding: "12px",
              fontSize: "1.1rem",
              transition: "transform 0.3s, background 0.3s",
            }}
            onMouseOver={(e) =>
              (e.target.style.background = "linear-gradient(135deg, #4c8ef9, #5885b8)")
            }
            onMouseOut={(e) =>
              (e.target.style.background = "linear-gradient(135deg, #5885b8, #66a6ff)")
            }
          >
            Login
          </button>
        </form>
        <div className="text-center mt-3">
          <a
            href="/forgot-password"
            style={{
              textDecoration: "none",
              color: "#66a6ff",
              fontWeight: "bold",
            }}
          >
            Forgot Password?
          </a>
        </div>
        <hr className="hr mx-auto border-3" />
        <div className="text-center mt-4">
          <p className="fw-bold" style={{ color: "#333", fontSize: "1rem" }}>
            Or sign up with
          </p>
          <div className="d-flex justify-content-center align-items-center gap-4 my-3">
            <button
              className="btn social-btn"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #ffffff, #f0f0f0)",
                border: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
              }}
              onClick={handleGoogleLogin}
              onMouseOver={(e) => {
                e.target.style.transform = "scale(1.1)";
                e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "none";
              }}
            >
              <img
                src={google}
                alt="Google"
                style={{
                  width: "28px",
                  height: "28px",
                }}
              />
            </button>
            <button
              className="btn social-btn"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #ffffff, #f0f0f0)",
                border: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
              }}
              onClick={handleFacebookLogin}
              onMouseOver={(e) => {
                e.target.style.transform = "scale(1.1)";
                e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "none";
              }}
            >
              <img
                src={facebook}
                alt="Facebook"
                style={{
                  width: "28px",
                  height: "28px",
                }}
              />
            </button>
            <button
              className="btn social-btn"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #ffffff, #f0f0f0)",
                border: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
              }}
              onClick={handleXLogin}
              onMouseOver={(e) => {
                e.target.style.transform = "scale(1.1)";
                e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "none";
              }}
            >
              <img
                src={x}
                alt="X"
                style={{
                  width: "28px",
                  height: "28px",
                }}
              />
            </button>
          </div>
        </div>
        <div className="text-center mt-3">
          <p>
            Don't have an account?{" "}
            <a
              href="/signup"
              style={{
                textDecoration: "none",
                color: "#66a6ff",
                fontWeight: "bold",
              }}
            >
              Sign Up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;