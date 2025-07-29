import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "./Footer";
import "../CSS/university.css";
import logo from "./images/navlogo.png";
import back_btn from "./images/back-btn.png";
import continue_btn from "./images/continue-btn.png";
import bachelorsImg from "./university-images/bachelors.png";
import mastersImg from "./university-images/masters.png";
import mbaImg from "./university-images/mba.png";
import phdImg from "./university-images/phd.png";
import diplomaImg from "./university-images/diploma.png";

const AbroadUniversities = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const type = location.state?.type || "Abroad";

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: type,
    degreeLevel: "",
    currentQualification: "",
    country: "",
    stream: "",
    specialization: "",
    budget: "",
    exams: {},
    additionalPathway: null,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showErrorOverlay, setShowErrorOverlay] = useState(false);
  const [hoverCard, setHoverCard] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const degreeLevels = [
    { name: "Bachelor's", desc: "Launch your career with an undergraduate degree", img: bachelorsImg, duration: "3-4 years" },
    { name: "Master's", desc: "Advance your expertise with a postgraduate degree", img: mastersImg, duration: "1-2 years" },
    { name: "MBA", desc: "Master business skills with global exposure", img: mbaImg, duration: "1-2 years" },
    { name: "PhD", desc: "Pursue groundbreaking research", img: phdImg, duration: "3-6 years" },
    { name: "Diploma", desc: "Gain practical skills for immediate impact", img: diplomaImg, duration: "1-2 years" },
  ];

  const currentQualifications = {
    "Bachelor's": ["Grade 10th", "Grade 12th", "Diploma"],
    "Master's": ["Bachelor’s Degree", "Integrated Program"],
    "MBA": ["Bachelor’s Degree"],
    "PhD": ["Master’s Degree", "Bachelor’s Degree (Honors)"],
    "Diploma": ["Grade 10th", "Grade 12th"],
  };

  const countries = ["USA", "Canada", "Australia", "UK", "Germany", "Singapore"];

  const bachelorStreams = [
    "Engineering",
    "Business",
    "Arts",
    "Science",
    "Law",
    "Medicine",
    "Agriculture",
    "IT",
    "Architecture",
  ];

  const specializations = {
    Engineering: [
      "Computer Science",
      "Mechanical",
      "Civil",
      "Electrical",
      "Chemical",
      "Aerospace",
      "Biomedical",
      "Robotics",
    ],
    Business: [
      "Finance",
      "Marketing",
      "Entrepreneurship",
      "International Business",
      "Human Resources",
      "Operations",
    ],
    Arts: ["Literature", "Psychology", "History", "Sociology", "Philosophy", "Visual Arts"],
    Science: ["Physics", "Chemistry", "Biology", "Mathematics", "Environmental Science", "Data Science"],
    Law: ["Corporate Law", "Criminal Law", "International Law", "Environmental Law"],
    Medicine: ["General Medicine", "Nursing", "Pharmacy", "Dentistry", "Public Health"],
    Agriculture: ["Agronomy", "Horticulture", "Soil Science", "Plant Pathology"],
    IT: ["Computer Science", "AI", "Cybersecurity", "Software Engineering", "Networking", "Cloud Computing"],
    Architecture: ["Urban Planning", "Interior Design", "Sustainable Design"],
    "Master's": [
      "Computer Science",
      "Software Engineering",
      "Artificial Intelligence",
      "Data Science",
      "Cybersecurity",
      "Mechanical Engineering",
      "Finance",
      "Psychology",
      "Physics",
      "Public Health",
      "International Relations",
    ],
    MBA: [
      "Finance",
      "Marketing",
      "Operations Management",
      "Human Resources",
      "International Business",
      "Entrepreneurship",
      "Business Analytics",
    ],
    PhD: ["Research in Chosen Field", "Advanced Studies", "Thesis-Based Specialization"],
    Diploma: [
      "Engineering",
      "IT",
      "Hospitality",
      "Business Management",
      "Healthcare",
      "Graphic Design",
      "Culinary Arts",
    ],
  };

  const requiredExams = {
    USA: {
      "Bachelor's": ["SAT/ACT", "TOEFL/IELTS"],
      "Master's": ["GRE", "TOEFL/IELTS"],
      "MBA": ["GMAT", "TOEFL/IELTS"],
      "PhD": ["GRE", "TOEFL/IELTS"],
      "Diploma": ["TOEFL/IELTS"],
    },
    Canada: {
      "Bachelor's": ["IELTS/TOEFL"],
      "Master's": ["GRE/GMAT", "IELTS/TOEFL"],
      "MBA": ["GMAT", "IELTS/TOEFL"],
      "PhD": ["GRE", "IELTS/TOEFL"],
      "Diploma": ["IELTS/TOEFL"],
    },
    Australia: {
      "Bachelor's": ["IELTS/PTE"],
      "Master's": ["IELTS/PTE"],
      "MBA": ["GMAT", "IELTS/PTE"],
      "PhD": ["GRE", "IELTS/PTE"],
      "Diploma": ["IELTS/PTE"],
    },
    UK: {
      "Bachelor's": ["IELTS"],
      "Master's": ["IELTS"],
      "MBA": ["GMAT", "IELTS"],
      "PhD": ["IELTS"],
      "Diploma": ["IELTS"],
    },
    Germany: {
      "Bachelor's": ["IELTS/TOEFL", "TestDaF"],
      "Master's": ["IELTS/TOEFL", "TestDaF"],
      "MBA": ["GMAT", "IELTS/TOEFL"],
      "PhD": ["IELTS/TOEFL", "TestDaF"],
      "Diploma": ["IELTS/TOEFL", "TestDaF"],
    },
    Singapore: {
      "Bachelor's": ["IELTS/TOEFL"],
      "Master's": ["GRE", "IELTS/TOEFL"],
      "MBA": ["GMAT", "IELTS/TOEFL"],
      "PhD": ["GRE", "IELTS/TOEFL"],
      "Diploma": ["IELTS/TOEFL"],
    },
  };

  const isDirectlyEligible = (degreeLevel, currentQualification, country) => {
    switch (degreeLevel) {
      case "Bachelor's":
        return (
          currentQualification === "Grade 12th" ||
          (currentQualification === "Diploma" && ["Canada", "Australia", "Singapore"].includes(country))
        );
      case "Master's":
      case "MBA":
        return currentQualification === "Bachelor’s Degree";
      case "PhD":
        return currentQualification === "Master’s Degree" || currentQualification === "Bachelor’s Degree (Honors)";
      case "Diploma":
        return ["Grade 10th", "Grade 12th"].includes(currentQualification);
      default:
        return false;
    }
  };

  const getRequiredPathway = (degreeLevel, currentQualification, country) => {
    if (degreeLevel === "Bachelor's" && currentQualification === "Grade 10th") {
      switch (country) {
        case "USA":
          return "Complete High School (Grade 12) or enroll in a Community College (Associate Degree: 2 years)";
        case "Canada":
          return "Pursue a Diploma (1-2 years) or Advanced Diploma (2-3 years)";
        case "Australia":
          return "Complete a Vocational Diploma (1-2 years) via TAFE or a Foundation Program";
        case "UK":
          return "Complete a Foundation Year (1 year)";
        case "Germany":
          return "Attend Studienkolleg (1 year)";
        case "Singapore":
          return "Complete a Diploma (1-2 years) at a Polytechnic or a Foundation Program";
        default:
          return null;
      }
    } else if (
      (degreeLevel === "Master's" || degreeLevel === "MBA") &&
      currentQualification !== "Bachelor’s Degree"
    ) {
      return "Complete a Bachelor’s Degree";
    } else if (degreeLevel === "PhD" && currentQualification !== "Master’s Degree") {
      return "Complete a Master’s Degree";
    }
    return null;
  };

  const getRequiredExams = (country, degreeLevel) => {
    return requiredExams[country]?.[degreeLevel] || [];
  };

  const validateBudget = (budget) => {
    const numBudget = Number(budget);
    return numBudget >= 5000 && numBudget <= 1000000;
  };

  const validateExamScore = (exam, score) => {
    const minScores = {
      "IELTS": 5.0,
      "TOEFL": 60,
      "GRE": 260,
      "GMAT": 400,
      "SAT/ACT": 800,
      "PTE": 42,
      "TestDaF": 3,
    };
    return score >= (minScores[exam] || 0);
  };

  useEffect(() => {
    const totalSteps = 7;
    setProgress(((step - 1) / (totalSteps - 1)) * 100);
  }, [step]);

  useEffect(() => {
    if (formData.degreeLevel && step === 1) {
      setFormData({
        ...formData,
        currentQualification: "",
        country: "",
        stream: "",
        specialization: "",
        budget: "",
        exams: {},
        additionalPathway: null,
      });
      setErrors({});
      setStep(2);
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  }, [formData.degreeLevel]);

  const handleNextStep = (updatedFormData = formData) => {
    const newErrors = {};
    setIsLoading(true);

    switch (step) {
      case 1:
        if (!updatedFormData.degreeLevel) newErrors.degreeLevel = "Please select a degree level.";
        break;
      case 2:
        if (!updatedFormData.currentQualification)
          newErrors.currentQualification = "Please select your current qualification.";
        break;
      case 3:
        if (!updatedFormData.country) newErrors.country = "Please select a country.";
        break;
      case 4:
        if (updatedFormData.degreeLevel === "Bachelor's" && !updatedFormData.stream) {
          newErrors.stream = "Please select your intended stream.";
        } else if (
          ["Master's", "MBA", "PhD", "Diploma"].includes(updatedFormData.degreeLevel) &&
          !updatedFormData.specialization
        ) {
          newErrors.specialization = "Please select your intended specialization.";
        }
        break;
      case 5:
        if (!updatedFormData.budget) {
          newErrors.budget = "Please enter your annual budget.";
        } else if (!validateBudget(updatedFormData.budget)) {
          newErrors.budget = "Budget must be between $5,000 and $1,000,000 USD.";
        }
        break;
      case 6:
        const exams = getRequiredExams(updatedFormData.country, updatedFormData.degreeLevel);
        exams.forEach((exam) => {
          if (!updatedFormData.exams[exam]) {
            newErrors[exam] = `Please enter your ${exam} score.`;
          } else if (!validateExamScore(exam, updatedFormData.exams[exam])) {
            newErrors[exam] = `Your ${exam} score is below the minimum required.`;
          }
        });
        break;
      default:
        break;
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setTimeout(() => {
        if (step < 7) {
          setStep(step + 1);
          setIsTransitioning(true);
          setTimeout(() => setIsTransitioning(false), 500);
        }
        setIsLoading(false);
        setShowErrorOverlay(false);
      }, 300);
    } else {
      setIsLoading(false);
      setShowErrorOverlay(true);
      setTimeout(() => setShowErrorOverlay(false), 5000);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setIsLoading(true);
      setTimeout(() => {
        setStep(step - 1);
        setIsTransitioning(true);
        setTimeout(() => setIsTransitioning(false), 500);
        setIsLoading(false);
        setShowErrorOverlay(false);
      }, 300);
    }
  };

  const handleChange = (field, value) => {
    let updatedFormData = { ...formData };
    if (field === "exams") {
      updatedFormData = { ...formData, exams: { ...formData.exams, ...value } };
    } else {
      updatedFormData = { ...formData, [field]: value };
      if (field === "country" && formData.currentQualification) {
        const pathway = getRequiredPathway(formData.degreeLevel, formData.currentQualification, value);
        updatedFormData = { ...updatedFormData, additionalPathway: pathway };
      }
    }
    setFormData(updatedFormData);
    if (errors[field]) setErrors({ ...errors, [field]: "" });
    setShowErrorOverlay(false);

    if (
      (step === 1 && field === "degreeLevel") ||
      (step === 2 && field === "currentQualification") ||
      (step === 3 && field === "country") ||
      (step === 4 && (field === "stream" || field === "specialization"))
    ) {
      handleNextStep(updatedFormData);
    }
  };

  const closeErrorOverlay = () => {
    setShowErrorOverlay(false);
  };

  const handleCardHover = (index) => {
    setHoverCard(index);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="uni-level-container uni-degree-level">
            <div className="uni-options-grid">
              {degreeLevels.map((degree, index) => (
                <div
                  key={degree.name}
                  className={`uni-option-card ${formData.degreeLevel === degree.name ? "selected" : ""} ${
                    hoverCard === index ? "hovered" : ""
                  }`}
                  onClick={() => handleChange("degreeLevel", degree.name)}
                  onMouseEnter={() => handleCardHover(index)}
                  onMouseLeave={() => handleCardHover(null)}
                >
                  <img src={degree.img} alt={degree.name} className="uni-degree-img" />
                  <div className="uni-card-content">
                    <h3>{degree.name}</h3>
                    <p>{degree.desc}</p>
                    <p className="uni-card-duration">Duration: {degree.duration}</p>
                  </div>
                </div>
              ))}
            </div>
            {errors.degreeLevel && <p className="uni-error-text">{errors.degreeLevel}</p>}
          </div>
        );
      case 2:
        return (
          <div className="uni-level-container uni-qualification-stream">
            <div className="uni-options">
              <div className="uni-section">
                <h3 className="uni-sub-title">Current Qualification</h3>
                <div className="uni-options-grid">
                  {currentQualifications[formData.degreeLevel].map((qual, index) => (
                    <div
                      key={qual}
                      className={`uni-option-card ${formData.currentQualification === qual ? "selected" : ""} ${
                        hoverCard === index ? "hovered" : ""
                      }`}
                      onClick={() => handleChange("currentQualification", qual)}
                      onMouseEnter={() => handleCardHover(index)}
                      onMouseLeave={() => handleCardHover(null)}
                    >
                      <h3>{qual}</h3>
                    </div>
                  ))}
                </div>
                {errors.currentQualification && (
                  <p className="uni-error-text">{errors.currentQualification}</p>
                )}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="uni-level-container uni-country">
            <div className="uni-options">
              <div className="uni-section">
                <h3 className="uni-sub-title">Select Country</h3>
                <div className="uni-options-grid">
                  {countries.map((country, index) => (
                    <div
                      key={country}
                      className={`uni-option-card ${formData.country === country ? "selected" : ""} ${
                        hoverCard === index ? "hovered" : ""
                      }`}
                      onClick={() => handleChange("country", country)}
                      onMouseEnter={() => handleCardHover(index)}
                      onMouseLeave={() => handleCardHover(null)}
                    >
                      <h3>{country}</h3>
                    </div>
                  ))}
                </div>
                {errors.country && <p className="uni-error-text">{errors.country}</p>}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="uni-level-container uni-stream-specialization">
            <div className="uni-options">
              <div className="uni-section">
                <h3 className="uni-sub-title">
                  {formData.degreeLevel === "Bachelor's"
                    ? "Intended Stream"
                    : "Intended Specialization"}
                </h3>
                <div className="uni-options-grid">
                  {formData.degreeLevel === "Bachelor's"
                    ? bachelorStreams.map((stream, index) => (
                        <div
                          key={stream}
                          className={`uni-option-card ${formData.stream === stream ? "selected" : ""} ${
                            hoverCard === index ? "hovered" : ""
                          }`}
                          onClick={() => handleChange("stream", stream)}
                          onMouseEnter={() => handleCardHover(index)}
                          onMouseLeave={() => handleCardHover(null)}
                        >
                          <h3>{stream}</h3>
                        </div>
                      ))
                    : specializations[formData.degreeLevel === "Master's" ? "Master's" : formData.degreeLevel].map(
                        (spec, index) => (
                          <div
                            key={spec}
                            className={`uni-option-card ${
                              formData.specialization === spec ? "selected" : ""
                            } ${hoverCard === index ? "hovered" : ""}`}
                            onClick={() => handleChange("specialization", spec)}
                            onMouseEnter={() => handleCardHover(index)}
                            onMouseLeave={() => handleCardHover(null)}
                          >
                            <h3>{spec}</h3>
                          </div>
                        )
                      )}
                </div>
                {errors.stream && <p className="uni-error-text">{errors.stream}</p>}
                {errors.specialization && <p className="uni-error-text">{errors.specialization}</p>}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="uni-level-container uni-budget">
            <div className="uni-options">
              <div className="uni-section">
                <h3 className="uni-sub-title">Annual Budget (USD)</h3>
                <div className="uni-input-container">
                  <input
                    type="number"
                    className="uni-input"
                    placeholder="Enter budget (e.g., 30000)"
                    value={formData.budget}
                    onChange={(e) => handleChange("budget", e.target.value)}
                  />
                  <p className="uni-input-note">Typical range: $5,000 - $80,000/year</p>
                </div>
                {errors.budget && <p className="uni-error-text">{errors.budget}</p>}
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="uni-level-container uni-exams">
            <div className="uni-options">
              <div className="uni-section">
                <h3 className="uni-sub-title">Entrance & Language Exam Scores</h3>
                {getRequiredExams(formData.country, formData.degreeLevel).map((exam, index) => (
                  <div key={exam} className="uni-input-container">
                    <label className="uni-exam-label">{exam}</label>
                    <input
                      type="number"
                      className="uni-input"
                      placeholder={`Enter ${exam} score`}
                      value={formData.exams[exam] || ""}
                      onChange={(e) =>
                        handleChange("exams", { [exam]: e.target.value })
                      }
                    />
                    {errors[exam] && <p className="uni-error-text">{errors[exam]}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="uni-level-container uni-summary-container">
            <div className="uni-summary">
              <p><strong>University Type:</strong> {formData.type}</p>
              <p><strong>Desired Degree Level:</strong> {formData.degreeLevel}</p>
              <p><strong>Current Qualification:</strong> {formData.currentQualification}</p>
              <p><strong>Country:</strong> {formData.country}</p>
              <p>
                <strong>
                  {formData.degreeLevel === "Bachelor's" ? "Intended Stream" : "Specialization"}:
                </strong>{" "}
                {formData.stream || formData.specialization}
              </p>
              <p><strong>Budget:</strong> ${formData.budget}</p>
              <p><strong>Exam Scores:</strong></p>
              {Object.entries(formData.exams).map(([exam, score]) => (
                <p key={exam} className="uni-exam-score">
                  {exam}: {score}
                </p>
              ))}
              {formData.additionalPathway && (
                <p className="uni-pathway-note">
                  <strong>Note:</strong> To pursue this program, you need to{" "}
                  {formData.additionalPathway.toLowerCase()}.
                </p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="uni-container">
        <div className="uni-header">
          <img src={logo} alt="Logo" className="uni-logo" onClick={() => navigate("/Landing")}/>
          {step > 1 && (
            <button
              className="uni-back-btn"
              onClick={handlePrevStep}
              disabled={isLoading}
            >
              <img src={back_btn} alt="Back" />
            </button>
          )}
        </div>

        <div className="uni-progress-bar">
          <div className="uni-progress" style={{ width: `${progress}%` }}></div>
          <div className="uni-progress-steps">
            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
              <span
                key={s}
                className={`uni-step-dot ${step >= s ? "active" : ""}`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className={`uni-content ${isLoading ? "loading" : ""} ${isTransitioning ? "transitioning" : ""}`}>
          {step > 1 && (
            <div className="uni-track">
              Current Track: <span>{formData.degreeLevel}</span> | Step {step} of 7
            </div>
          )}

          <h2 className="uni-step-title">
            {step === 1 && "Choose Your Degree Level"}
            {step === 2 && "Select Your Current Qualification"}
            {step === 3 && "Choose Your Destination Country"}
            {step === 4 && "Define Your Academic Path"}
            {step === 5 && "Set Your Budget"}
            {step === 6 && "Provide Exam Scores"}
            {step === 7 && "Review Your Journey"}
          </h2>

          {renderStepContent()}

          {showErrorOverlay && Object.keys(errors).length > 0 && (
            <div className="uni-error-overlay">
              <div className="uni-error-box">
                <h3>Error</h3>
                {Object.values(errors).map((error, index) => (
                  <p key={index} className="uni-error">
                    {error}
                  </p>
                ))}
                <button className="uni-error-close-btn" onClick={closeErrorOverlay}>
                  Close
                </button>
              </div>
            </div>
          )}

          <div className="uni-nav-buttons">
            {step < 7 && (
              <button
                className="uni-continue-btn"
                onClick={() => handleNextStep(formData)}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Next Step"}
                <img src={continue_btn} alt="Continue" />
              </button>
            )}
            {step === 7 && (
              <button
                className="uni-continue-btn"
                onClick={() =>
                  navigate("/abroadcolleges", { state: { formData } })
                }
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Explore Universities"}
                <img src={continue_btn} alt="Continue" />
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AbroadUniversities;

