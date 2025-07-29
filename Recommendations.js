import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../CSS/recommendations.css";
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaRedo, FaBrain, FaChartBar, FaPaintBrush } from "react-icons/fa";

const Recommendations = () => {
  const [responses, setResponses] = useState({});
  const [score, setScore] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [showRetestPrompt, setShowRetestPrompt] = useState(false);
  const [hasPreviousResults, setHasPreviousResults] = useState(false);
  const [isRetest, setIsRetest] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setError("User not logged in. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    const fetchCareerAssessment = async () => {
      try {
        const response = await axios.get(`http://localhost:4501/api/user/career-assessment/${userId}`);
        setScore(response.data.score);
        setRecommendations(response.data.recommendations);
        setHasPreviousResults(true);
        setShowRetestPrompt(true);
        setShowIntro(false);
      } catch (err) {
        setShowIntro(true);
      }
    };

    fetchCareerAssessment();
  }, [userId, navigate]);

  useEffect(() => {
    if (location.state?.submittedData) {
      const { responses, score, recommendations } = location.state.submittedData;
      setResponses(responses);
      setScore(score);
      setRecommendations(recommendations);
      setShowIntro(false);
      setShowRetestPrompt(false);
    }
  }, [location.state]);

  const originalQuestions = [
    { id: 1, text: "I enjoy tackling complex problems that require deep thinking." },
    { id: 2, text: "I find satisfaction in analyzing data to uncover trends." },
    { id: 3, text: "I love designing or building practical solutions to real-world issues." },
    { id: 4, text: "I feel energized by expressing myself through creative outlets." },
    { id: 5, text: "I’m curious about why people behave the way they do." },
    { id: 6, text: "I thrive when taking initiative and leading others." },
    { id: 7, text: "I prefer working with technology over traditional methods." },
    { id: 8, text: "I’m comfortable making decisions with incomplete information." },
    { id: 9, text: "I enjoy exploring abstract concepts and theories." },
    { id: 10, text: "I get excited about turning ideas into actionable plans." },
  ];

  const retestQuestions = [
    { id: 1, text: "I enjoy developing algorithms to solve technical challenges." },
    { id: 2, text: "I find it rewarding to visualize data for insights." },
    { id: 3, text: "I like engineering systems that improve efficiency." },
    { id: 4, text: "I feel fulfilled when creating art or music." },
    { id: 5, text: "I’m interested in studying human emotions and motivations." },
    { id: 6, text: "I excel at motivating teams to achieve goals." },
    { id: 7, text: "I prefer using cutting-edge tech tools in my work." },
    { id: 8, text: "I’m confident making quick decisions under pressure." },
    { id: 9, text: "I enjoy debating philosophical or theoretical ideas." },
    { id: 10, text: "I get excited about launching new projects or startups." },
  ];

  const questions = isRetest ? retestQuestions : originalQuestions;

  const options = [
    { value: 1, label: "Strongly Disagree" },
    { value: 2, label: "Disagree" },
    { value: 3, label: "Neutral" },
    { value: 4, label: " Agree" },
    { value: 5, label: "Strongly Agree" },
  ];

  const handleChange = (id, value) => {
    setResponses((prev) => ({ ...prev, [id]: parseInt(value) }));
  };

  const handleSubmit = async () => {
    if (questions.some((q) => !responses[q.id])) {
      setError("Please answer all questions to proceed.");
      return;
    }
    if (!userId) {
      setError("User not logged in. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }
    setError(null);

    try {
      const response = await axios.post("http://localhost:5000/api/score", {
        responses,
        userId,
      });
      setScore(response.data.score);
      setRecommendations(response.data.recommendations);

      navigate(location.pathname, {
        state: {
          submittedData: {
            responses,
            score: response.data.score,
            recommendations: response.data.recommendations,
          },
        },
        replace: true,
      });
    } catch (error) {
      setError(error.response?.data?.error || "Failed to process your responses. Please try again.");
    }
  };

  const handleViewColleges = (domain) => {
    navigate("/recommendedcolleges", {
      state: {
        selectedDomain: domain,
        submittedData: { responses, score, recommendations },
      },
    });
  };

  const handleAccept = () => {
    setShowIntro(false);
  };

  const handleRetest = () => {
    setResponses({});
    setScore(null);
    setRecommendations([]);
    setShowRetestPrompt(false);
    setShowIntro(true);
    setIsRetest(true);
  };

  const handleContinue = () => {
    setShowRetestPrompt(false);
  };

  const bestDomain = recommendations.length > 0 ? recommendations[0] : null;

  const getAIExplanation = () => {
    if (!bestDomain) return "";
    const highTech = Object.values(responses).slice(0, 3).some(val => val >= 4);
    const highCreative = Object.values(responses).slice(3, 5).some(val => val >= 4);
    const highLeadership = responses[6] >= 4 || responses[8] >= 4;
    
    if (highTech && (bestDomain.domain.includes("AI") || bestDomain.domain.includes("Data Science"))) {
      return "Your strong problem-solving and analytical skills align well with technology-driven fields.";
    } else if (highCreative && (bestDomain.domain.includes("Arts") || bestDomain.domain.includes("Psychology"))) {
      return "Your creativity and curiosity about human behavior suggest a great fit for expressive fields.";
    } else if (highLeadership && bestDomain.domain === "Entrepreneurship") {
      return "Your leadership and decision-making abilities make entrepreneurship a strong match.";
    }
    return "Your balanced skills suggest versatility across multiple career paths.";
  };

  const getDomainIcon = (domain) => {
    switch (domain) {
      case "AI":
        return <FaBrain size={40} color="#3498db" />;
      case "Data Science":
        return <FaChartBar size={40} color="#2ecc71" />;
      case "Arts":
        return <FaPaintBrush size={40} color="#e74c3c" />;
      default:
        return null;
    }
  };

  return (
    <div className="recommendations">
      {showIntro && !showRetestPrompt && (
        <motion.div
          className="intro-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="modal-content">
            <h2>{isRetest ? "Retake Career Assessment" : "Welcome to Your Career Journey"}</h2>
            <p>
              {isRetest
                ? "Answer these new questions to refine your career recommendations."
                : "Please take this seriously—your answers will shape personalized career recommendations powered by AI."}
            </p>
            <button className="accept-btn" onClick={handleAccept}>
              I Understand, Let’s Begin
            </button>
          </div>
        </motion.div>
      )}

      {showRetestPrompt && (
        <motion.div
          className="intro-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="modal-content">
            <h2>Previous Assessment Found</h2>
            <p>
              You have already completed a career assessment. Would you like to view your previous results or take the test again with new questions?
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button className="accept-btn" onClick={handleContinue}>
                View Previous Results
              </button>
              <button className="accept-btn" onClick={handleRetest}>
                Retake Test
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {!showIntro && !showRetestPrompt && (
        <>
          <div className="header">
            <h2>Your Career Path</h2>
          </div>

          <p className="subtext">Explore your personalized career recommendations below.</p>

          {score === null ? (
            <>
              <div className="question-container">
                {questions.map((q, index) => (
                  <motion.div
                    key={q.id}
                    className="question-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <p className="question-text">{q.text}</p>
                    <div className="options">
                      {options.map((option) => (
                        <label key={option.value} className="option-label">
                          <input
                            type="radio"
                            name={`question-${q.id}`}
                            value={option.value}
                            checked={responses[q.id] === option.value}
                            onChange={() => handleChange(q.id, option.value)}
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {error && <p className="error-message">{error}</p>}

              <button onClick={handleSubmit} className="submit-btn">Submit Assessment</button>
            </>
          ) : (
            <motion.div
              className="result-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="score-visualization">
                <CircularProgressbar
                  value={(score / 50) * 100}
                  text={`${score}/50`}
                  styles={buildStyles({
                    textColor: "#2c3e50",
                    pathColor: "#2980b9",
                    trailColor: "#ecf0f1",
                  })}
                />
              </div>
              <div className="best-domain">
                <h4>Top Career Match:</h4>
                <p className="highlight">{bestDomain.domain} ({bestDomain.match.toFixed(1)}% Match)</p>
                <p className="ai-explanation">{getAIExplanation()}</p>
              </div>
              <h3>All Recommendations</h3>
              <div className="recommendation-grid">
                {recommendations.map(({ domain, match }, idx) => (
                  <motion.div
                    key={idx}
                    className="recommendation-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="icon">{getDomainIcon(domain)}</div>
                    <div className="domain-info">
                      <h4>{domain}</h4>
                      <p>{match.toFixed(1)}% Match</p>
                    </div>
                    <button
                      className="view-college-btn"
                      onClick={() => handleViewColleges(domain)}
                    >
                      View Colleges
                    </button>
                  </motion.div>
                ))}
              </div>
              <button className="retest-btn" onClick={handleRetest}>
                <FaRedo /> Retake Test
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default Recommendations;