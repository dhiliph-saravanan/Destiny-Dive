import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaFilter, FaStar, FaMapMarkerAlt, FaBed, FaCalendarAlt, FaMoneyBillWave, FaUniversity } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./Footer";
import Navbar from "./Navbar";
import back_btn from "./images/back-btn.png";
import continue_btn from "./images/continue-btn.png";
import chennai from "./images/chennai.png";
import banglore from "./images/banglore.png";
import Coimbatore from "./images/coimbatore.png";
import erode from "./accommodation-images/erode.png";
import madurai from "./accommodation-images/madurai.png";
import trichy from "./accommodation-images/trichy.png";
import vellore from "./accommodation-images/vellore.png";
import pg from "./images/pg.png";
import "../CSS/accommodation.css";

const Accommodation = () => {
  const [step, setStep] = useState(1);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPG, setSelectedPG] = useState({});
  const [searchCity, setSearchCity] = useState("");
  const [formData, setFormData] = useState({
    roomType: "",
    stayDuration: "",
    moveInDate: "",
    moveOutDate: "",
    fullName: "",
    email: "",
    city: "",
    gender: "",
    mobileNo: "",
    country: "",
    state: "",
    address: "",
    universityName: "",
    courseName: "",
    enrolmentStatus: "",
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [pgLimit, setPGLimit] = useState(4);
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter states
  const [universityFilter, setUniversityFilter] = useState("");
  const [localityFilter, setLocalityFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [moveInMonthFilter, setMoveInMonthFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState("");
  const [roomTypeFilter, setRoomTypeFilter] = useState("");

  // Filter visibility states
  const [showUniversityFilter, setShowUniversityFilter] = useState(false);
  const [showLocalityFilter, setShowLocalityFilter] = useState(false);
  const [showBudgetFilter, setShowBudgetFilter] = useState(false);
  const [showMoveInMonthFilter, setShowMoveInMonthFilter] = useState(false);
  const [showDurationFilter, setShowDurationFilter] = useState(false);
  const [showRoomTypeFilter, setShowRoomTypeFilter] = useState(false);

  // Additional interactive states
  const [hoveredCity, setHoveredCity] = useState(null);
  const [hoveredPG, setHoveredPG] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortOption, setSortOption] = useState("name");

  const cities = [
    { name: "Coimbatore", image: Coimbatore, description: "A bustling industrial city with top colleges." },
    { name: "Bangalore", image: banglore, description: "The Silicon Valley of India." },
    { name: "Chennai", image: chennai, description: "Cultural capital with historic charm." },
    { name: "Erode", image: erode, description: "Known for its textile industry." },
    { name: "Trichy", image: trichy, description: "Famous for its rock fort and temples." },
    { name: "Madurai", image: madurai, description: "The city of temples and history." },
    { name: "Salem", image: vellore, description: "A city of steel and mangoes." },
    { name: "Vellore", image: vellore, description: "Home to prestigious institutions like VIT." },
  ];

  // Fetch accommodations from backend
  useEffect(() => {
    const fetchAccommodations = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:4501/api/accommodations");
        if (!response.ok) throw new Error("Failed to fetch accommodations");
        const data = await response.json();
        setPgs(data.map(pg => ({
          ...pg,
          id: pg._id,
          rating: Math.floor(Math.random() * 5) + 1 // Mock rating for now
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAccommodations();
  }, []);

  // Filter and sort PGs
  const filteredPGs = pgs
    .filter((pg) => pg.city === selectedCity)
    .filter((pg) => pg.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((pg) =>
      universityFilter
        ? pg.university?.toLowerCase().includes(universityFilter.toLowerCase())
        : true
    )
    .filter((pg) =>
      localityFilter
        ? pg.locality?.toLowerCase().includes(localityFilter.toLowerCase())
        : true
    )
    .filter((pg) =>
      budgetFilter
        ? parseInt(pg.rent.replace(/\D/g, "")) <= parseInt(budgetFilter)
        : true
    )
    .filter((pg) =>
      moveInMonthFilter ? pg.moveInMonth === moveInMonthFilter : true
    )
    .filter((pg) =>
      durationFilter ? pg.duration >= parseInt(durationFilter) : true
    )
    .filter((pg) => (roomTypeFilter ? pg.roomType === roomTypeFilter : true))
    .filter((pg) => pg.rating >= ratingFilter)
    .sort((a, b) => {
      switch (sortOption) {
        case "name": return a.name.localeCompare(b.name);
        case "rent": return parseInt(a.rent.replace(/\D/g, "")) - parseInt(b.rent.replace(/\D/g, ""));
        case "rating": return b.rating - a.rating;
        default: return 0;
      }
    });

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setStep(2);
    setSearchTerm("");
    setPGLimit(4);
  };

  const handleSearchCity = () => {
    return cities.filter((city) =>
      city.name.toLowerCase().includes(searchCity.toLowerCase())
    );
  };

  const handlePGSelect = (pg) => {
    setSelectedPG(pg);
    setStep(3);
  };

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.mobileNo) newErrors.mobileNo = "Mobile No is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setStep(4);
    }
  };

  const handleBookingSubmit = async () => {
    const newErrors = {};
    if (!formData.roomType) newErrors.roomType = "Room Type is required";
    if (!formData.stayDuration) newErrors.stayDuration = "Stay Duration is required";
    if (!formData.moveInDate) newErrors.moveInDate = "Move In Date is required";
    if (!formData.moveOutDate) newErrors.moveOutDate = "Move Out Date is required";
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.mobileNo) newErrors.mobileNo = "Mobile No is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.universityName) newErrors.universityName = "University Name is required";
    if (!formData.courseName) newErrors.courseName = "Course Name is required";
    if (!formData.enrolmentStatus) newErrors.enrolmentStatus = "Enrolment Status is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch("http://localhost:4501/api/accommodations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, ...selectedPG }),
        });
        if (!response.ok) throw new Error("Failed to submit booking");
        alert("Booking successful!");
        setStep(1);
        setFormData({
          roomType: "",
          stayDuration: "",
          moveInDate: "",
          moveOutDate: "",
          fullName: "",
          email: "",
          city: "",
          gender: "",
          mobileNo: "",
          country: "",
          state: "",
          address: "",
          universityName: "",
          courseName: "",
          enrolmentStatus: "",
        });
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSeeMore = () => {
    setPGLimit(pgLimit + 4);
  };

  const handleShowDetails = (pg) => {
    setSelectedPG(pg);
    setShowDetailsModal(true);
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <FaStar key={i} className={i < rating ? "text-warning" : "text-muted"} />
    ));
  };

  // Extended logic for interactivity
  const handleCityHover = (city) => setHoveredCity(city);
  const handleCityLeave = () => setHoveredCity(null);
  const handlePGHover = (pg) => setHoveredPG(pg);
  const handlePGLeave = () => setHoveredPG(null);

  // Form input handlers
  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  // Filter reset
  const resetFilters = () => {
    setUniversityFilter("");
    setLocalityFilter("");
    setBudgetFilter("");
    setMoveInMonthFilter("");
    setDurationFilter("");
    setRoomTypeFilter("");
    setRatingFilter(0);
    setSortOption("name");
  };

  // Dummy data for additional interactivity (can be removed once backend is fully integrated)
  const amenitiesList = ["WiFi", "AC", "Food", "Laundry", "Parking", "Gym", "Security"];

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container my-5 professional-bg"
      >
        {step > 1 && (
          <motion.div
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            className="position-absolute top-0 start-0 m-3"
            onClick={handleBack}
            style={{ cursor: "pointer", zIndex: 1000 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <img src={back_btn} alt="Back" height="50px" width="auto" />
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="city-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-5">
                <motion.h2
                  className="fw-bold text-accent"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Find Your Perfect Accommodation
                </motion.h2>
                <motion.h5
                  className="fw-medium text-muted"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Explore student housing near top colleges
                </motion.h5>
              </div>

              <div className="mb-4 d-flex justify-content-center">
                <motion.div
                  className="input-group w-75"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="input-group-text bg-accent text-white">
                    <FaSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control search-bar"
                    placeholder="Search for a city..."
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-accent"
                    onClick={handleSearchCity}
                  >
                    Search
                  </motion.button>
                </motion.div>
              </div>

              <div className="row justify-content-center">
                {handleSearchCity().map((city, index) => (
                  <motion.div
                    key={index}
                    className="col-md-3 col-sm-6 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onMouseEnter={() => handleCityHover(city.name)}
                    onMouseLeave={handleCityLeave}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div
                      className="card city-card"
                      onClick={() => handleCitySelect(city.name)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={city.image}
                        className="card-img-top"
                        alt={city.name}
                      />
                      <div className="card-body text-center">
                        <h5 className="card-title text-accent">{city.name}</h5>
                        {hoveredCity === city.name && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-muted small"
                          >
                            {city.description}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="pg-listings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h2
                className="text-center mb-4 text-accent"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                Available PGs in {selectedCity}
              </motion.h2>

              {loading && (
                <motion.div
                  className="text-center my-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="spinner-border text-accent" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  className="alert alert-danger text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {error}
                </motion.div>
              )}

              {!loading && !error && (
                <>
                  <div className="mb-4 d-flex justify-content-between align-items-center">
                    <motion.div
                      className="input-group w-50"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                    >
                      <span className="input-group-text bg-accent text-white">
                        <FaSearch />
                      </span>
                      <input
                        type="text"
                        className="form-control search-bar"
                        placeholder="Search PGs by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </motion.div>
                    <motion.select
                      className="form-select w-25 sort-select"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      whileHover={{ scale: 1.05 }}
                    >
                      <option value="name">Sort by Name</option>
                      <option value="rent">Sort by Rent</option>
                      <option value="rating">Sort by Rating</option>
                    </motion.select>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-outline-accent w-100 mb-2"
                        onClick={() => setShowUniversityFilter(!showUniversityFilter)}
                      >
                        <FaUniversity /> University
                      </motion.button>
                      <AnimatePresence>
                        {showUniversityFilter && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <input
                              type="text"
                              className="form-control filter-input"
                              placeholder="Enter university"
                              value={universityFilter}
                              onChange={(e) => setUniversityFilter(e.target.value)}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="col-md-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-outline-accent w-100 mb-2"
                        onClick={() => setShowLocalityFilter(!showLocalityFilter)}
                      >
                        <FaMapMarkerAlt /> Locality
                      </motion.button>
                      <AnimatePresence>
                        {showLocalityFilter && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <select
                              className="form-control filter-select"
                              value={localityFilter}
                              onChange={(e) => setLocalityFilter(e.target.value)}
                            >
                              <option value="">All Localities</option>
                              <option value="RS Puram">RS Puram</option>
                              <option value="Saibaba Colony">Saibaba Colony</option>
                              <option value="Gandhipuram">Gandhipuram</option>
                              <option value="Peelamedu">Peelamedu</option>
                              <option value="Race Course">Race Course</option>
                            </select>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="col-md-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-outline-accent w-100 mb-2"
                        onClick={() => setShowBudgetFilter(!showBudgetFilter)}
                      >
                        <FaMoneyBillWave /> Budget
                      </motion.button>
                      <AnimatePresence>
                        {showBudgetFilter && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <input
                              type="number"
                              className="form-control filter-input"
                              placeholder="Max budget (Rs)"
                              value={budgetFilter}
                              onChange={(e) => setBudgetFilter(e.target.value)}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="col-md-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-outline-accent w-100 mb-2"
                        onClick={() => setShowMoveInMonthFilter(!showMoveInMonthFilter)}
                      >
                        <FaCalendarAlt /> Move-in
                      </motion.button>
                      <AnimatePresence>
                        {showMoveInMonthFilter && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <select
                              className="form-control filter-select"
                              value={moveInMonthFilter}
                              onChange={(e) => setMoveInMonthFilter(e.target.value)}
                            >
                              <option value="">Any Month</option>
                              <option value="January">January</option>
                              <option value="February">February</option>
                              <option value="March">March</option>
                              <option value="April">April</option>
                              <option value="May">May</option>
                              <option value="June">June</option>
                              <option value="July">July</option>
                              <option value="August">August</option>
                              <option value="September">September</option>
                              <option value="October">October</option>
                              <option value="November">November</option>
                              <option value="December">December</option>
                            </select>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="col-md-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-outline-accent w-100 mb-2"
                        onClick={() => setShowDurationFilter(!showDurationFilter)}
                      >
                        <FaCalendarAlt /> Duration
                      </motion.button>
                      <AnimatePresence>
                        {showDurationFilter && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <input
                              type="number"
                              className="form-control filter-input"
                              placeholder="Min months"
                              value={durationFilter}
                              onChange={(e) => setDurationFilter(e.target.value)}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="col-md-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-outline-accent w-100 mb-2"
                        onClick={() => setShowRoomTypeFilter(!showRoomTypeFilter)}
                      >
                        <FaBed /> Room Type
                      </motion.button>
                      <AnimatePresence>
                        {showRoomTypeFilter && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <select
                              className="form-control filter-select"
                              value={roomTypeFilter}
                              onChange={(e) => setRoomTypeFilter(e.target.value)}
                            >
                              <option value="">Any Type</option>
                              <option value="Single">Single</option>
                              <option value="Double Sharing">Double Sharing</option>
                              <option value="Triple Sharing">Triple Sharing</option>
                            </select>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="mb-4 d-flex justify-content-between">
                    <motion.div className="d-flex align-items-center">
                      <span className="me-2 text-accent">Filter by Rating:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.span
                          key={star}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setRatingFilter(star)}
                          className={`cursor-pointer ${ratingFilter >= star ? "text-warning" : "text-muted"}`}
                        >
                          <FaStar />
                        </motion.span>
                      ))}
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-outline-danger"
                      onClick={resetFilters}
                    >
                      Reset Filters
                    </motion.button>
                  </div>

                  <div className="row">
                    {filteredPGs.slice(0, pgLimit).map((pg) => (
                      <motion.div
                        key={pg.id}
                        className="col-md-4 col-sm-6 mb-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        onMouseEnter={() => handlePGHover(pg)}
                        onMouseLeave={handlePGLeave}
                      >
                        <div className="card pg-card">
                          <img
                            src={pg.img || pg}
                            className="card-img-top"
                            alt={pg.name}
                            style={{ height: "200px", objectFit: "cover" }}
                          />
                          <div className="card-body">
                            <h5 className="card-title text-accent">{pg.name}</h5>
                            <p className="card-text text-muted">
                              <FaMoneyBillWave /> {pg.rent}
                            </p>
                            <p className="card-text text-muted">
                              <FaMapMarkerAlt /> {pg.locality || "N/A"}
                            </p>
                            <p className="card-text text-muted">
                              <FaUniversity /> {pg.university || "N/A"}
                            </p>
                            <div className="d-flex align-items-center mb-2">
                              {renderStars(pg.rating)}
                            </div>
                            {hoveredPG === pg && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-2"
                              >
                                <button
                                  className="btn btn-outline-accent w-100"
                                  onClick={() => handleShowDetails(pg)}
                                >
                                  View Details
                                </button>
                              </motion.div>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="btn btn-accent w-100 mt-2"
                              onClick={() => handlePGSelect(pg)}
                            >
                              Enquire Now
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {pgLimit < filteredPGs.length && (
                    <div className="text-center mt-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-outline-accent"
                        onClick={handleSeeMore}
                      >
                        Load More
                      </motion.button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="enquiry-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h2
                className="text-center mb-4 text-accent"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                Enquire About {selectedPG.name}
              </motion.h2>

              <motion.div
                className="card mb-4"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="row g-0">
                  <div className="col-md-4">
                    <img
                      src={selectedPG.img || pg}
                      className="img-fluid rounded-start"
                      alt={selectedPG.name}
                      style={{ height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title text-accent">{selectedPG.name}</h5>
                      <p><FaMoneyBillWave /> <b>Rent:</b> {selectedPG.rent}</p>
                      <p><FaMapMarkerAlt /> <b>Locality:</b> {selectedPG.locality || "N/A"}</p>
                      <p><FaUniversity /> <b>University:</b> {selectedPG.university || "N/A"}</p>
                      <p><FaBed /> <b>Room Type:</b> {selectedPG.roomType || "N/A"}</p>
                      <p><FaCalendarAlt /> <b>Move-in:</b> {selectedPG.moveInMonth || "N/A"}</p>
                      <div>{renderStars(selectedPG.rating)}</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <form onSubmit={handleEnquirySubmit}>
                <div className="mb-3">
                  <label className="form-label text-accent">Full Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.fullName && "is-invalid"}`}
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange("fullName")}
                  />
                  {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label text-accent">Email</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email && "is-invalid"}`}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange("email")}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label text-accent">Mobile Number</label>
                  <input
                    type="text"
                    className={`form-control ${errors.mobileNo && "is-invalid"}`}
                    placeholder="Enter your mobile number"
                    value={formData.mobileNo}
                    onChange={handleInputChange("mobileNo")}
                  />
                  {errors.mobileNo && <div className="invalid-feedback">{errors.mobileNo}</div>}
                </div>
                <div className="d-flex justify-content-center mt-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="continue-btn rounded-5"
                    type="submit"
                  >
                    Proceed to Booking
                    <img src={continue_btn} className="ms-1" style={{ maxWidth: "2rem" }} alt="Continue" />
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="booking-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h2
                className="text-center mb-4 text-accent"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                Book {selectedPG.name}
              </motion.h2>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-accent">Room Type</label>
                  <select
                    className={`form-control ${errors.roomType && "is-invalid"}`}
                    value={formData.roomType}
                    onChange={handleInputChange("roomType")}
                  >
                    <option value="">Select Room Type</option>
                    <option value="Single">Single</option>
                    <option value="Double Sharing">Double Sharing</option>
                    <option value="Triple Sharing">Triple Sharing</option>
                  </select>
                  {errors.roomType && <div className="invalid-feedback">{errors.roomType}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label text-accent">Stay Duration</label>
                  <select
                    className={`form-control ${errors.stayDuration && "is-invalid"}`}
                    value={formData.stayDuration}
                    onChange={handleInputChange("stayDuration")}
                  >
                    <option value="">Select Duration</option>
                    <option value="1 week">1 week</option>
                    <option value="2 weeks">2 weeks</option>
                    <option value="1 month">1 month</option>
                    <option value="2 months">2 months</option>
                    <option value="6 months">6 months</option>
                    <option value="12 months">12 months</option>
                  </select>
                  {errors.stayDuration && <div className="invalid-feedback">{errors.stayDuration}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label text-accent">Move In Date</label>
                  <input
                    type="date"
                    className={`form-control ${errors.moveInDate && "is-invalid"}`}
                    value={formData.moveInDate}
                    onChange={handleInputChange("moveInDate")}
                  />
                  {errors.moveInDate && <div className="invalid-feedback">{errors.moveInDate}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label text-accent">Move Out Date</label>
                  <input
                    type="date"
                    className={`form-control ${errors.moveOutDate && "is-invalid"}`}
                    value={formData.moveOutDate}
                    onChange={handleInputChange("moveOutDate")}
                  />
                  {errors.moveOutDate && <div className="invalid-feedback">{errors.moveOutDate}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label text-accent">Full Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.fullName && "is-invalid"}`}
                    value={formData.fullName}
                    onChange={handleInputChange("fullName")}
                  />
                  {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label text-accent">Email</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email && "is-invalid"}`}
                    value={formData.email}
                    onChange={handleInputChange("email")}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label text-accent">City</label>
                  <input
                    type="text"
                    className={`form-control ${errors.city && "is-invalid"}`}
                    value={formData.city}
                    onChange={handleInputChange("city")}
                  />
                  {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label text-accent">Gender</label>
                  <select
                    className={`form-control ${errors.gender && "is-invalid"}`}
                    value={formData.gender}
                    onChange={handleInputChange("gender")}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label text-accent">Mobile No</label>
                  <input
                    type="text"
                    className={`form-control ${errors.mobileNo && "is-invalid"}`}
                    value={formData.mobileNo}
                    onChange={handleInputChange("mobileNo")}
                  />
                  {errors.mobileNo && <div className="invalid-feedback">{errors.mobileNo}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label text-accent">Country</label>
                  <input
                    type="text"
                    className={`form-control ${errors.country && "is-invalid"}`}
                    value={formData.country}
                    onChange={handleInputChange("country")}
                  />
                  {errors.country && <div className="invalid-feedback">{errors.country}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label text-accent">State</label>
                  <input
                    type="text"
                    className={`form-control ${errors.state && "is-invalid"}`}
                    value={formData.state}
                    onChange={handleInputChange("state")}
                  />
                  {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label text-accent">Address</label>
                  <input
                    type="text"
                    className={`form-control ${errors.address && "is-invalid"}`}
                    value={formData.address}
                    onChange={handleInputChange("address")}
                  />
                  {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label text-accent">University Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.universityName && "is-invalid"}`}
                    value={formData.universityName}
                    onChange={handleInputChange("universityName")}
                  />
                  {errors.universityName && <div className="invalid-feedback">{errors.universityName}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label text-accent">Course Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.courseName && "is-invalid"}`}
                    value={formData.courseName}
                    onChange={handleInputChange("courseName")}
                  />
                  {errors.courseName && <div className="invalid-feedback">{errors.courseName}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label text-accent">Enrolment Status</label>
                  <select
                    className={`form-control ${errors.enrolmentStatus && "is-invalid"}`}
                    value={formData.enrolmentStatus}
                    onChange={handleInputChange("enrolmentStatus")}
                  >
                    <option value="">Select Status</option>
                    <option value="Enrolled">Enrolled</option>
                    <option value="Not Enrolled">Not Enrolled</option>
                  </select>
                  {errors.enrolmentStatus && <div className="invalid-feedback">{errors.enrolmentStatus}</div>}
                </div>
              </div>

              <div className="d-flex justify-content-center mt-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="continue-btn rounded-5"
                  onClick={handleBookingSubmit}
                >
                  Confirm Booking
                  <img src={continue_btn} className="ms-1" style={{ maxWidth: "2rem" }} alt="Continue" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Details Modal */}
        <AnimatePresence>
          {showDetailsModal && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailsModal(false)}
            >
              <motion.div
                className="modal-content"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-accent mb-3">{selectedPG.name}</h3>
                <img
                  src={selectedPG.img || pg}
                  className="img-fluid mb-3"
                  alt={selectedPG.name}
                  style={{ maxHeight: "300px", objectFit: "cover" }}
                />
                <p><FaMoneyBillWave /> <b>Rent:</b> {selectedPG.rent}</p>
                <p><FaMapMarkerAlt /> <b>Locality:</b> {selectedPG.locality || "N/A"}</p>
                <p><FaUniversity /> <b>University:</b> {selectedPG.university || "N/A"}</p>
                <p><FaBed /> <b>Room Type:</b> {selectedPG.roomType || "N/A"}</p>
                <p><FaCalendarAlt /> <b>Move-in:</b> {selectedPG.moveInMonth || "N/A"}</p>
                <p><FaCalendarAlt /> <b>Duration:</b> {selectedPG.duration || "N/A"} months</p>
                <div className="mb-3">{renderStars(selectedPG.rating)}</div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-accent w-100"
                  onClick={() => {
                    setShowDetailsModal(false);
                    handlePGSelect(selectedPG);
                  }}
                >
                  Enquire Now
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <Footer />
    </>
  );
};

export default Accommodation;