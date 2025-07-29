import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import Modal from "./Modal";
import "../CSS/Home.css";

// ✅ Correct the image import paths
import logo from "../JS/images/logo.png"; 
import bgImage from "../JS/images/bg-color.jpeg"; 

const Home = () => {
  const { user } = useContext(UserContext);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Typing Effect
  const text = "Discover opportunities that match your skills and aspirations.";
  const [typedText, setTypedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (charIndex < text.length) {
      const timer = setTimeout(() => {
        setTypedText((prev) => prev + text[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [charIndex, text]);

  const handleGetStarted = () => {
    setModalOpen(true);
  };

  return (
    <div className="home-container" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="content">
        <img src={logo} alt="Logo" className="logo floating" />
        <h1 className="title">Your Career, Your Future</h1>
        <p className="subtitle">{typedText}<span className="cursor">|</span></p>
        <button className="get-started-btn pulse" onClick={handleGetStarted}>
          Get Started - <br></br>It's Free
        </button>
      </div>

      {modalOpen && (
        <Modal
          closeModal={() => setModalOpen(false)}
          onLogin={() => navigate("/login")}
          onSkip={() => navigate("/landing")}
        />
      )}
    </div>
  );
};

export default Home;
