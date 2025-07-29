import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { MdOutlineReadMore } from "react-icons/md";
import axios from "axios";
import "../CSS/CollegeList.css";
import dream from "./college_icons/dream.png";
import reach from "./college_icons/reach.png";
import safe from "./college_icons/safe.png";
import Footer from "./Footer";
import Navbar from "./Navbar";

const CollegeList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialFormData = location.state?.formData || {};

  // Filters from form data
  const [selectedType] = useState(initialFormData.type || "Indian");
  const [selectedDegree] = useState(initialFormData.degree || "");
  const [selectedState] = useState(initialFormData.state || "");
  const [selectedBoard] = useState(initialFormData.board || "");
  const [selectedPercentage] = useState(initialFormData.percentage || null);
  const [selectedMajor] = useState(initialFormData.major || "");

  const [colleges, setColleges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMoreDream, setViewMoreDream] = useState(false);
  const [viewMoreReach, setViewMoreReach] = useState(false);
  const [viewMoreSafe, setViewMoreSafe] = useState(false);

  // Additional Filters
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedUniversityType, setSelectedUniversityType] = useState("");
  const [selectedTuitionFee, setSelectedTuitionFee] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");

  // Toggle filter visibility
  const [showFilters, setShowFilters] = useState(false);
  const [showAreaFilter, setShowAreaFilter] = useState(false);
  const [showUniversityTypeFilter, setShowUniversityTypeFilter] = useState(false);
  const [showTuitionFeeFilter, setShowTuitionFeeFilter] = useState(false);
  const [showDurationFilter, setShowDurationFilter] = useState(false);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get("http://localhost:4501/api/colleges");
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

    // Apply form data filters
    if (selectedType) {
      filtered = filtered.filter((college) =>
        college.type.toLowerCase().includes(selectedType.toLowerCase())
      );
    }
    if (selectedDegree) {
      filtered = filtered.filter((college) =>
        college.degreesOffered.some((deg) =>
          deg.level.toLowerCase().includes(selectedDegree.toLowerCase())
        )
      );
    }
    if (selectedState) {
      filtered = filtered.filter((college) =>
        college.state.toLowerCase().includes(selectedState.toLowerCase())
      );
    }
    if (selectedBoard) {
      filtered = filtered.filter((college) =>
        college.acceptedBoards.some((board) =>
          board.toLowerCase().includes(selectedBoard.toLowerCase())
        )
      );
    }
    if (selectedPercentage) {
      filtered = filtered.filter(
        (college) => college.minPercentage <= parseFloat(selectedPercentage)
      );
    }
    if (selectedMajor) {
      filtered = filtered.filter((college) =>
        college.recommendedCourses.some((course) =>
          course.toLowerCase().includes(selectedMajor.toLowerCase())
        )
      );
    }

    // Apply additional filters
    if (searchTerm) {
      filtered = filtered.filter((college) =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedArea) {
      filtered = filtered.filter((college) =>
        college.recommendedCourses.some((course) =>
          course.toLowerCase().includes(selectedArea.toLowerCase())
        )
      );
    }
    if (selectedUniversityType) {
      filtered = filtered.filter((college) =>
        college.universityType.toLowerCase().includes(selectedUniversityType.toLowerCase())
      );
    }
    if (selectedTuitionFee) {
      filtered = filtered.filter((college) =>
        college.degreesOffered.some(
          (deg) => deg.tuitionFee <= parseFloat(selectedTuitionFee)
        )
      );
    }
    if (selectedDuration) {
      filtered = filtered.filter((college) =>
        college.degreesOffered.some(
          (deg) => `${deg.durationMonths} months` === selectedDuration
        )
      );
    }

    return filtered;
  };

  const filteredColleges = filterColleges();

  // Categorize based on chances (adjusted to schema's 0-100 scale)
  const dreamColleges = filteredColleges.filter(
    (college) => parseFloat(college.chances) <= 50
  ); // High competition
  const reachColleges = filteredColleges.filter(
    (college) =>
      parseFloat(college.chances) > 50 && parseFloat(college.chances) <= 80
  ); // Moderate chance
  const safeColleges = filteredColleges.filter(
    (college) => parseFloat(college.chances) > 80
  ); // High admission likelihood

  const dreamCount = dreamColleges.length;
  const reachCount = reachColleges.length;
  const safeCount = safeColleges.length;

  const handleKnowMore = (college) => {
    console.log("Navigating to college with ID:", college.id); // Debug log
    navigate(`/colleges/${college.id}`);
  };

  const renderColleges = (list, limit, viewMoreState, setViewMoreState) => (
    <>
      <div className="row">
        {list.slice(0, viewMoreState ? list.length : limit).map((college) => (
          <div className="col-md-6 mb-4" key={college.id}>
            <div className="card p-3 shadow-sm">
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
              <p>Recommended Courses: {college.recommendedCourses.join(", ")}</p>
              <p>
                Tuition Fee: ₹
                {college.degreesOffered[0]?.tuitionFee?.toLocaleString() || "N/A"}
                /year
              </p>
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
      <div className="container-fluid py-4">
        <div className="row">
          {/* Filter Panel */}
          <div className="col-md-3 mb-4 filter-panel">
            <h5 className="fw-bold">Filters</h5>
            <hr />
            <div className="filter-item">
              <button
                className="btn w-100 text-start filter-btn"
                onClick={() => setShowAreaFilter(!showAreaFilter)}
              >
                <div className={`star ${showAreaFilter ? "filled" : ""}`}>
                  ★ <span className="fs-6 fw-semibold text-dark">Area of Interest</span>
                </div>
                <small className="text-muted ms-4">Filter by specific courses</small>
              </button>
              {showAreaFilter && (
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter course..."
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                />
              )}
            </div>

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
                  <option value="Autonomous">Autonomous</option>
                  <option value="Private">Private</option>
                  <option value="Public">Public</option>
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
                <small className="text-muted ms-4">Filter by max fee (₹)</small>
              </button>
              {showTuitionFeeFilter && (
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max Fee (₹)"
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
                  <option value="24 months">24 months</option>
                  <option value="36 months">36 months</option>
                  <option value="48 months">48 months</option>
                </select>
              )}
            </div>
          </div>

          {/* Colleges List */}
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
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CollegeList;