import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import { MdOutlineReadMore } from "react-icons/md";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../CSS/IndianUniversities.css";

const IndianUniversities = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData || {};
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [studentPercentage, setStudentPercentage] = useState("");

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get("http://localhost:4501/api/colleges");
        setColleges(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch colleges. Please try again.");
        setLoading(false);
      }
    };
    fetchColleges();
  }, []);

  const filterColleges = () => {
    let filtered = colleges;

    // Apply formData filters from Universities.js
    if (formData.type) {
      filtered = filtered.filter((college) =>
        college.type.toLowerCase().includes(formData.type.toLowerCase())
      );
    }
    filtered = filtered.filter((college) => {
      const degree = college.degreesOffered.find(
        (deg) => deg.level === "Bachelor" || deg.level === formData.degreeLevel
      );
      if (!degree) return false;

      if (formData.state && college.state !== formData.state) return false;
      if (formData.stream === "Arts and Science" && !degree.streams.includes("Psychology")) return false;
      if (formData.specialization) {
        const specializations = Object.values(degree.specializations).flat();
        if (formData.specialization === "Psychology") {
          if (!specializations.some((spec) => spec.includes("Psychology"))) return false;
        } else if (!specializations.includes(formData.specialization)) {
          return false;
        }
      }
      return true;
    });

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter((college) =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const categorizeColleges = (filteredColleges) => {
    if (!studentPercentage) return { elite: [], target: [], guaranteed: [] };

    const percentage = parseFloat(studentPercentage);
    const guaranteedColleges = filteredColleges.filter(
      (college) => percentage >= college.chances + 10
    );
    const targetColleges = filteredColleges.filter(
      (college) => college.chances <= percentage && percentage < college.chances + 10
    );
    const eliteColleges = filteredColleges.filter(
      (college) => percentage < college.chances
    );

    return { elite: eliteColleges, target: targetColleges, guaranteed: guaranteedColleges };
  };

  const filteredColleges = filterColleges();
  const { elite, target, guaranteed } = categorizeColleges(filteredColleges);

  const eliteCount = elite.length;
  const targetCount = target.length;
  const guaranteedCount = guaranteed.length;

  const handleKnowMore = (college) => {
    navigate(`/colleges/${college.id}`, { state: { college, formData } });
  };

  if (loading) {
    return <div className="container text-center mt-5"><h3>Loading...</h3></div>;
  }

  if (error) {
    return <div className="container text-center mt-5"><h3>{error}</h3></div>;
  }

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h2 className="text-center mb-4">Recommended Colleges</h2>

        {/* Filter Box */}
        <div className="filter-container mb-5">
          <h4 className="filter-title">Filter Colleges</h4>
          <div className="filter-grid">
            <input
              type="text"
              className="filter-input"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input
              type="number"
              className="filter-input"
              placeholder="Your Eligibility Percentage (0-100)"
              value={studentPercentage}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || (value >= 0 && value <= 100)) {
                  setStudentPercentage(value);
                }
              }}
              min="0"
              max="100"
            />
          </div>
        </div>

        {/* College Categories */}
        {filteredColleges.length === 0 ? (
          <p className="text-center no-results">No colleges match your criteria.</p>
        ) : studentPercentage === "" ? (
          <p className="text-center no-results">Please enter your eligibility percentage to see categorized colleges.</p>
        ) : (
          <>
            <div className="category-section">
              <h3 className="category-title-coding">Elite (Dream) 🌟 ({eliteCount})</h3>
              <p className="category-desc">Colleges requiring higher performance than yours, making admission unlikely.</p>
              <div className="row">
                {elite.map((college) => (
                  <div className="col-md-6 col-lg-4 mb-4" key={college.id}>
                    <div className="college-card">
                      <h5 className="college-name">{college.name}</h5>
                      <p className="college-info">{college.location}</p>
                      <p className="college-info"><strong>Type:</strong> {college.type}</p>
                      <p className="college-info"><strong>University Type:</strong> {college.universityType}</p>
                      <p className="college-info"><strong>Category:</strong> {college.category}</p>
                      <p className="college-info"><strong>Specialization:</strong> {formData.specialization || "N/A"}</p>
                      <p className="college-info"><strong>Tuition Fee:</strong> ₹{college.degreesOffered[0]?.tuitionFee?.toLocaleString() || "N/A"}/year</p>
                      <p className="college-info"><strong>Duration:</strong> {college.degreesOffered[0]?.durationMonths || "N/A"} months</p>
                      <p className="college-info"><strong>Min Percentage Required:</strong> {college.chances}%</p>
                      <button className="know-more-btn" onClick={() => handleKnowMore(college)}>
                        <MdOutlineReadMore /> Know More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="category-section">
              <h3 className="category-title">Target (Reach) 🎯 ({targetCount})</h3>
              <p className="category-desc">Colleges where your performance is close to the requirement, possible with effort.</p>
              <div className="row">
                {target.map((college) => (
                  <div className="col-md-6 col-lg-4 mb-4" key={college.id}>
                    <div className="college-card">
                      <h5 className="college-name">{college.name}</h5>
                      <p className="college-info">{college.location}</p>
                      <p className="college-info"><strong>Type:</strong> {college.type}</p>
                      <p className="college-info"><strong>University Type:</strong> {college.universityType}</p>
                      <p className="college-info"><strong>Category:</strong> {college.category}</p>
                      <p className="college-info"><strong>Specialization:</strong> {formData.specialization || "N/A"}</p>
                      <p className="college-info"><strong>Tuition Fee:</strong> ₹{college.degreesOffered[0]?.tuitionFee?.toLocaleString() || "N/A"}/year</p>
                      <p className="college-info"><strong>Duration:</strong> {college.degreesOffered[0]?.durationMonths || "N/A"} months</p>
                      <p className="college-info"><strong>Min Percentage Required:</strong> {college.chances}%</p>
                      <button className="know-more-btn" onClick={() => handleKnowMore(college)}>
                        <MdOutlineReadMore /> Know More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="category-section">
              <h3 className="category-title">Guaranteed (Safe) ✅ ({guaranteedCount})</h3>
              <p className="category-desc">Colleges where your performance exceeds the requirement, ensuring admission.</p>
              <div className="row">
                {guaranteed.map((college) => (
                  <div className="col-md-6 col-lg-4 mb-4" key={college.id}>
                    <div className="college-card">
                      <h5 className="college-name">{college.name}</h5>
                      <p className="college-info">{college.location}</p>
                      <p className="college-info"><strong>Type:</strong> {college.type}</p>
                      <p className="college-info"><strong>University Type:</strong> {college.universityType}</p>
                      <p className="college-info"><strong>Category:</strong> {college.category}</p>
                      <p className="college-info"><strong>Specialization:</strong> {formData.specialization || "N/A"}</p>
                      <p className="college-info"><strong>Tuition Fee:</strong> ₹{college.degreesOffered[0]?.tuitionFee?.toLocaleString() || "N/A"}/year</p>
                      <p className="college-info"><strong>Duration:</strong> {college.degreesOffered[0]?.durationMonths || "N/A"} months</p>
                      <p className="college-info"><strong>Min Percentage Required:</strong> {college.chances}%</p>
                      <button className="know-more-btn" onClick={() => handleKnowMore(college)}>
                        <MdOutlineReadMore /> Know More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default IndianUniversities;