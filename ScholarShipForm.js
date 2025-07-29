import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import logo from "./images/navlogo.png";
import back_btn from "./images/back-btn.png";
import continue_btn from "./images/continue-btn.png";
import Footer from "./Footer";
import "../CSS/ScholarShipForm.css";

const ScholarShipForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    gender: "",
    dateOfBirth: "",
    twelfthMark: "",
    tenthMark: "",
    firstGraduate: "",
    annualIncome: "",
    cgMq: "",
    religion: "",
    singleParent: "",
    caste: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required.";
    if (!/^\d{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = "Mobile Number must be 10 digits.";
    if (!formData.gender) newErrors.gender = "Gender is required.";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required.";
    if (!/^\d{1,3}$/.test(formData.twelfthMark) || formData.twelfthMark > 100)
      newErrors.twelfthMark = "Twelfth Mark must be a percentage (0-100).";
    if (!/^\d{1,3}$/.test(formData.tenthMark) || formData.tenthMark > 100)
      newErrors.tenthMark = "Tenth Mark must be a percentage (0-100).";
    if (!formData.firstGraduate) newErrors.firstGraduate = "This field is required.";
    if (!/^\d+$/.test(formData.annualIncome)) newErrors.annualIncome = "Annual Income must be a number.";
    if (!formData.cgMq) newErrors.cgMq = "CG/MQ is required.";
    if (!formData.religion) newErrors.religion = "Religion is required.";
    if (!formData.singleParent) newErrors.singleParent = "This field is required.";
    if (!formData.caste) newErrors.caste = "Caste is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post("http://localhost:5000/api/scholarship", formData);
        console.log(response.data);
        alert("Form submitted successfully!");
        navigate("/scdetails");
      } catch (error) {
        console.error("Error submitting the form:", error);
        alert("Failed to submit the form. Please try again.");
        navigate("/scdetails");
      }
    }
  };

  return (
    <>
      <div className="position-absolute top-0 end-0 m-3">
        <img src={logo} alt="University Logo" style={{ height: "70px", cursor: "pointer" }} />
      </div>
      <div className="position-absolute top-0 start-0 m-3" onClick={() => navigate(-1)}>
        <img src={back_btn} alt="Back" height="auto" width="50px" />
      </div>
      <div className="container py-5">
        <div className="card form-card p-4">
          <h2 className="text-center mb-4">Scholarship Application Form</h2>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                />
                {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Mobile Number</label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className={`form-control ${errors.mobileNumber ? "is-invalid" : ""}`}
                />
                {errors.mobileNumber && <div className="invalid-feedback">{errors.mobileNumber}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Gender</label>
                <div>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      onChange={handleChange}
                      className="form-check-input"
                    />
                    <label className="form-check-label">Male</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      onChange={handleChange}
                      className="form-check-input"
                    />
                    <label className="form-check-label">Female</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      name="gender"
                      value="Other"
                      onChange={handleChange}
                      className="form-check-input"
                    />
                    <label className="form-check-label">Other</label>
                  </div>
                </div>
                {errors.gender && <div className="invalid-feedback d-block">{errors.gender}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`form-control ${errors.dateOfBirth ? "is-invalid" : ""}`}
                />
                {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Twelfth Mark (%)</label>
                <input
                  type="text"
                  name="twelfthMark"
                  value={formData.twelfthMark}
                  onChange={handleChange}
                  className={`form-control ${errors.twelfthMark ? "is-invalid" : ""}`}
                />
                {errors.twelfthMark && <div className="invalid-feedback">{errors.twelfthMark}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Tenth Mark (%)</label>
                <input
                  type="text"
                  name="tenthMark"
                  value={formData.tenthMark}
                  onChange={handleChange}
                  className={`form-control ${errors.tenthMark ? "is-invalid" : ""}`}
                />
                {errors.tenthMark && <div className="invalid-feedback">{errors.tenthMark}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">First Graduate?</label>
                <div>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      name="firstGraduate"
                      value="Yes"
                      onChange={handleChange}
                      className="form-check-input"
                    />
                    <label className="form-check-label">Yes</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      name="firstGraduate"
                      value="No"
                      onChange={handleChange}
                      className="form-check-input"
                    />
                    <label className="form-check-label">No</label>
                  </div>
                </div>
                {errors.firstGraduate && <div className="invalid-feedback d-block">{errors.firstGraduate}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Annual Income (₹)</label>
                <input
                  type="text"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleChange}
                  className={`form-control ${errors.annualIncome ? "is-invalid" : ""}`}
                />
                {errors.annualIncome && <div className="invalid-feedback">{errors.annualIncome}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">CG/MQ</label>
                <input
                  type="text"
                  name="cgMq"
                  value={formData.cgMq}
                  onChange={handleChange}
                  className={`form-control ${errors.cgMq ? "is-invalid" : ""}`}
                />
                {errors.cgMq && <div className="invalid-feedback">{errors.cgMq}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Religion</label>
                <input
                  type="text"
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  className={`form-control ${errors.religion ? "is-invalid" : ""}`}
                />
                {errors.religion && <div className="invalid-feedback">{errors.religion}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Single Parent?</label>
                <div>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      name="singleParent"
                      value="Yes"
                      onChange={handleChange}
                      className="form-check-input"
                    />
                    <label className="form-check-label">Yes</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      name="singleParent"
                      value="No"
                      onChange={handleChange}
                      className="form-check-input"
                    />
                    <label className="form-check-label">No</label>
                  </div>
                </div>
                {errors.singleParent && <div className="invalid-feedback d-block">{errors.singleParent}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Caste</label>
                <select
                  name="caste"
                  value={formData.caste}
                  onChange={handleChange}
                  className={`form-select ${errors.caste ? "is-invalid" : ""}`}
                >
                  <option value="">Select Caste</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
                {errors.caste && <div className="invalid-feedback">{errors.caste}</div>}
              </div>
            </div>
            <div className="d-flex justify-content-center mt-4">
              <button type="submit" className="submit-btn">
                Submit Application
                <img src={continue_btn} className="ms-2" style={{ maxWidth: "2rem", height: "auto" }} alt="Submit" />
              </button>
            </div>
            <p className="trust-note text-center mt-3">
              Your data is secure and will only be used for scholarship processing.
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ScholarShipForm;