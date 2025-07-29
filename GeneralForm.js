import React, { useState } from "react";
import axios from "axios";
import "../CSS/GeneralForm.css";

function GeneralForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    educationLevel: "",
    marks10: "",
    marks12: "",
    marksUG: "",
    field: "",
    country: "",
    resume: null,
    feedback: "",
    rating: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone Number is required";
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone must be 10 digits";
    if (!formData.educationLevel) newErrors.educationLevel = "Education Level is required";
    if (formData.marks10 && (isNaN(formData.marks10) || formData.marks10 < 0 || formData.marks10 > 100))
      newErrors.marks10 = "10th marks must be between 0 and 100";
    if (formData.marks12 && (isNaN(formData.marks12) || formData.marks12 < 0 || formData.marks12 > 100))
      newErrors.marks12 = "12th marks must be between 0 and 100";
    if (formData.marksUG && (isNaN(formData.marksUG) || formData.marksUG < 0 || formData.marksUG > 10))
      newErrors.marksUG = "UG CGPA must be between 0 and 10";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "resume" && formData[key]) {
        formDataToSend.append(key, formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post("http://localhost:4501/api/submit", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMessage("Thanks! Your application has been received.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        educationLevel: "",
        marks10: "",
        marks12: "",
        marksUG: "",
        field: "",
        country: "",
        resume: null,
        feedback: "",
        rating: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
      setSuccessMessage("Failed to submit. Please try again.");
    }
  };

  return (
    <div className="gf-container">
      <h2>Student Application Form</h2>
      {successMessage && <p className="gf-success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="gf-form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
          {errors.name && <span className="gf-error">{errors.name}</span>}
        </div>
        <div className="gf-form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
          />
          {errors.email && <span className="gf-error">{errors.email}</span>}
        </div>
        <div className="gf-form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
          />
          {errors.phone && <span className="gf-error">{errors.phone}</span>}
        </div>
        <div className="gf-form-group">
          <label htmlFor="educationLevel">Current Education Level</label>
          <select
            id="educationLevel"
            name="educationLevel"
            value={formData.educationLevel}
            onChange={handleChange}
            required
          >
            <option value="">Select Education Level</option>
            <option value="10th">10th</option>
            <option value="12th">12th</option>
            <option value="Undergraduate">Undergraduate</option>
          </select>
          {errors.educationLevel && <span className="gf-error">{errors.educationLevel}</span>}
        </div>
        <div className="gf-marks-group">
          <input
            type="number"
            step="0.1"
            name="marks10"
            value={formData.marks10}
            onChange={handleChange}
            placeholder="10th %"
          />
          <input
            type="number"
            step="0.1"
            name="marks12"
            value={formData.marks12}
            onChange={handleChange}
            placeholder="12th %"
          />
          <input
            type="number"
            step="0.1"
            name="marksUG"
            value={formData.marksUG}
            onChange={handleChange}
            placeholder="UG CGPA"
          />
          {errors.marks10 && <span className="gf-error">{errors.marks10}</span>}
          {errors.marks12 && <span className="gf-error">{errors.marks12}</span>}
          {errors.marksUG && <span className="gf-error">{errors.marksUG}</span>}
        </div>
        <div className="gf-form-group">
          <label htmlFor="field">Preferred Field (e.g. AI, Design)</label>
          <input
            type="text"
            id="field"
            name="field"
            value={formData.field}
            onChange={handleChange}
            placeholder="Preferred Field (e.g. AI, Design)"
          />
        </div>
        <div className="gf-form-group">
          <label htmlFor="country">Interested Country</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Interested Country"
          />
        </div>
        <div className="gf-form-group">
          <label htmlFor="resume">Upload Resume (optional):</label>
          <input
            type="file"
            id="resume"
            name="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
          />
        </div>
        <hr />
        <h3>Feedback</h3>
        <div className="gf-form-group">
          <label htmlFor="feedback">How did you find this event?</label>
          <textarea
            id="feedback"
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            placeholder="Your thoughts about the event or site"
            rows="3"
          ></textarea>
        </div>
        <div className="gf-form-group">
          <label htmlFor="rating">Rate Your Experience</label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
          >
            <option value="">Select Rating</option>
            <option value="5">★★★★★ - Excellent</option>
            <option value="4">★★★★☆ - Good</option>
            <option value="3">★★★☆☆ - Average</option>
            <option value="2">★★☆☆☆ - Poor</option>
            <option value="1">★☆☆☆☆ - Bad</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default GeneralForm;