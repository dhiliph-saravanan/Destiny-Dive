import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaMapMarkerAlt, FaUniversity, FaDollarSign, FaClock, FaPercentage } from "react-icons/fa";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../CSS/AbroadCollegeInfo.css";

const AbroadCollegeInfo = () => {
  const location = useLocation();
  const college = location.state?.college;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  if (!college) {
    return <h2 className="text-center mt-5">College not found</h2>;
  }

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % college.image.length);
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? college.image.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
      <Navbar />
      <div className="container abroad-college-info">
        <div className="college-header">
          <h1>{college.name}</h1>
          <div className="underline"></div>
        </div>

        {/* College Intro Section */}
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
                />
                {isHovered && (
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
            <h2>About College</h2>
            <p>{college.about || "No description available."}</p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="info-cards">
          <div className="info-card">
            <FaMapMarkerAlt /> <span>Location:</span> {college.location || "Not available"}
          </div>
          <div className="info-card">
            <FaUniversity /> <span>Type:</span> {college.type || "Not available"}
          </div>
          <div className="info-card">
            <FaUniversity /> <span>University Type:</span> {college.universityType || "Not available"}
          </div>
          <div className="info-card">
            <FaPercentage /> <span>Admission Chance:</span>{" "}
            {college.chances ? `${college.chances}%` : "Not available"}
          </div>
        </div>

        {/* Degrees & Courses */}
        <div className="additional-info">
          <h2>🎓 Degrees & Courses</h2>
          <table>
            <thead>
              <tr>
                <th>Degree Level</th>
                <th>Streams/Specializations</th>
                <th>Tuition Fee (USD/year)</th>
                <th>Duration</th>
                <th>Min. Percentage</th>
              </tr>
            </thead>
            <tbody>
              {college.degrees?.map((degree, index) => (
                <tr key={index}>
                  <td>{degree.level}</td>
                  <td>
                    {degree.streams?.map((stream) => (
                      <div key={stream.name}>
                        {stream.name}: {stream.specializations?.join(", ") || "N/A"}
                      </div>
                    ))}
                  </td>
                  <td>{degree.tuitionFee ? `$${degree.tuitionFee}` : "N/A"}</td>
                  <td>{degree.duration || "N/A"}</td>
                  <td>
                    {degree.qualifications?.[0]?.minPercentage
                      ? `${degree.qualifications[0].minPercentage}%`
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AbroadCollegeInfo;