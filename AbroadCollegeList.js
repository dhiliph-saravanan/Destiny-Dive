import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { MdOutlineReadMore } from "react-icons/md";
import axios from "axios";
import "../CSS/AbroadCollegeList.css";
import dream from "./college_icons/dream.png";
import reach from "./college_icons/reach.png";
import safe from "./college_icons/safe.png";
import Footer from "./Footer";
import Navbar from "./Navbar";

const AbroadCollegeList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialFormData = location.state?.formData || {};

  const [selectedType] = useState(initialFormData.type || "Abroad");
  const [selectedDegree] = useState(initialFormData.degreeLevel || "");
  const [selectedCountry] = useState(initialFormData.country || "");
  const [selectedStream] = useState(initialFormData.stream || "");
  const [selectedSpecialization] = useState(initialFormData.specialization || "");
  const [selectedBudget] = useState(initialFormData.budget || null);
  const [selectedExams] = useState(initialFormData.exams || {});

  const [colleges, setColleges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMoreDream, setViewMoreDream] = useState(false);
  const [viewMoreReach, setViewMoreReach] = useState(false);
  const [viewMoreSafe, setViewMoreSafe] = useState(false);

  const [selectedUniversityType, setSelectedUniversityType] = useState("");
  const [selectedTuitionFee, setSelectedTuitionFee] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");

  const [showUniversityTypeFilter, setShowUniversityTypeFilter] = useState(false);
  const [showTuitionFeeFilter, setShowTuitionFeeFilter] = useState(false);
  const [showDurationFilter, setShowDurationFilter] = useState(false);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get("http://localhost:4501/api/abroadcolleges");
        console.log("API Response:", response.data); // Debug: Log raw API data
        setColleges(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching colleges:", error);
        setLoading(false);
      }
    };
    fetchColleges();
  }, []);

  const filterColleges = () => {
    let filtered = colleges;

    // Helper function for specialization matching
    const isRelatedSpecialization = (spec, target) => {
      // Exact match first
      if (spec.toLowerCase() === target.toLowerCase()) return true;
      // Related terms for broader matching
      const relatedTerms = {
        "computer science": ["software engineering", "ai", "data science", "cybersecurity", "cloud computing"],
      };
      return (
        relatedTerms[target.toLowerCase()]?.some((term) =>
          spec.toLowerCase().includes(term)
        ) || false
      );
    };

    // Helper function to convert IELTS to TOEFL equivalent
    const convertIeltsToToefl = (ieltsScore) => {
      // Rough conversion: IELTS 9.0 ≈ TOEFL 110-120, 7.0 ≈ TOEFL 94-109
      return Math.min(120, Math.round(ieltsScore * 13.33));
    };

    // Apply filters
    if (selectedCountry) {
      filtered = filtered.filter((college) =>
        college.location.toLowerCase().includes(selectedCountry.toLowerCase())
      );
    }
    if (selectedDegree) {
      filtered = filtered.filter((college) =>
        college.degrees.some((deg) =>
          deg.level.toLowerCase().includes(selectedDegree.toLowerCase())
        )
      );
    }
    if (selectedStream) {
      filtered = filtered.filter((college) =>
        college.degrees.some((deg) =>
          deg.streams?.some((stream) =>
            stream.name.toLowerCase().includes(selectedStream.toLowerCase())
          )
        )
      );
    }
    if (selectedSpecialization) {
      filtered = filtered.filter((college) =>
        college.degrees.some((deg) =>
          deg.streams?.some((stream) =>
            stream.specializations?.some((spec) =>
              isRelatedSpecialization(spec, selectedSpecialization)
            )
          )
        )
      );
    }
    if (selectedBudget) {
      filtered = filtered.filter((college) =>
        college.degrees.some((deg) => deg.tuitionFee <= parseFloat(selectedBudget))
      );
    }
    if (selectedExams && Object.keys(selectedExams).length > 0) {
      filtered = filtered.filter((college) =>
        college.degrees.some((deg) => {
          if (!deg.exams || deg.exams.length === 0) return true; // No exams required
          
          // Check entrance exams (e.g., GRE, GMAT)
          const entranceExams = deg.exams.filter(exam => 
            ["GRE", "GMAT", "SAT/ACT"].includes(exam.name)
          );
          const entranceValid = entranceExams.every((exam) => {
            const userScore = parseFloat(selectedExams[exam.name]);
            return !isNaN(userScore) && userScore >= exam.minScore;
          });

          // Check language exams (TOEFL or IELTS)
          const languageExams = deg.exams.filter(exam => 
            ["TOEFL", "IELTS"].includes(exam.name)
          );
          const languageValid = languageExams.length === 0 || languageExams.some((exam) => {
            if (exam.name === "TOEFL" && selectedExams["TOEFL"]) {
              return parseFloat(selectedExams["TOEFL"]) >= exam.minScore;
            }
            if (exam.name === "TOEFL" && selectedExams["IELTS"]) {
              const toeflEquivalent = convertIeltsToToefl(parseFloat(selectedExams["IELTS"]));
              return toeflEquivalent >= exam.minScore;
            }
            if (exam.name === "IELTS" && selectedExams["IELTS"]) {
              return parseFloat(selectedExams["IELTS"]) >= exam.minScore;
            }
            return false;
          });

          return entranceValid && languageValid;
        })
      );
    }

    // Additional filters
    if (searchTerm) {
      filtered = filtered.filter((college) =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedUniversityType) {
      filtered = filtered.filter((college) =>
        college.universityType.toLowerCase().includes(selectedUniversityType.toLowerCase())
      );
    }
    if (selectedTuitionFee) {
      filtered = filtered.filter((college) =>
        college.degrees.some((deg) => deg.tuitionFee <= parseFloat(selectedTuitionFee))
      );
    }
    if (selectedDuration) {
      filtered = filtered.filter((college) =>
        college.degrees.some((deg) => deg.duration.toLowerCase() === selectedDuration.toLowerCase())
      );
    }

    console.log("Filtered Colleges:", filtered); // Debug: Log filtered results
    return filtered;
  };

  const filteredColleges = filterColleges();

  const dreamColleges = filteredColleges.filter((college) => college.chances <= 50);
  const reachColleges = filteredColleges.filter(
    (college) => college.chances > 50 && college.chances <= 80
  );
  const safeColleges = filteredColleges.filter((college) => college.chances > 80);

  const dreamCount = dreamColleges.length;
  const reachCount = reachColleges.length;
  const safeCount = safeColleges.length;

  const handleKnowMore = (college) => {
    navigate(`/abroadcolleges/${college._id}`, { state: { college } });
  };

  const renderColleges = (list, limit, viewMoreState, setViewMoreState) => (
    <>
      <div className="row">
        {list.slice(0, viewMoreState ? list.length : limit).map((college) => (
          <div className="col-md-6 mb-4" key={college._id}>
            <div className="card p-3 shadow-sm abroad-college-card">
              <h5 className="fw-bold">{college.name}</h5>
              <p className="text-muted">{college.location}</p>
              <p className="d-flex">
                <span>Type: {college.type}</span>
                <span
                  className="text-info ms-auto know-more"
                  onClick={() => handleKnowMore(college)}
                >
                  <MdOutlineReadMore className="fs-3" /> Know More
                </span>
              </p>
              <p>University Type: {college.universityType}</p>
              <p>Tuition Fee: ${college.degrees[0]?.tuitionFee || "N/A"}/year</p>
              <p>Admission Chance: {college.chances}%</p>
            </div>
          </div>
        ))}
      </div>
      {list.length > limit && (
        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn board rounded-5"
            onClick={() => setViewMoreState(!viewMoreState)}
          >
            {viewMoreState ? "View Less" : "View More"}
          </button>
        </div>
      )}
    </>
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4 abroad-college-list">
        <div className="row">
          <div className="col-md-3 mb-4 filter-panel">
            <h5 className="fw-bold">Filters</h5>
            <hr />
            <div className="filter-item">
              <button
                className="btn w-100 text-start filter-btn"
                onClick={() => setShowUniversityTypeFilter(!showUniversityTypeFilter)}
              >
                <div className={`star ${showUniversityTypeFilter ? "filled" : ""}`}>
                  ★ <span className="fs-6 fw-semibold text-dark">University Type</span>
                </div>
                <small className="text-muted ms-4">Filter by university type</small>
              </button>
              {showUniversityTypeFilter && (
                <select
                  className="form-control"
                  value={selectedUniversityType}
                  onChange={(e) => setSelectedUniversityType(e.target.value)}
                >
                  <option value="">Select University Type</option>
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                  <option value="Research">Research</option>
                </select>
              )}
            </div>

            <div className="filter-item">
              <button
                className="btn w-100 text-start filter-btn"
                onClick={() => setShowTuitionFeeFilter(!showTuitionFeeFilter)}
              >
                <div className={`star ${showTuitionFeeFilter ? "filled" : ""}`}>
                  ★ <span className="fs-6 fw-semibold text-dark">Tuition Fee</span>
                </div>
                <small className="text-muted ms-4">Filter by max fee ($)</small>
              </button>
              {showTuitionFeeFilter && (
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max Fee ($)"
                  value={selectedTuitionFee}
                  onChange={(e) => setSelectedTuitionFee(e.target.value)}
                />
              )}
            </div>

            <div className="filter-item">
              <button
                className="btn w-100 text-start filter-btn"
                onClick={() => setShowDurationFilter(!showDurationFilter)}
              >
                <div className={`star ${showDurationFilter ? "filled" : ""}`}>
                  ★ <span className="fs-6 fw-semibold text-dark">Course Duration</span>
                </div>
                <small className="text-muted ms-4">Filter by duration</small>
              </button>
              {showDurationFilter && (
                <select
                  className="form-control"
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                >
                  <option value="">-- Select Duration --</option>
                  <option value="1 year">1 year</option>
                  <option value="2 years">2 years</option>
                  <option value="3 years">3 years</option>
                  <option value="4 years">4 years</option>
                </select>
              )}
            </div>
          </div>

          <div className="col-md-9">
            <div className="mb-4">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for colleges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {filteredColleges.length === 0 && !loading ? (
              <div className="alert alert-info text-center">
                <h5>No colleges found matching your criteria.</h5>
                <p>Try adjusting your filters, such as specialization or exam scores, to see more options.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/abroaduniversities")}
                >
                  Update Criteria
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 d-flex flex-wrap gap-4 justify-content-center align-items-center">
                  <p className="count-display align-items-center gap-2">
                    <img src={dream} alt="Dream Icon" className="icon" />
                    <span className="count fs-4">{dreamCount}</span>
                    <strong className="fs-4 fw-medium">Hope</strong>
                  </p>
                  <p className="count-display align-items-center gap-2">
                    <img src={reach} alt="Reach Icon" className="icon" />
                    <span className="count fs-4">{reachCount}</span>
                    <strong className="fs-4 fw-medium">Approach</strong>
                  </p>
                  <p className="count-display align-items-center gap-2">
                    <img src={safe} alt="Safe Icon" className="icon" />
                    <span className="count fs-4">{safeCount}</span>
                    <strong className="fs-4 fw-medium">Secured</strong>
                  </p>
                </div>

                <div className="clgs p-3">
                  <div className="mb-5">
                    <div className="d-flex gap-3 align-items-center">
                      <img src={dream} alt="Dream Icon" className="icon" />
                      <h4 className="text-dark fw-medium">
                        <span className="count">{dreamCount}</span> Hope Universities
                      </h4>
                    </div>
                    {renderColleges(dreamColleges, 4, viewMoreDream, setViewMoreDream)}
                  </div>

                  <div className="mb-5">
                    <div className="d-flex gap-3 align-items-center">
                      <img src={reach} alt="Reach Icon" className="icon" />
                      <h4 className="text-dark fw-medium">
                        <span className="count">{reachCount}</span> Approach Universities
                      </h4>
                    </div>
                    {renderColleges(reachColleges, 4, viewMoreReach, setViewMoreReach)}
                  </div>

                  <div className="mb-5">
                    <div className="d-flex gap-3 align-items-center">
                      <img src={safe} alt="Safe Icon" className="icon" />
                      <h4 className="text-dark fw-medium">
                        <span className="count">{safeCount}</span> Secure Universities
                      </h4>
                    </div>
                    {renderColleges(safeColleges, 4, viewMoreSafe, setViewMoreSafe)}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AbroadCollegeList;