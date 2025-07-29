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

const Universities = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const type = location.state?.type || "Indian";

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: type,
    degreeLevel: "",
    prevQualification: "",
    stream: "",
    cutoffScore: null,
    degreeType: "",
    specialization: "",
    hasEntranceExam: "",
    entranceExam: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showErrorOverlay, setShowErrorOverlay] = useState(false);

  const degreeLevels = [
    { name: "Bachelor", desc: "Undergraduate Degree", img: bachelorsImg },
    { name: "Master", desc: "Postgraduate Degree", img: mastersImg },
    { name: "MBA", desc: "Business Administration", img: mbaImg },
  ];

  const bachelorStreams = ["Engineering", "Arts and Science", "Commerce", "Law", "Medical", "Agriculture"];
  const degreeTypes = ["Science", "Commerce", "Arts and Humanities"];
  const scienceSpecializations = [
    "Computer Science", "Mathematics", "Physics", "Chemistry", "Biotechnology", "Data Science", "Environmental Science", "Geology", "Statistics",
  ];
  const commerceSpecializations = [
    "Accounting", "Finance", "Business Management", "Marketing", "Economics", "International Business", "Entrepreneurship", "Taxation", "Banking",
  ];
  const artsSpecializations = [
    "Literature", "Psychology", "History", "Political Science", "Sociology", "Visual Arts", "Philosophy", "Anthropology", "Linguistics",
  ];
  const lawSpecializations = [
    "Corporate Law", "Criminal Law", "Constitutional Law", "International Law", "Environmental Law", "Intellectual Property Law",
  ];
  const medicalSpecializations = [
    "MBBS", "Nursing", "Pharmacy", "Physiotherapy", "Dentistry", "Ayurveda",
  ];
  const agricultureSpecializations = [
    "Agronomy", "Horticulture", "Agricultural Engineering", "Soil Science", "Plant Pathology",
  ];
  const diplomaSpecializations = [
    "Engineering Diploma", "Medical and Healthcare Diploma", "Business and Management Diploma", "IT and Software Diploma", "Design and Fashion Diploma",
    "Culinary Arts Diploma", "Tourism and Hospitality Diploma", "Aviation Diploma",
  ];
  const masterFields = [
    "Engineering (BE/B.Tech)", "Science (B.Sc, BCA, etc.)", "Commerce (B.Com, BBA, etc.)", "Arts and Humanities (BA, etc.)", "Law (LLB)",
    "Medical (MBBS, BDS, etc.)", "Agriculture (B.Sc Agri, etc.)",
  ];
  const engineeringSpecializations = [
    "Computer Science", "Mechanical", "Civil", "Electrical", "Electronics and Communication", "Aerospace", "Chemical", "Biomedical", "Robotics",
  ];
  const mbaSpecializations = [
    "Accounting", "Finance", "Marketing", "Operations Management", "Human Resources", "Entrepreneurship", "Supply Chain Management",
    "International Business", "Business Analytics", "Digital Marketing",
  ];
  const entranceExams = ["CAT", "XAT", "MAT", "GMAT", "SNAP", "NMAT", "CMAT"];

  useEffect(() => {
    const totalSteps = 4;
    setProgress((step / totalSteps) * 100);
  }, [step]);

  useEffect(() => {
    if (formData.degreeLevel && step === 1) {
      setFormData({
        ...formData,
        prevQualification: "",
        stream: "",
        cutoffScore: null,
        degreeType: "",
        specialization: "",
        hasEntranceExam: "",
        entranceExam: "",
      });
      setErrors({});
      setStep(2);
    }
  }, [formData.degreeLevel]);

  const handleNextStep = (updatedFormData = formData) => {
    const newErrors = {};
    setIsLoading(true);

    if (step === 1 && !updatedFormData.degreeLevel) {
      newErrors.degreeLevel = "Please select a degree level.";
    }
    if (step === 2) {
      if (!updatedFormData.prevQualification) newErrors.prevQualification = "Please select your previous qualification.";
      if (updatedFormData.degreeLevel === "Bachelor" && updatedFormData.prevQualification === "Grade 12th" && !updatedFormData.stream) {
        newErrors.stream = "Please select your intended stream.";
      }
      if (updatedFormData.degreeLevel === "Bachelor" && updatedFormData.prevQualification === "UG Diploma" && !updatedFormData.specialization) {
        newErrors.specialization = "Please select your diploma specialization.";
      }
      if (updatedFormData.degreeLevel === "Master" && !updatedFormData.stream) {
        newErrors.stream = "Please select your previous field of study.";
      }
      if (updatedFormData.degreeLevel === "MBA" && !updatedFormData.hasEntranceExam) {
        newErrors.hasEntranceExam = "Please indicate entrance exam status.";
      }
    }
    if (step === 3) {
      if (updatedFormData.degreeLevel === "Bachelor" && (updatedFormData.stream === "Engineering" || updatedFormData.stream === "Medical" || updatedFormData.stream === "Agriculture") && !updatedFormData.cutoffScore) {
        newErrors.cutoffScore = "Please enter your cutoff score.";
      }
      if (updatedFormData.degreeLevel === "Bachelor" && updatedFormData.stream === "Arts and Science" && !updatedFormData.degreeType) {
        newErrors.degreeType = "Please select a degree type.";
      }
      if (updatedFormData.degreeLevel === "Bachelor" && !updatedFormData.specialization) {
        newErrors.specialization = "Please select a specialization.";
      }
      if (updatedFormData.degreeLevel === "Master" && !updatedFormData.specialization) {
        newErrors.specialization = "Please select a specialization.";
      }
      if (updatedFormData.degreeLevel === "MBA" && updatedFormData.hasEntranceExam === "Yes" && (!updatedFormData.entranceExam || !updatedFormData.cutoffScore)) {
        if (!updatedFormData.entranceExam) newErrors.entranceExam = "Please select an entrance exam.";
        if (!updatedFormData.cutoffScore) newErrors.cutoffScore = "Please enter your score.";
      }
      if (updatedFormData.degreeLevel === "MBA" && !updatedFormData.specialization) {
        newErrors.specialization = "Please select a specialization.";
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setTimeout(() => {
        if (step < 4) setStep(step + 1);
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
        setIsLoading(false);
        setShowErrorOverlay(false);
      }, 300);
    }
  };

  const handleChange = (field, value) => {
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);
    if (errors[field]) setErrors({ ...errors, [field]: "" });
    setShowErrorOverlay(false);

    // Auto-advance to next step if selection is valid
    if (
      (step === 1 && field === "degreeLevel") ||
      (step === 2 && (
        field === "prevQualification" ||
        (formData.degreeLevel === "Bachelor" && formData.prevQualification === "Grade 12th" && field === "stream") ||
        (formData.degreeLevel === "Bachelor" && formData.prevQualification === "UG Diploma" && field === "specialization") ||
        (formData.degreeLevel === "Master" && field === "stream") ||
        (formData.degreeLevel === "MBA" && field === "hasEntranceExam")
      )) ||
      (step === 3 && (
        (formData.degreeLevel === "Bachelor" && field === "specialization") ||
        (formData.degreeLevel === "Master" && field === "specialization") ||
        (formData.degreeLevel === "MBA" && field === "specialization")
      ))
    ) {
      handleNextStep(updatedFormData); // Pass updated form data directly
    }
  };

  const closeErrorOverlay = () => {
    setShowErrorOverlay(false);
  };

  return (
    <>
      <div className="uni-container">
        <div className="uni-header">
          <img src={logo} alt="Logo" className="uni-logo" />
          {step > 1 && (
            <button className="uni-back-btn" onClick={handlePrevStep} disabled={isLoading}>
              <img src={back_btn} alt="Back" />
            </button>
          )}
        </div>

        <div className="uni-progress-bar">
          <div className="uni-progress" style={{ width: `${progress}%` }}></div>
          <div className="uni-progress-steps">
            {[1, 2, 3, 4].map((s) => (
              <span key={s} className={`uni-step-dot ${step >= s ? "active" : ""}`}>{s}</span>
            ))}
          </div>
        </div>

        <div className={`uni-content ${isLoading ? "loading" : ""}`}>
          {step > 1 && (
            <div className="uni-track">
              Current Track: <span>{formData.degreeLevel}</span> | Step {step} of 4
            </div>
          )}

          <h2 className="uni-step-title">
            {step === 1 && "Choose Your Degree Level"}
            {step === 2 && "Select Qualification and Details"}
            {step === 3 && "Specify Academic Details"}
            {step === 4 && "Review Your Selection"}
          </h2>

          {/* Step 1: Degree Selection */}
          {step === 1 && (
            <div className="uni-level-container uni-degree-level">
              <div className="uni-options-grid">
                {degreeLevels.map((degree) => (
                  <div
                    key={degree.name}
                    className={`uni-option-card ${formData.degreeLevel === degree.name ? "selected" : ""}`}
                    onClick={() => handleChange("degreeLevel", degree.name)}
                  >
                    <img src={degree.img} alt={degree.name} className="uni-degree-img" />
                    <h3>{degree.name}</h3>
                    <p>{degree.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Qualification and Stream/Field/Entrance Exam */}
          {step === 2 && (
            <div className="uni-level-container uni-qualification-stream">
              <div className="uni-options">
                <div className="uni-section">
                  <h3 className="uni-sub-title">Previous Qualification</h3>
                  <div className="uni-options-grid">
                    {formData.degreeLevel === "Bachelor" && (
                      <>
                        <div
                          className={`uni-option-card ${formData.prevQualification === "Grade 12th" ? "selected" : ""}`}
                          onClick={() => handleChange("prevQualification", "Grade 12th")}
                        >
                          <h3>Grade 12th</h3>
                        </div>
                        <div
                          className={`uni-option-card ${formData.prevQualification === "UG Diploma" ? "selected" : ""}`}
                          onClick={() => handleChange("prevQualification", "UG Diploma")}
                        >
                          <h3>UG Diploma</h3>
                        </div>
                      </>
                    )}
                    {formData.degreeLevel === "Master" && (
                      <>
                        <div
                          className={`uni-option-card ${formData.prevQualification === "Bachelor’s Degree" ? "selected" : ""}`}
                          onClick={() => handleChange("prevQualification", "Bachelor’s Degree")}
                        >
                          <h3>Bachelor’s Degree</h3>
                        </div>
                        <div
                          className={`uni-option-card ${formData.prevQualification === "Integrated Program" ? "selected" : ""}`}
                          onClick={() => handleChange("prevQualification", "Integrated Program")}
                        >
                          <h3>Integrated Program</h3>
                        </div>
                      </>
                    )}
                    {formData.degreeLevel === "MBA" && (
                      <div
                        className={`uni-option-card ${formData.prevQualification === "Bachelor’s Degree" ? "selected" : ""}`}
                        onClick={() => handleChange("prevQualification", "Bachelor’s Degree")}
                      >
                        <h3>Bachelor’s Degree (Any Stream)</h3>
                      </div>
                    )}
                  </div>
                </div>

                {formData.prevQualification && (
                  <div className="uni-section">
                    <h3 className="uni-sub-title">
                      {formData.degreeLevel === "Bachelor" && formData.prevQualification === "Grade 12th" && "Intended Stream for Bachelor’s"}
                      {formData.degreeLevel === "Bachelor" && formData.prevQualification === "UG Diploma" && "Diploma Specialization"}
                      {formData.degreeLevel === "Master" && "Previous Field of Study"}
                      {formData.degreeLevel === "MBA" && "Entrance Exam Status"}
                    </h3>
                    <div className="uni-options-grid">
                      {formData.degreeLevel === "Bachelor" && formData.prevQualification === "Grade 12th" && (
                        <>
                          {bachelorStreams.map((stream) => (
                            <div
                              key={stream}
                              className={`uni-option-card ${formData.stream === stream ? "selected" : ""}`}
                              onClick={() => handleChange("stream", stream)}
                            >
                              <h3>{stream}</h3>
                            </div>
                          ))}
                        </>
                      )}
                      {formData.degreeLevel === "Bachelor" && formData.prevQualification === "UG Diploma" && (
                        <>
                          {diplomaSpecializations.map((spec) => (
                            <div
                              key={spec}
                              className={`uni-option-card ${formData.specialization === spec ? "selected" : ""}`}
                              onClick={() => handleChange("specialization", spec)}
                            >
                              <h3>{spec}</h3>
                            </div>
                          ))}
                        </>
                      )}
                      {formData.degreeLevel === "Master" && (
                        <>
                          {masterFields.map((field) => (
                            <div
                              key={field}
                              className={`uni-option-card ${formData.stream === field ? "selected" : ""}`}
                              onClick={() => handleChange("stream", field)}
                            >
                              <h3>{field}</h3>
                            </div>
                          ))}
                        </>
                      )}
                      {formData.degreeLevel === "MBA" && (
                        <>
                          <div
                            className={`uni-option-card ${formData.hasEntranceExam === "Yes" ? "selected" : ""}`}
                            onClick={() => handleChange("hasEntranceExam", "Yes")}
                          >
                            <h3>Yes, Exam-based Admission</h3>
                          </div>
                          <div
                            className={`uni-option-card ${formData.hasEntranceExam === "No" ? "selected" : ""}`}
                            onClick={() => handleChange("hasEntranceExam", "No")}
                          >
                            <h3>No, Direct Admission</h3>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Academic Details */}
          {step === 3 && (
            <div className="uni-level-container uni-academic-details">
              <div className="uni-options">
                {formData.degreeLevel === "Bachelor" && (formData.stream === "Engineering" || formData.stream === "Medical" || formData.stream === "Agriculture") && (
                  <div className="uni-section">
                    <h3 className="uni-sub-title">Cutoff Score</h3>
                    <div className="uni-input-container">
                      <input
                        type="number"
                        className="uni-input"
                        placeholder="Enter your cutoff score in % (0-100)"
                        value={formData.cutoffScore || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || (value >= 0 && value <= 100)) handleChange("cutoffScore", value);
                        }}
                      />
                    </div>
                  </div>
                )}

                {formData.degreeLevel === "Bachelor" && formData.stream === "Arts and Science" && (
                  <div className="uni-section">
                    <h3 className="uni-sub-title">Degree Type</h3>
                    <div className="uni-options-grid">
                      {degreeTypes.map((type) => (
                        <div
                          key={type}
                          className={`uni-option-card ${formData.degreeType === type ? "selected" : ""}`}
                          onClick={() => handleChange("degreeType", type)}
                        >
                          <h3>{type}</h3>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="uni-section">
                  <h3 className="uni-sub-title">Specialization</h3>
                  <div className="uni-options-grid">
                    {formData.degreeLevel === "Bachelor" && formData.prevQualification !== "UG Diploma" && (
                      <>
                        {(formData.stream === "Engineering" ? engineeringSpecializations : formData.stream === "Arts and Science" ? (formData.degreeType === "Science" ? scienceSpecializations : formData.degreeType === "Commerce" ? commerceSpecializations : artsSpecializations) : formData.stream === "Commerce" ? commerceSpecializations : formData.stream === "Law" ? lawSpecializations : formData.stream === "Medical" ? medicalSpecializations : agricultureSpecializations).map((spec) => (
                          <div
                            key={spec}
                            className={`uni-option-card ${formData.specialization === spec ? "selected" : ""}`}
                            onClick={() => handleChange("specialization", spec)}
                          >
                            <h3>{spec}</h3>
                          </div>
                        ))}
                      </>
                    )}
                    {formData.degreeLevel === "Master" && (
                      <>
                        {(formData.stream === "Engineering (BE/B.Tech)" ? engineeringSpecializations : formData.stream === "Science (B.Sc, BCA, etc.)" ? scienceSpecializations : formData.stream === "Commerce (B.Com, BBA, etc.)" ? commerceSpecializations : formData.stream === "Law (LLB)" ? lawSpecializations : formData.stream === "Medical (MBBS, BDS, etc.)" ? medicalSpecializations : formData.stream === "Agriculture (B.Sc Agri, etc.)" ? agricultureSpecializations : artsSpecializations).map((spec) => (
                          <div
                            key={spec}
                            className={`uni-option-card ${formData.specialization === spec ? "selected" : ""}`}
                            onClick={() => handleChange("specialization", spec)}
                          >
                            <h3>{spec}</h3>
                          </div>
                        ))}
                      </>
                    )}
                    {formData.degreeLevel === "MBA" && (
                      <>
                        {mbaSpecializations.map((spec) => (
                          <div
                            key={spec}
                            className={`uni-option-card ${formData.specialization === spec ? "selected" : ""}`}
                            onClick={() => handleChange("specialization", spec)}
                          >
                            <h3>{spec}</h3>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>

                {formData.degreeLevel === "MBA" && formData.hasEntranceExam === "Yes" && (
                  <div className="uni-section">
                    <h3 className="uni-sub-title">Entrance Exam Details</h3>
                    <div className="uni-input-container">
                      <select className="uni-select" value={formData.entranceExam} onChange={(e) => handleChange("entranceExam", e.target.value)}>
                        <option value="">Select Exam</option>
                        {entranceExams.map((exam) => (
                          <option key={exam} value={exam}>{exam}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        className="uni-input"
                        placeholder="Enter your exam score (0-100)"
                        value={formData.cutoffScore || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || (value >= 0 && value <= 100)) handleChange("cutoffScore", value);
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Summary */}
          {step === 4 && (
            <div className="uni-level-container uni-summary-container">
              <div className="uni-summary">
                <p><strong>University Type:</strong> {formData.type}</p>
                <p><strong>Degree Level:</strong> {formData.degreeLevel}</p>
                <p><strong>Previous Qualification:</strong> {formData.prevQualification}</p>
                {formData.degreeLevel === "Bachelor" && (
                  <>
                    <p><strong>{formData.prevQualification === "Grade 12th" ? "Intended Stream" : "Diploma Specialization"}:</strong> {formData.stream || formData.specialization}</p>
                    {(formData.stream === "Engineering" || formData.stream === "Medical" || formData.stream === "Agriculture") && <p><strong>Cutoff Score:</strong> {formData.cutoffScore}%</p>}
                    {formData.stream === "Arts and Science" && <p><strong>Degree Type:</strong> {formData.degreeType}</p>}
                    {formData.prevQualification !== "UG Diploma" && <p><strong>Specialization:</strong> {formData.specialization}</p>}
                  </>
                )}
                {formData.degreeLevel === "Master" && (
                  <>
                    <p><strong>Previous Field:</strong> {formData.stream}</p>
                    <p><strong>Specialization:</strong> {formData.specialization}</p>
                  </>
                )}
                {formData.degreeLevel === "MBA" && (
                  <>
                    <p><strong>Entrance Exam:</strong> {formData.hasEntranceExam === "Yes" ? formData.entranceExam : "Direct Admission"}</p>
                    {formData.hasEntranceExam === "Yes" && <p><strong>Entrance Exam Score:</strong> {formData.cutoffScore}%</p>}
                    <p><strong>Specialization:</strong> {formData.specialization}</p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Error Overlay */}
          {showErrorOverlay && Object.keys(errors).length > 0 && (
            <div className="uni-error-overlay">
              <div className="uni-error-box">
                <h3>Error</h3>
                {Object.values(errors).map((error, index) => (
                  <p key={index} className="uni-error">{error}</p>
                ))}
                <button className="uni-error-close-btn" onClick={closeErrorOverlay}>
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="uni-nav-buttons">
              <button className="uni-continue-btn" onClick={() => handleNextStep(formData)} disabled={isLoading}>
                {isLoading ? "Processing..." : "Next Step"}
                <img src={continue_btn} alt="Continue" />
              </button>
            </div>
          )}
          {step === 4 && (
            <div className="uni-nav-buttons">
              <button className="uni-continue-btn" onClick={() => navigate("/indianuniversities", { state: { formData } })} disabled={isLoading}>
                {isLoading ? "Loading..." : "View Recommended Colleges"}
                <img src={continue_btn} alt="Continue" />
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Universities;