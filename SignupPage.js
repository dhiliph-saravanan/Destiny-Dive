import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../CSS/signup.css";
import logo from "./images/logo.png";
import bg from "./images/bg-color.jpeg";
import google from "./images/google.png";
import facebook from "./images/facebook.png";
import x from "./images/x.png";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    const { username, email, phoneNumber, password, confirmPassword } = formData;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    const emailRegex = /^\S+@\S+\.\S+$/;
    const phoneRegex = /^\d{10}$/;

    if (!username) newErrors.username = "Username is required!";
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!phoneRegex.test(phoneNumber)) {
      newErrors.phoneNumber = "Enter a valid 10-digit phone number.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 6 characters, include one uppercase, lowercase, number, special character.";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      console.log("Submitting form data:", formData);
      try {
        const response = await axios.post("http://localhost:4501/api/users", {
          username: formData.username,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
        });
        console.log("Signup response:", response.data);
        setLoading(false);
        navigate("/login");
      } catch (error) {
        setLoading(false);
        console.error("Error signing up:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        const errorMessage =
          error.response?.data?.message ||
          "Failed to sign up. Please check your network or try again.";
        alert(errorMessage);
      }
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google signup clicked");
  };

  const handleFacebookLogin = () => {
    console.log("Facebook signup clicked");
  };

  const handleXLogin = () => {
    console.log("X signup clicked");
  };

  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100vh",
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        <div
          className="position-absolute top-0 start-0"
          style={{ zIndex: 9999, paddingTop: "15px", paddingLeft: "15px" }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ width: "6rem", height: "auto", maxWidth: "100%" }}
          />
        </div>
        <div
          className="shadow-lg form-bg mx-3"
          style={{
            maxWidth: "400px",
            width: "100%",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            position: "relative",
            borderRadius: "16px",
          }}
        >
          <div className="text-center mt-4 mb-3" style={{ paddingTop: "15px" }}>
            <h2
              className="fw-bolder"
              style={{ color: "black", fontSize: "1.6rem", marginBottom: "8px" }}
            >
              Create Your Account
            </h2>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              Join us today!
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mx-auto" style={{ width: "70%" }}>
            <div className="mb-2">
              <label htmlFor="username" className="form-label fw-bold" style={{ fontSize: "0.9rem" }}>
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className={`form-control ${errors.username ? "is-invalid" : ""}`}
                value={formData.username}
                onChange={handleChange}
                placeholder="Create a username"
                disabled={loading}
                style={{
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  padding: "8px",
                  backgroundColor: "#f9f9f9",
                  boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.1)",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                  fontSize: "0.9rem",
                }}
              />
              {errors.username && (
                <div className="invalid-feedback" style={{ fontSize: "0.8rem" }}>{errors.username}</div>
              )}
            </div>
            <div className="mb-2">
              <label htmlFor="email" className="form-label fw-bold" style={{ fontSize: "0.9rem" }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={loading}
                style={{
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  padding: "8px",
                  backgroundColor: "#f9f9f9",
                  boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.1)",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                  fontSize: "0.9rem",
                }}
              />
              {errors.email && <div className="invalid-feedback" style={{ fontSize: "0.8rem" }}>{errors.email}</div>}
            </div>
            <div className="mb-2">
              <label htmlFor="phoneNumber" className="form-label fw-bold" style={{ fontSize: "0.9rem" }}>
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                disabled={loading}
                style={{
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  padding: "8px",
                  backgroundColor: "#f9f9f9",
                  boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.1)",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                  fontSize: "0.9rem",
                }}
              />
              {errors.phoneNumber && (
                <div className="invalid-feedback" style={{ fontSize: "0.8rem" }}>{errors.phoneNumber}</div>
              )}
            </div>
            <div className="mb-2">
              <label htmlFor="password" className="form-label fw-bold" style={{ fontSize: "0.9rem" }}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                disabled={loading}
                style={{
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  padding: "8px",
                  backgroundColor: "#f9f9f9",
                  boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.1)",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                  fontSize: "0.9rem",
                }}
              />
              {errors.password && (
                <div className="invalid-feedback" style={{ fontSize: "0.8rem" }}>{errors.password}</div>
              )}
            </div>
            <div className="mb-2">
              <label htmlFor="confirmPassword" className="form-label fw-bold" style={{ fontSize: "0.9rem" }}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                disabled={loading}
                style={{
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  padding: "8px",
                  backgroundColor: "#f9f9f9",
                  boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.1)",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                  fontSize: "0.9rem",
                }}
              />
              {errors.confirmPassword && (
                <div className="invalid-feedback" style={{ fontSize: "0.8rem" }}>{errors.confirmPassword}</div>
              )}
            </div>
            <button
              type="submit"
              className="btn button w-100 justify-content-center"
              disabled={loading}
              style={{
                borderRadius: "6px",
                background: "linear-gradient(135deg, #5885b8, #66a6ff)",
                color: "white",
                border: "none",
                padding: "8px",
                fontSize: "0.9rem",
                transition: "transform 0.3s, background 0.3s",
                opacity: loading ? 0.7 : 1,
              }}
              onMouseOver={(e) =>
                (e.target.style.background = "linear-gradient(135deg, #4c8ef9, #5885b8)")
              }
              onMouseOut={(e) =>
                (e.target.style.background = "linear-gradient(135deg, #5885b8, #66a6ff)")
              }
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
          <hr className="hr mx-auto border-2" />
          <div className="text-center mt-3">
            <p className="fw-bold" style={{ color: "#333", fontSize: "0.9rem" }}>
              Or sign up with
            </p>
            <div className="d-flex justify-content-center align-items-center gap-3 my-2">
              <button
                className="btn social-btn"
                disabled={loading}
                style={{
                  width: "40px",
                  height: "40px",
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
                    width: "24px",
                    height: "24px",
                  }}
                />
              </button>
              <button
                className="btn social-btn"
                disabled={loading}
                style={{
                  width: "40px",
                  height: "40px",
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
                    width: "24px",
                    height: "24px",
                  }}
                />
              </button>
              <button
                className="btn social-btn"
                disabled={loading}
                style={{
                  width: "40px",
                  height: "40px",
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
                    width: "24px",
                    height: "24px",
                  }}
                />
              </button>
            </div>
          </div>
          <div className="text-center mt-2">
            <p style={{ fontSize: "0.9rem" }}>
              Already have an account?{" "}
              <a href="/login" style={{ textDecoration: "none", color: "#66a6ff", fontWeight: "bold" }}>
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;