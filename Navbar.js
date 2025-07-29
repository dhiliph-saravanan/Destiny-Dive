import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../CSS/navbar.css";
import logo from "./images/navlogo.png";
import defaultProfilePic from "./images/default-profile.png";
import { UserContext } from "./UserContext"; // Import UserContext

const Navbar = () => {
  const { user } = useContext(UserContext); // Use UserContext to get user
  const [profileImage, setProfileImage] = useState(defaultProfilePic);

  useEffect(() => {
    if (user) {
      const storedImage = localStorage.getItem("profileImage");
      setProfileImage(user.profileImage || storedImage || defaultProfilePic);
    } else {
      setProfileImage(defaultProfilePic);
    }
  }, [user]); // Dependency on user ensures update when context changes

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("profileImage");
    setProfileImage(defaultProfilePic);
    window.location.href = "/";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light ugn-navbar">
      <div className="container">
        <Link to="/" className="navbar-brand ugn-navbar-brand">
          <img
            src={logo}
            alt="Logo"
            style={{
              width: "20vw",
              height: "auto",
              maxWidth: "120px",
            }}
          />
        </Link>

        <button
          className="navbar-toggler ugn-navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto gap-3 ugn-navbar-nav">
            <li className="nav-item">
              <Link className="nav-link fw-semibold text-secondary" to="/colleges">
                Universities
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold text-secondary" to="/notifications">
                Notifications
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold text-secondary" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold text-secondary" to="/recommendations">
                AI Recommendations
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav text-light ugn-navbar-nav">
            {user ? (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle d-flex align-items-center fw-semibold"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="rounded-circle"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                  />
                  {user.username}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item" to="/ProfilePage">
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item d-flex">
                <Link className="btn fw-bold mx-2" to="/login">
                  LOGIN
                </Link>
                <Link className="btn btn-warning text-light fw-semibold border-0 rounded-0 px-4 py-2" to="/signup">
                  SIGN UP
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;