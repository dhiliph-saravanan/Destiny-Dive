import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Moon, Sun, Search, ChevronLeft, ChevronRight, Star, MapPin, DollarSign, Briefcase, Heart } from "lucide-react";
import '../CSS/recommendedColleges.css';

const CollegeRecommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDomain, submittedData } = location.state || {};

  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [filters, setFilters] = useState({ location: "", ranking: "", fees: "" });
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [savedColleges, setSavedColleges] = useState([]);
  const collegesPerPage = 6;

  useEffect(() => {
    if (selectedDomain) {
      setLoading(true);
      const fetchColleges = async () => {
        try {
          const response = await fetch(`http://localhost:4501/api/colleges?category=${encodeURIComponent(selectedDomain)}`);
          const data = await response.json();
          console.log("Colleges fetched:", data);
          setColleges(data);
          setLoading(false);
        } catch (err) {
          console.error("Fetch Error:", err);
          setError("Failed to load colleges. Please try again.");
          setLoading(false);
        }
      };
      fetchColleges();
    } else {
      setError("No domain selected.");
      setLoading(false);
    }
  }, [selectedDomain]);

  const filteredColleges = colleges.filter((college) => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = filters.location ? college.location.toLowerCase().includes(filters.location.toLowerCase()) : true;
    const matchesRanking = filters.ranking ? college.ranking <= parseInt(filters.ranking) : true;
    const matchesFees = filters.fees ? college.avgFees <= parseInt(filters.fees) : true;
    return matchesSearch && matchesLocation && matchesRanking && matchesFees;
  });

  const indexOfLastCollege = currentPage * collegesPerPage;
  const indexOfFirstCollege = indexOfLastCollege - collegesPerPage;
  const currentColleges = filteredColleges.slice(indexOfFirstCollege, indexOfLastCollege);
  const totalPages = Math.ceil(filteredColleges.length / collegesPerPage);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) setCurrentPage(currentPage + 1);
    if (direction === "prev" && currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleBack = () => {
    navigate("/recommendations", { state: { submittedData } });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  const toggleCollegeSelection = (college) => {
    setSelectedColleges((prev) =>
      prev.includes(college) ? prev.filter((c) => c.id !== college.id) : [...prev, college].slice(0, 3)
    );
  };

  const toggleSaveCollege = (college) => {
    setSavedColleges((prev) =>
      prev.includes(college) ? prev.filter((c) => c.id !== college.id) : [...prev, college]
    );
  };

  const handleViewDetails = (college) => {
    navigate(`/colleges/${college._id}`, { state: { college } });
  };

  return (
    <div className={`rc-container ${darkMode ? "rc-dark-mode" : ""}`}>
      {/* Hero Section */}
      <section className="rc-hero">
        <div className="rc-hero-content">
          <h1>Explore Top Colleges in {selectedDomain || "Your Field"}</h1>
          <div className="rc-hero-search">
            <Search size={24} className="rc-search-icon" />
            <input
              type="text"
              placeholder="Search for colleges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Header */}
      <header className="rc-header">
        <button className="rc-back-btn" onClick={handleBack}>
          <ChevronLeft size={18} /> Back to Recommendations
        </button>
        <div className="rc-actions">
          <button onClick={() => setDarkMode(!darkMode)} className="rc-theme-toggle">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="rc-filters">
        <input
          type="text"
          name="location"
          placeholder="Filter by Location"
          value={filters.location}
          onChange={handleFilterChange}
          className="rc-filter-input"
        />
        <select name="ranking" value={filters.ranking} onChange={handleFilterChange} className="rc-filter-select">
          <option value="">Filter by Ranking</option>
          <option value="50">Top 50</option>
          <option value="100">Top 100</option>
          <option value="200">Top 200</option>
        </select>
        <input
          type="number"
          name="fees"
          placeholder="Max Fees (₹)"
          value={filters.fees}
          onChange={handleFilterChange}
          className="rc-filter-input"
        />
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="rc-loading-container">
          <div className="rc-spinner"></div>
          <p className="rc-loading-text">Loading colleges...</p>
        </div>
      ) : error ? (
        <p className="rc-error-text">{error}</p>
      ) : (
        <>
          {currentColleges.length > 0 ? (
            <div className="rc-grid">
              {currentColleges.map((college, index) => (
                <div
                  key={college.id}
                  className={`rc-college-card ${selectedColleges.includes(college) ? "rc-selected" : ""}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="rc-card-header">
                    <img src={college.logo || "https://via.placeholder.com/50"} alt={college.name} className="rc-college-logo" />
                    <h3>{college.name}</h3>
                    <button
                      className="rc-save-btn"
                      onClick={() => toggleSaveCollege(college)}
                    >
                      <Heart size={20} fill={savedColleges.includes(college) ? "#e74c3c" : "none"} />
                    </button>
                  </div>
                  <div className="rc-card-body">
                    <p><MapPin size={16} /> {college.location}</p>
                    <p><Star size={16} /> Ranking: {college.ranking || "N/A"}</p>
                    <p><Briefcase size={16} /> Top Course: {college.topCourse || "N/A"}</p>
                    <p><DollarSign size={16} /> Avg Fees: ₹{college.avgFees || "N/A"}</p>
                    <p><Star size={16} /> Rating: {college.rating || "N/A"}/5</p>
                  </div>
                  <div className="rc-card-footer">
                    <button onClick={() => toggleCollegeSelection(college)} className="rc-compare-btn">
                      {selectedColleges.includes(college) ? "Remove" : "Compare"}
                    </button>
                    <button
                      onClick={() => handleViewDetails(college)}
                      className="rc-view-details"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="rc-no-data">No colleges found for {selectedDomain}.</p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="rc-pagination">
              <button
                onClick={() => handlePageChange("prev")}
                disabled={currentPage === 1}
                className="rc-pagination-btn"
              >
                <ChevronLeft size={18} /> Prev
              </button>
              <span className="rc-pagination-info">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => handlePageChange("next")}
                disabled={currentPage === totalPages}
                className="rc-pagination-btn"
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* Comparison Section */}
          {selectedColleges.length > 0 && (
            <div className="rc-comparison">
              <h3>Compare Selected Colleges</h3>
              <div className="rc-comparison-grid">
                {selectedColleges.map((college) => (
                  <div key={college.id} className="rc-comparison-card">
                    <h4>{college.name}</h4>
                    <p><MapPin size={16} /> {college.location}</p>
                    <p><Star size={16} /> Ranking: {college.ranking || "N/A"}</p>
                    <p><DollarSign size={16} /> Avg Fees: ₹{college.avgFees || "N/A"}</p>
                    <p><Briefcase size={16} /> Avg Placement: ₹{college.avgPlacement || "N/A"} LPA</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CollegeRecommendations;