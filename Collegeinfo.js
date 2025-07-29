import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  FaUniversity,
  FaMapMarkerAlt,
  FaPercentage,
  FaGraduationCap,
  FaHeart,
} from "react-icons/fa";
import axios from "axios";
import "../CSS/collegeinfo.css";

const CollegeInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [college, setCollege] = useState(location.state?.college || null);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (!college) {
      fetch(`http://localhost:4501/api/colleges/${id}`)
        .then((response) => {
          if (!response.ok) throw new Error("College not found");
          return response.json();
        })
        .then((data) => setCollege(data))
        .catch((error) => {
          console.error("Fetch error:", error);
          setError(error.message);
        });
    }
  }, [id, college]);

  useEffect(() => {
    if (college && college.image?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % college.image.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [college]);

  useEffect(() => {
    const checkWishlist = async () => {
      const userId = localStorage.getItem("userId");
      if (userId && college) {
        try {
          const response = await axios.get(`http://localhost:4501/api/users/${userId}`);
          const user = response.data;
          setIsInWishlist(user.wishlist.includes(college._id));
        } catch (error) {
          console.error("Error checking wishlist:", error);
        }
      }
    };
    checkWishlist();
  }, [college]);

  useEffect(() => {
    const checkIfApplied = async () => {
      const userId = localStorage.getItem("userId");
      if (userId && college?.name) {
        try {
          const res = await axios.get(
            `http://localhost:4501/api/applications/check`,
            {
              params: { userId, collegeName: college.name },
            }
          );
          setHasApplied(res.data.applied);
        } catch (err) {
          setHasApplied(false);
        }
      }
    };
    checkIfApplied();
  }, [college]);

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % college.image.length);
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? college.image.length - 1 : prevIndex - 1
    );
  };

  const handleAddToWishlist = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in to add colleges to your wishlist.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:4501/users/${userId}/wishlist`, {
        collegeId: college._id,
      });
      alert(response.data.message || "College added to wishlist!");
      setIsInWishlist(true);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      alert(
        error.response?.data?.message || "Failed to add college to wishlist. Please try again."
      );
    }
  };

  if (error) return <div className="error-message">Error: {error}</div>;
  if (!college) return <div className="loading-message">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="college-header">
          <h1>{college.name}</h1>
          <div className="underline"></div>
        </div>

        <div className="college-intro">
          <div
            className="image-carousel"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {college.image && college.image.length > 0 ? (
              <>
                <img
                  src={college.image[currentImageIndex]}
                  alt={`College ${currentImageIndex + 1}`}
                  className="college-img"
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                />
                {college.image.length > 1 && isHovered && (
                  <>
                    <button className="prev-btn" onClick={goToPrevImage}>
                      ❮
                    </button>
                    <button className="next-btn" onClick={goToNextImage}>
                      ❯
                    </button>
                  </>
                )}
              </>
            ) : (
              <p>No Image Available</p>
            )}
          </div>

          <div className="about-college">
            <h2>About {college.name}</h2>
            <p>
              {college.about ||
                `A ${college.category} institution located in ${college.location}.`}
            </p>
          </div>
        </div>

        <div className="info-cards">
          <div className="info-card">
            <FaMapMarkerAlt /> <span>Location:</span> {college.location || "Not available"}
          </div>
          <div className="info-card">
            <FaUniversity /> <span>Type:</span> {college.type || "Not available"}
          </div>
          <div className="info-card">
            <FaGraduationCap /> <span>University Type:</span>{" "}
            {college.universityType || "Not available"}
          </div>
          <div className="info-card">
            <FaPercentage /> <span>Admission Chances:</span>{" "}
            {college.chances ? `${college.chances}%` : "Not available"}
          </div>
          <div className="info-card">
            <FaPercentage /> <span>Min. Percentage:</span>{" "}
            {college.degrees?.[0]?.qualifications?.[0]?.minPercentage
              ? `${college.degrees[0].qualifications[0].minPercentage}%`
              : "Not available"}
          </div>
        </div>

        <div className="course-fee">
          <h2>📑 Courses & Details</h2>
          <table>
            <thead>
              <tr>
                <th>Level</th>
                <th>Streams</th>
                <th>Specializations</th>
                <th>Cutoff</th>
                <th>Duration</th>
                <th>Tuition Fee (₹)</th>
                <th>Admission Process</th>
              </tr>
            </thead>
            <tbody>
              {college.degrees?.map((degree, index) => (
                <tr key={index}>
                  <td>{degree.level}</td>
                  <td>{degree.streams?.map((s) => s.name).join(", ") || "N/A"}</td>
                  <td>
                    {degree.streams
                      ?.map((s) => s.specializations?.join(", ") || "")
                      .join("; ") || "N/A"}
                  </td>
                  <td>
                    {degree.exams?.[0]?.minScore
                      ? `${degree.exams[0].minScore}`
                      : "N/A"}
                  </td>
                  <td>{degree.duration || "N/A"}</td>
                  <td>
                    {degree.tuitionFee ? degree.tuitionFee.toLocaleString() : "N/A"}
                  </td>
                  <td>{degree.exams?.map((e) => e.name).join(", ") || "N/A"}</td>
                </tr>
              )) || <tr><td colSpan="7">No course details available</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="additional-info">
          <h2>Additional Information</h2>
          <p>
            <strong>Accepted Boards:</strong> Not available {/* Adjust if API provides this */}
          </p>
          <p>
            <strong>Category:</strong> {college.category || "Not available"}
          </p>
        </div>

        <div className="apply-btn">
          <button
            onClick={() =>
              navigate("/appform", {
                state: {
                  collegeName: college.name,
                  collegeType: college.type,
                  collegeId: college._id,
                },
              })
            }
            disabled={hasApplied}
          >
            {hasApplied ? "Already Applied" : "Apply Now"}
          </button>
          <button
            className="wishlist-btn"
            onClick={handleAddToWishlist}
            disabled={isInWishlist}
          >
            <FaHeart /> {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CollegeInfo;