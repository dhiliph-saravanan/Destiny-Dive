import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../CSS/EligibilityCheck.css";

const EligibilityCheck = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { College, formData } = location.state || {};

  const [checklist, setChecklist] = useState({
    resume: false,
    sop: false,
    letterOfRecommendation: false,
    essays: false,
    academicTranscript: false,
    applicationForm: false,
    greOrGmat: false,
    englishLanguageTest: false,
    testScores: false,
    englishProficiency: false,
    minimumGrades: false,
    passport: false,
    sat: false,
    validPassport: false,
  });

  if (!College || !formData || !formData.degreeLevel || !formData.currentQualification || !formData.minPercentage) {
    return (
      <div className="eligibility-container">
        <Navbar />
        <h2 className="text-center mt-5">Missing required data. Please go back and complete the form.</h2>
        <button className="btn btn-back" onClick={() => navigate(-1)}>Go Back</button>
        <Footer />
      </div>
    );
  }

  const selectedDegree = College.degrees.find((degree) => degree.level === formData.degreeLevel);

  const checklistItems = [];
  let isEligible = true;

  const addChecklistItem = (id, label, met, required = false) => {
    checklistItems.push({ id, label, met, required });
    if (required && !met) isEligible = false;
  };

  addChecklistItem("resume", "Resume: Provide a current resume", !!formData.resume, true);
  addChecklistItem("sop", "SOP: Submit a Statement of Purpose", !!formData.sop, true);
  addChecklistItem("letterOfRecommendation", "Letter of Recommendation: Provide at least one letter", !!formData.recommendation, true);
  addChecklistItem("essays", "Essays: Submit required essays", !!formData.essays);
  addChecklistItem("academicTranscript", "Academic Transcript: Provide official transcript", !!formData.transcript, true);
  addChecklistItem("applicationForm", "Application Form: Complete the application form", !!formData.application, true);
  addChecklistItem("greOrGmat", "GRE or GMAT Scores: Submit valid scores", !!formData.greGmat);
  addChecklistItem("englishLanguageTest", "IELTS/TOEFL: Provide scores", !!formData.englishTest);
  addChecklistItem("testScores", "Test Scores: Submit additional test scores if required", !!formData.additionalTests);
  addChecklistItem("englishProficiency", "English Proficiency: Meet standards", !!formData.englishProficiency);
  if (selectedDegree) {
    const qualification = selectedDegree.qualifications.find((q) => q.name === formData.currentQualification);
    if (qualification && formData.minPercentage) {
      const meetsGrades = Number(formData.minPercentage) >= qualification.minPercentage;
      addChecklistItem(
        "minimumGrades",
        `Minimum Academic Grades: At least ${qualification.minPercentage}% (Your mark: ${formData.minPercentage}%)`,
        meetsGrades,
        true
      );
    } else {
      addChecklistItem("minimumGrades", "Minimum Academic Grades: Percentage requirement unavailable", false, true);
    }
  } else {
    addChecklistItem("minimumGrades", "Minimum Academic Grades: Program not offered", false, true);
  }
  addChecklistItem("passport", "Passport: Provide a valid passport", !!formData.passport, true);
  addChecklistItem("sat", "SAT: Submit SAT scores if required", !!formData.sat);
  addChecklistItem("validPassport", "Valid Passport: Ensure passport is not expired", !!formData.validPassport, true);

  const handleCheckboxChange = (id) => {
    if (checklistItems.find((item) => item.id === id).met) return;
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleBack = () => navigate(-1);

  return (
    <>
      <Navbar />
      <div className="eligibility-container">
        <div className="eligibility-header">
          <h1>Eligibility Checklist for {College.name}</h1>
          <div className="underline"></div>
        </div>
        <div className="eligibility-content">
          <h2>Verify Your Eligibility</h2>
          <p>Review and check the requirements below to confirm you have met them:</p>
          <div className="eligibility-progress">
            <p>{checklistItems.filter((item) => item.met).length} / {checklistItems.length} requirements met</p>
          </div>
          <div className="eligibility-checklist">
            {checklistItems.map((item) => (
              <div key={item.id} className="checklist-item">
                <input
                  type="checkbox"
                  id={item.id}
                  checked={item.met || checklist[item.id]}
                  onChange={() => handleCheckboxChange(item.id)}
                  disabled={item.met}
                />
                <label htmlFor={item.id} className={item.met ? "eligible" : "not-eligible"}>
                  {item.label}
                  {!item.met && item.id === "resume" && (
                    <span className="action-link">
                      {" "}
                      (<a href="/ProfilePage">Upload now</a>)
                    </span>
                  )}
                </label>
              </div>
            ))}
          </div>
          <div className="eligibility-summary">
            <h3>Eligibility Status</h3>
            <p>
              {isEligible
                ? "You meet all critical eligibility requirements."
                : "You do not meet all critical requirements. Please address the highlighted items."}
            </p>
          </div>
          <div className="eligibility-actions">
            <button className="btn btn-back" onClick={handleBack}>
              Back to College Info
            </button>
            {isEligible && (
              <button
                className="btn btn-apply"
                onClick={() => navigate("/appform", { state: { College, formData } })}
              >
                Apply Now
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EligibilityCheck;