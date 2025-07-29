import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../CSS/Scholarship.css";

const Scholarship = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      {/* Hero Section with Animated Gradient */}
      <div className="hero-section text-center d-flex align-items-center justify-content-center">
        <div className="container">
          <h1 className="display-4 fw-bold">Your Gateway to Scholarship Opportunities</h1>
          <p className="lead">
            Discover and explore scholarships tailored to your needs from trusted sources.
          </p>
          <button className="btn btn-primary btn-lg apply-btn" onClick={() => navigate("/scForm")}>
            Explore Scholarships
          </button>
          <button className="btn btn-outline-light btn-lg ms-3" onClick={() => navigate("/eligibility")}>
            Learn More
          </button>
        </div>
      </div>

      {/* Announcement Banner */}
      <div className="announcement-banner text-center py-3">
        <p className="mb-0">
          <strong>Latest Update:</strong> New scholarship listings for 2025-26 are now available! Check eligibility now.
        </p>
      </div>

      {/* Trusted By Section */}
      <div className="trusted-by py-4 text-center">
        <h3 className="mb-3">Sourced from Trusted Authorities</h3>
        <div className="d-flex justify-content-center flex-wrap">
          <img src="https://th.bing.com/th/id/OIP.4FojMciWr-Lv-t4LRq0gdQAAAA?w=169&h=178&c=7&r=0&o=5&dpr=1.3&pid=1.7" alt="AICTE" className="trust-logo mx-3" />
          <img src="https://th.bing.com/th/id/OIP.4xOpDSWrktktG8QnSu7qtwAAAA?w=239&h=132&c=7&r=0&o=5&dpr=1.3&pid=1.7" alt="NIRF" className="trust-logo mx-3" />
          <img src="https://th.bing.com/th/id/OIP.qxWG8F6a0y16UXn1NmdAQAHaEA?w=332&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" alt="UGC" className="trust-logo mx-3" />
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="container py-5">
        <h2 className="text-center section-title">Quick Access</h2>
        <div className="row text-center mt-4">
          <div className="col-md-3">
            <div className="quick-link-card" onClick={() => navigate("/scForm")}>
              <i className="bi bi-search quick-link-icon"></i>
              <h3>Find Scholarships</h3>
              <p>Browse available opportunities.</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="quick-link-card" onClick={() => navigate("/eligibility")}>
              <i className="bi bi-info-circle quick-link-icon"></i>
              <h3>Eligibility Check</h3>
              <p>Understand requirements.</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="quick-link-card" onClick={() => navigate("/status")}>
              <i className="bi bi-check-circle quick-link-icon"></i>
              <h3>Track Updates</h3>
              <p>Stay informed on deadlines.</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="quick-link-card" onClick={() => navigate("/contact")}>
              <i className="bi bi-envelope quick-link-icon"></i>
              <h3>Contact Us</h3>
              <p>Get help and support.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section with Carousel */}
      <div className="container py-5">
        <h2 className="text-center section-title">Student Experiences</h2>
        <div id="testimonialCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="testimonial-card text-center">
                <img
                  src="student1.jpg"
                  alt="John Doe"
                  className="rounded-circle mb-3"
                  style={{ width: "100px", height: "100px" }}
                />
                <p>"I found scholarships I never knew about—such a game-changer!"</p>
                <h5>— John Doe</h5>
              </div>
            </div>
            <div className="carousel-item">
              <div className="testimonial-card text-center">
                <img
                  src="student2.jpg"
                  alt="Jane Smith"
                  className="rounded-circle mb-3"
                  style={{ width: "100px", height: "100px" }}
                />
                <p>"This site made it so easy to explore my options."</p>
                <h5>— Jane Smith</h5>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#testimonialCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#testimonialCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      {/* Trust Metrics Section */}
      <div className="trust-metrics text-center py-5">
        <h2 className="mb-4">Our Reach</h2>
        <div className="row">
          <div className="col-md-6">
            <h3>100,000+</h3>
            <p>Students Informed</p>
          </div>
          <div className="col-md-6">
            <h3>500+</h3>
            <p>Scholarships Curated</p>
          </div>
        </div>
        <p className="trust-note mt-4">
          We provide up-to-date scholarship information from verified sources—we don’t award scholarships, we guide you to them.
        </p>
      </div>

      <Footer />
    </>
  );
};

export default Scholarship;