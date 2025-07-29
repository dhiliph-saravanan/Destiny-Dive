import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import '../CSS/landing.css';
import 'aos/dist/aos.css';
import AOS from 'aos';

// Images
import landing from "./images/landing.jpeg";
import indian from "./images/service1.jpeg";
import abroad from "./images/service2.jpeg";
import accomadation from "./images/service3.jpeg";
import scholarships from "./images/service4.png";
import t1 from "./images/t1.png";
import t2 from "./images/t2.png";
import t3 from "./images/t3.png";
import usa from "./images/c1.png";
import china from "./images/c2.png";
import aus from "./images/c3.png";
import uk from "./images/c4.png";
import japan from "./images/c5.png";

const shadowStyle = {
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

const countryFlags = [
  { src: usa, alt: "USA" },
  { src: china, alt: "China" },
  { src: aus, alt: "Australia" },
  { src: uk, alt: "UK" },
  { src: japan, alt: "Japan" },
];

const Landing = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState("USA");
  const [universities, setUniversities] = useState({
    USA: [],
    China: [],
    Australia: [],
    UK: [],
    Japan: []
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const fetchUniversities = async () => {
      try {
        const response = await fetch("http://localhost:4501/api/abroadcolleges");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const categorizedData = {
          USA: data.filter(university => university.location.includes("USA")),
          China: data.filter(university => university.location.includes("China")),
          Australia: data.filter(university => university.location.includes("Australia")),
          UK: data.filter(university => university.location.includes("UK")),
          Japan: data.filter(university => university.location.includes("Japan"))
        };
        setUniversities(categorizedData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUniversities();
  }, []);

  const services = [
    { title: "Indian Universities", image: indian },
    { title: "Abroad Institutions", image: abroad },
    { title: "Accommodations", image: accomadation },
    { title: "Scholarships", image: scholarships },
  ];

  const handleNavigation = (title) => {
    if (title === "Indian Universities") {
      navigate("/university", { state: { type: "Indian" } });
    }
    if (title === "Abroad Institutions") {
      navigate("/AbroadUniversities", { state: { type: "Abroad" } });
    }
    if (title === "Accommodations") {
      navigate("/accommodation");
    }
    if (title === "Scholarships") {
      navigate("/scholarship");
    }
  };

  const handleUniversityClick = (university) => {
    navigate(`/abroadcolleges/${university.id}`, { state: { college: university } });
  };

  const headerItems = [
    { icon: t1, text: "The most Trusted\nGuidance website ever Created" },
    { icon: t2, text: "Well defined Details\nabout Scholarships" },
    { icon: t3, text: "Colleges and nearby\nAccommodations" },
  ];

  return (
    <>
      <div className="ld-landing-navbar-container" style={{ ...shadowStyle, padding: "10px", marginBottom: "20px" }}>
        <Navbar />
      </div>
      <div
        className="container ld-landing-hero-section text-center text-white d-flex flex-column justify-content-center align-items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/hero-bg.jpg'), url(${landing})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          borderRadius: "20px",
          ...shadowStyle,
        }}
      >
        <div className="p-5 rounded">
          <h1 className="display-4 fw-bold">
            Find Your <span className="bg-warning">Future</span> Today!
          </h1>
          <p>The Ultimate Guide to Universities Worldwide</p>
        </div>
      </div>
      <div
        className="text-center p-5 m-5 text-muted d-flex justify-content-center align-items-center"
        style={shadowStyle}
      >
        <div className="ld-landing-content-box" style={{ maxWidth: "800px" }}>
          <p className="fs-6 fw-medium">
            Explore your options and make informed decisions with our comprehensive guide to universities around the world.
          </p>
        </div>
      </div>
      <div className="container">
        <div className="ld-landing-services-section container text-center py-3" style={shadowStyle}>
          <h2 className="mb-4 fw-bold">Service Tailored For You</h2>
          <div className="container" style={shadowStyle}>
            <div className="row">
              {services.map((service, index) => (
                <div
                  key={index}
                  className={`col-md-4 col-sm-6 mb-4 mx-auto`}
                  onClick={() => handleNavigation(service.title)}
                >
                  <div
                    className="ld-landing-service-card position-relative overflow-hidden"
                    style={{ ...shadowStyle, position: "relative" }}
                  >
                    <div
                      className="ld-landing-service-image-wrapper position-relative"
                      style={{
                        height: index === 1 ? "600px" : "550px",
                        overflow: "hidden",
                        transition: "height 0.3s ease-in-out",
                      }}
                    >
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-100 h-100 ld-landing-image-transition"
                        style={{
                          objectFit: "cover",
                          position: "relative",
                          transition: "transform 0.3s ease-in-out",
                          ...shadowStyle,
                        }}
                      />
                      <div
                        className="ld-landing-service-text position-absolute pt-5 pl-4 top-0 justify-content-center w-100 h-100 d-flex"
                        style={{
                          backgroundColor: "rgba(0, 0, 0, 0.3)",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "2rem",
                        }}
                      >
                        {service.title}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="ld-landing-header-container text-center container p-5 my-5" style={shadowStyle}>
        <div className="d-flex justify-content-evenly align-items-center flex-wrap">
          {headerItems.map((item, index) => (
            <div key={index} className="d-flex align-items-center mb-3 mb-md-0">
              <img
                src={item.icon}
                alt="Header Icon"
                className="ld-landing-header-icon"
                style={{ width: "6vw", height: "auto", marginRight: "30px" }}
              />
              <p className="mb-0 fs-6 fw-medium">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="universities-section p-5">
        <div
          className="container p-4"
          style={{
            background:
              "linear-gradient(180deg, rgba(135, 243, 255, 0.4) 0%, rgba(190, 219, 223, 0.4) 20.6%, rgba(190, 219, 223, 0.4) 55.13%, rgba(0, 162, 180, 0.4) 100%)",
            borderRadius: "3%",
          }}
        >
          <h2 className="mb-4 fw-bold text-center">
            Top Universities in <span style={{ color: "blue" }}>{selectedCountry}</span>
          </h2>
          <div className="d-flex justify-content-center mx-0 flex-wrap my-3 gap-5">
            {countryFlags.map((flag, index) => (
              <div
                className={`d-flex flex-column justify-content-center align-items-center text-center ld-country-btn ${selectedCountry === flag.alt ? 'active' : ''}`}
                key={index}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedCountry(flag.alt)}
                role="button"
                aria-label={`Select universities from ${flag.alt}`}
              >
                <img
                  src={flag.src}
                  alt={flag.alt}
                  className="ld-country-flag mb-2"
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "2px solid #ccc",
                  }}
                />
                <p className="fs-5 fw-medium m-0">{flag.alt}</p>
              </div>
            ))}
          </div>
          <div className="row mt-4">
            {universities[selectedCountry] && universities[selectedCountry].length > 0 ? (
              universities[selectedCountry].slice(0, selectedCountry === "USA" ? 6 : 3).map((university, index) => (
                <div
                  className="col-12 col-md-6 col-lg-4 mb-4 d-flex justify-content-center"
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div
                    className="ld-university-card p-3 d-flex flex-column align-items-center w-100"
                    style={{
                      maxWidth: "400px",
                      background: "linear-gradient(135deg, #ffffff, #e6f0fa)",
                      borderRadius: "10px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    role="region"
                    aria-label={`University card for ${university.name}`}
                  >
                    <p
                      className="fw-bold mb-1 text-center ld-university-name clickable"
                      onClick={() => handleUniversityClick(university)}
                      aria-label={`Click to view details of ${university.name}`}
                    >
                      {university.name}
                    </p>
                    <p className="text-muted mb-2 text-center">{university.location}</p>
                    <div className="ld-hover-overlay">
                      <p className="ld-hover-text">Location: {university.location}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No universities found for {selectedCountry}</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Landing;