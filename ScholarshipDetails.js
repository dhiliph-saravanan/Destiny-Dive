import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import logo from "./images/navlogo.png";
import back_btn from "./images/back-btn.png";
import continue_btn from "./images/continue-btn.png";
import Footer from "./Footer";
import Navbar from "./Navbar";
import "../CSS/ScholarshipDetails.css";

const ScholarshipDetails = () => {
  const navigate = useNavigate();

  const initialData = [
    {
      name: "BC/MBC Scholarship",
      description: "For students belonging to BC/MBC categories with family income less than ₹2.5L.",
      eligibility: "Minimum 75% in Class 12. Resident of Tamil Nadu.",
      deadline: "31st January 2025",
    },
    {
      name: "SC/ST Scholarship",
      description: "Financial assistance for SC/ST students pursuing higher education.",
      eligibility: "Minimum 60% in Class 10/12. Annual income below ₹2L.",
      deadline: "28th February 2025",
    },
    {
      name: "Merit-Based Scholarship",
      description: "Scholarship for meritorious students scoring above 90% in academics.",
      eligibility: "Minimum 90% aggregate in Class 12 or equivalent.",
      deadline: "15th March 2025",
    },
    {
      name: "First Graduate Scholarship",
      description: "Support for first-generation graduates from economically weaker sections.",
      eligibility: "First graduate in the family. Family income below ₹3L.",
      deadline: "30th April 2025",
    },
  ];

  const additionalData = [
    {
      name: "National Scholarship",
      description: "A central government scholarship for economically backward students.",
      eligibility: "Minimum 85% in Class 12. Annual income below ₹1.5L.",
      deadline: "15th May 2025",
    },
    {
      name: "Sports Scholarship",
      description: "For students excelling in state/national-level sports competitions.",
      eligibility: "Participation in at least two national-level events.",
      deadline: "10th June 2025",
    },
  ];

  const [scholarshipData, setScholarshipData] = useState(initialData);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSeeMore = () => {
    if (isExpanded) {
      setScholarshipData(initialData);
    } else {
      setScholarshipData([...initialData, ...additionalData]);
    }
    setIsExpanded(!isExpanded);
  };

  const handleViewDetails = (scholarship) => {
    alert(`Viewing details for: ${scholarship.name}`);
  };

  return (
    <>
      <Navbar />
      <div className="position-absolute top-0 end-0 m-3">
        <img src={logo} alt="University Logo" style={{ height: "70px", cursor: "pointer" }} />
      </div>
      <div className="position-absolute top-0 start-0 m-3" onClick={() => navigate(-1)}>
        <img src={back_btn} alt="Back" height="auto" width="50px" />
      </div>
      <div className="container py-5">
        <h2 className="text-center mb-4">Available Scholarships</h2>
        <div className="row">
          {scholarshipData.map((item, index) => (
            <div className="col-md-6 mb-4" key={index}>
              <div className="card scholarship-card">
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text"><strong>Description:</strong> {item.description}</p>
                  <p className="card-text"><strong>Eligibility:</strong> {item.eligibility}</p>
                  <p className="card-text"><strong>Deadline:</strong> {item.deadline}</p>
                </div>
                <div className="card-footer text-center">
                  <button className="btn btn-primary" onClick={() => handleViewDetails(item)}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-center mt-4">
          <button className="see-more-btn" onClick={toggleSeeMore}>
            {isExpanded ? "See Less" : "See More"}
            <img src={continue_btn} className="ms-2" style={{ maxWidth: "2rem", height: "auto" }} alt="Continue" />
          </button>
        </div>
        <p className="trust-note text-center mt-4">
          All scholarships are verified and sourced from official institutions.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default ScholarshipDetails;