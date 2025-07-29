import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import nationalities from "./nationalities.json";

const ApplicationForm = () => {
  const location = useLocation();
  const collegeName = location.state?.collegeName;
  const collegeType = location.state?.collegeType;
  const collegeId = location.state?.collegeId; // Add this line

  // REMOVE or COMMENT OUT this line:
  // console.log("collegeId from location.state:", collegeId);

  const [submittedData, setSubmittedData] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [hasApplied, setHasApplied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      // Append all form fields to FormData
      for (const key in data) {
        if (data[key] instanceof FileList) {
          if (data[key].length > 0) {
            formData.append(key, data[key][0]); // Append the first file
          }
        } else if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      }
      // Append additional fields
      formData.append("collegeName", collegeName);
      formData.append("collegeId", collegeId); // Add this line
      formData.append("Type", collegeType);
      formData.append("submissionDate", new Date().toISOString().split("T")[0]);
      formData.append("status", "pending");
      const userId = localStorage.getItem("userId");
      formData.append("userId", userId);

      setSubmittedData(Object.fromEntries(formData)); // For debugging, optional

      const response = await axios.post(
        "http://localhost:4501/api/applications", // <-- add /api here
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Form Submitted Successfully: ", response.data);
      setResponseMessage("Application submitted successfully!");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setResponseMessage("You have already applied to this college.");
        // Don't log 409 errors, since they're expected
      } else {
        console.error("Error submitting form: ", error);
        setResponseMessage("Something went wrong. Please try again.");
      }
    }
  };

  const [years, setYears] = useState([]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const past10Years = Array.from(
      { length: 7 },
      (_, i) => currentYear + 1 - i
    );
    const combinedYears = [...past10Years.reverse()];
    setYears(combinedYears);
  }, []);

  return collegeType === "Indian" ? (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-2">
        Application Form for {collegeName || "College Name"}
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 border rounded bg-light shadow"
      >
        {/* Personal Information */}
        <h4 className="fw-bold mb-3">Personal Information</h4>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              {...register("fullName", { required: "Full Name is required" })}
            />
            {errors.fullName && (
              <span className="text-danger">{errors.fullName.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Gender</label>
            <select
              className="form-control"
              {...register("gender", { required: "Gender is required" })}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <span className="text-danger">{errors.gender.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              {...register("dob", { required: "Date of Birth is required" })}
            />
            {errors.dob && (
              <span className="text-danger">{errors.dob.message}</span>
            )}
          </div>
          {/* ... Other Personal Information fields remain unchanged ... */}
          <div className="col-md-4">
            <label className="form-label">Community</label>
            <select
              className="form-control"
              {...register("community", { required: "Community is required" })}
            >
              <option value="">Select Community</option>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC/ST">SC/ST</option>
            </select>
            {errors.community && (
              <span className="text-danger">{errors.community.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Nationality</label>
            <select
              className="form-control"
              {...register("nationality", {
                required: "Nationality is required",
              })}
            >
              <option value="">Select Nationality</option>
              {nationalities.map((nationality) => (
                <option key={nationality.id} value={nationality.name}>
                  {nationality.name}
                </option>
              ))}
            </select>
            {errors.nationality && (
              <span className="text-danger">{errors.nationality.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Aadhar Number</label>
            <input
              type="text"
              className="form-control"
              {...register("aadharNumber", {
                required: "Aadhar Number is required",
                pattern: {
                  value: /^[0-9]{12}$/,
                  message: "Aadhar Number must be 12 digits",
                },
              })}
            />
            {errors.aadharNumber && (
              <span className="text-danger">{errors.aadharNumber.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              {...register("phoneNumber", {
                required: "Phone Number is required",
              })}
            />
            {errors.phoneNumber && (
              <span className="text-danger">{errors.phoneNumber.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <span className="text-danger">{errors.email.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Address</label>
            <textarea
              className="form-control"
              rows="2"
              {...register("address", { required: "Address is required" })}
            ></textarea>
            {errors.address && (
              <span className="text-danger">{errors.address.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Parent's Name</label>
            <input
              type="text"
              className="form-control"
              {...register("parentsName", {
                required: "Parent's Name is required",
              })}
            />
            {errors.parentsName && (
              <span className="text-danger">{errors.parentsName.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Parent's Occupation</label>
            <input
              type="text"
              className="form-control"
              {...register("parentsOccupation")}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Parent's Phone Number</label>
            <input
              type="tel"
              className="form-control"
              {...register("parentsPhone", {
                required: "Parent's Phone Number is required",
              })}
            />
            {errors.parentsPhone && (
              <span className="text-danger">{errors.parentsPhone.message}</span>
            )}
          </div>
        </div>

        {/* Academic Information */}
        <h4 className="fw-bold mt-4 mb-3">Academic Information</h4>
        <h5 className="fw-bold mt-3">10th Standard Details</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Board of Education</label>
            <select
              className="form-control"
              {...register("tenthBoard", {
                required: "Board of Education is required",
              })}
            >
              <option value="">Select Board</option>
              <option value="CBSE">CBSE</option>
              <option value="ICSE">ICSE</option>
              <option value="State Board">State Board</option>
              <option value="Other">Other</option>
            </select>
            {errors.tenthBoard && (
              <span className="text-danger">{errors.tenthBoard.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Year of Passing</label>
            <select
              className="form-control"
              {...register("tenthYear", {
                required: "Year of Passing is required",
              })}
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.tenthYear && (
              <span className="text-danger">{errors.tenthYear.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Percentage/Grade</label>
            <input
              type="text"
              className="form-control"
              {...register("tenthPercentage", {
                required: "Percentage/Grade is required",
              })}
            />
            {errors.tenthPercentage && (
              <span className="text-danger">
                {errors.tenthPercentage.message}
              </span>
            )}
          </div>
        </div>

        <h5 className="fw-bold mt-3">12th Standard Details</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Board of Education</label>
            <select
              className="form-control"
              {...register("twelfthBoard", {
                required: "Board of Education is required",
              })}
            >
              <option value="">Select Board</option>
              <option value="CBSE">CBSE</option>
              <option value="ICSE">ICSE</option>
              <option value="State Board">State Board</option>
              <option value="Other">Other</option>
            </select>
            {errors.twelfthBoard && (
              <span className="text-danger">{errors.twelfthBoard.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Year of Passing</label>
            <select
              className="form-control"
              {...register("twelfthYear", {
                required: "Year of Passing is required",
              })}
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.twelfthYear && (
              <span className="text-danger">{errors.twelfthYear.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Percentage/Grade</label>
            <input
              type="text"
              className="form-control"
              {...register("twelfthPercentage", {
                required: "Percentage/Grade is required",
              })}
            />
            {errors.twelfthPercentage && (
              <span className="text-danger">
                {errors.twelfthPercentage.message}
              </span>
            )}
          </div>
          {/* ... Other Academic Information fields remain unchanged ... */}
          <div className="col-md-4">
            <label className="form-label">Stream</label>
            <br />
            {["Science", "Commerce", "Arts"].map((stream) => (
              <div key={stream} className="form-check form-check-inline">
                <input
                  type="radio"
                  className="form-check-input"
                  value={stream}
                  {...register("stream", { required: "Stream is required" })}
                />
                <label className="form-check-label">{stream}</label>
              </div>
            ))}
            {errors.stream && (
              <span className="text-danger d-block">
                {errors.stream.message}
              </span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Roll Number</label>
            <input
              type="text"
              className="form-control"
              {...register("rollNumber12")}
            />
          </div>
        </div>

        {/* Subject Specialization */}
        <h4 className="fw-bold mt-4 mb-3">Subject Specialization</h4>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Specialization (if applicable)</label>
            <input
              type="text"
              className="form-control"
              {...register("subjectSpecialization")}
            />
          </div>
        </div>

        {/* Entrance Exam Details */}
        <h4 className="fw-bold mt-4 mb-3">Entrance Exam Details</h4>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Exam Name</label>
            <input
              type="text"
              className="form-control"
              {...register("examName")}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Roll Number</label>
            <input
              type="text"
              className="form-control"
              {...register("rollNumber")}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Score/Rank</label>
            <input
              type="text"
              className="form-control"
              {...register("scoreRank")}
            />
          </div>
        </div>

        {/* Documents Upload */}
        <h4 className="fw-bold mt-4 mb-3">Documents Upload</h4>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Passport Sized Photo</label>
            <input
              type="file"
              className="form-control"
              {...register("passportPhoto", {
                required: "Passport photo is required",
              })}
            />
            {errors.passportPhoto && (
              <span className="text-danger">
                {errors.passportPhoto.message}
              </span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">10th/12th Marksheet</label>
            <input
              type="file"
              className="form-control"
              {...register("marksheet", { required: "Marksheet is required" })}
            />
            {errors.marksheet && (
              <span className="text-danger">{errors.marksheet.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Caste/Income Certificate</label>
            <input
              type="file"
              className="form-control"
              {...register("certificate")}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Entrance Exam Scorecard</label>
            <input
              type="file"
              className="form-control"
              {...register("examScorecard")}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Other Supporting Document</label>
            <input
              type="file"
              className="form-control"
              {...register("supportingDocument")}
            />
          </div>
        </div>

        {/* Declaration */}
        <h4 className="fw-bold mt-4 mb-3">Declaration</h4>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            {...register("declaration", { required: "You must agree" })}
          />
          <label className="form-check-label">
            I agree to the terms and conditions
          </label>
          {errors.declaration && (
            <span className="text-danger d-block">
              {errors.declaration.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center mt-4">
          <button
            type="submit"
            className="btn btn-primary fs-5 px-5 py-2 fw-bold mx-auto rounded-5"
            disabled={hasApplied} // <-- Add this
          >
            Apply
          </button>
        </div>
      </form>
      {responseMessage && (
        <div className="alert alert-success text-center" role="alert">
          {responseMessage}
        </div>
      )}
    </div>
  ) : (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-2">
        Application Form for {collegeName || "College Name"}
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 border rounded bg-light shadow"
      >
        {/* Personal Information */}
        <h4 className="fw-bold mb-3">Personal Information</h4>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              {...register("fullName", { required: "Full Name is required" })}
            />
            {errors.fullName && (
              <span className="text-danger">{errors.fullName.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Gender</label>
            <select
              className="form-control"
              {...register("gender", { required: "Gender is required" })}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <span className="text-danger">{errors.gender.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              {...register("dob", { required: "Date of Birth is required" })}
            />
            {errors.dob && (
              <span className="text-danger">{errors.dob.message}</span>
            )}
          </div>
          {/* ... Other Personal Information fields remain unchanged ... */}
          <div className="col-md-4">
            <label className="form-label">Nationality</label>
            <select
              className="form-control"
              {...register("nationality", {
                required: "Nationality is required",
              })}
            >
              <option value="">Select Nationality</option>
              {nationalities.map((nationality) => (
                <option key={nationality.id} value={nationality.name}>
                  {nationality.name}
                </option>
              ))}
            </select>
            {errors.nationality && (
              <span className="text-danger">{errors.nationality.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Do you have a passport</label>
            <br />
            {["Yes", "No", "Applied"].map((passportdetail) => (
              <div
                key={passportdetail}
                className="form-check form-check-inline"
              >
                <input
                  type="radio"
                  className="form-check-input"
                  value={passportdetail}
                  {...register("passportDetail", {
                    required: "Passport status is required",
                  })}
                />
                <label className="form-check-label">{passportdetail}</label>
              </div>
            ))}
            {errors.passportDetail && (
              <span className="text-danger d-block">
                {errors.passportDetail.message}
              </span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              {...register("phoneNumber", {
                required: "Phone Number is required",
              })}
            />
            {errors.phoneNumber && (
              <span className="text-danger">{errors.phoneNumber.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <span className="text-danger">{errors.email.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Address</label>
            <textarea
              className="form-control"
              rows="2"
              {...register("address", { required: "Address is required" })}
            ></textarea>
            {errors.address && (
              <span className="text-danger">{errors.address.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Parent's Name</label>
            <input
              type="text"
              className="form-control"
              {...register("parentsName", {
                required: "Parent's Name is required",
              })}
            />
            {errors.parentsName && (
              <span className="text-danger">{errors.parentsName.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Parent's Occupation</label>
            <input
              type="text"
              className="form-control"
              {...register("parentsOccupation")}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Parent's Phone Number</label>
            <input
              type="tel"
              className="form-control"
              {...register("parentsPhone", {
                required: "Parent's Phone Number is required",
              })}
            />
            {errors.parentsPhone && (
              <span className="text-danger">{errors.parentsPhone.message}</span>
            )}
          </div>
        </div>

        {/* Academic Information */}
        <h4 className="fw-bold mt-4 mb-3">Academic Information</h4>
        <h5 className="fw-bold mt-3">10th Grade Details</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Board of Education</label>
            <select
              className="form-control"
              {...register("tenthBoard", {
                required: "Board of Education is required",
              })}
            >
              <option value="">Select Board</option>
              <option value="CBSE">CBSE</option>
              <option value="ICSE">ICSE</option>
              <option value="State Board">State Board</option>
              <option value="Other">Other</option>
            </select>
            {errors.tenthBoard && (
              <span className="text-danger">{errors.tenthBoard.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Year of Passing</label>
            <select
              className="form-control"
              {...register("tenthYear", {
                required: "Year of Passing is required",
              })}
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.tenthYear && (
              <span className="text-danger">{errors.tenthYear.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Percentage/Grade</label>
            <input
              type="text"
              className="form-control"
              {...register("tenthPercentage", {
                required: "Percentage/Grade is required",
              })}
            />
            {errors.tenthPercentage && (
              <span className="text-danger">
                {errors.tenthPercentage.message}
              </span>
            )}
          </div>
        </div>

        <h5 className="fw-bold mt-3">12th Grade Details</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Board of Education</label>
            <select
              className="form-control"
              {...register("twelfthBoard", {
                required: "Board of Education is required",
              })}
            >
              <option value="">Select Board</option>
              <option value="CBSE">CBSE</option>
              <option value="ICSE">ICSE</option>
              <option value="State Board">State Board</option>
              <option value="Other">Other</option>
            </select>
            {errors.twelfthBoard && (
              <span className="text-danger">{errors.twelfthBoard.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Year of Passing</label>
            <select
              className="form-control"
              {...register("twelfthYear", {
                required: "Year of Passing is required",
              })}
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.twelfthYear && (
              <span className="text-danger">{errors.twelfthYear.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Percentage/Grade</label>
            <input
              type="text"
              className="form-control"
              {...register("twelfthPercentage", {
                required: "Percentage/Grade is required",
              })}
            />
            {errors.twelfthPercentage && (
              <span className="text-danger">
                {errors.twelfthPercentage.message}
              </span>
            )}
          </div>
          {/* ... Other 12th Grade Details remain unchanged ... */}
          <div className="col-md-4">
            <label className="form-label">Courses/Subjects Studied</label>
            <textarea
              className="form-control"
              rows="2"
              {...register("twelfthSubjects", {
                required: "Courses/Subjects are required",
              })}
            ></textarea>
            {errors.twelfthSubjects && (
              <span className="text-danger">
                {errors.twelfthSubjects.message}
              </span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Grade/Mark or GPA</label>
            <input
              type="text"
              className="form-control"
              {...register("gradeOrGPA", {
                required: "Grade/Mark or GPA is required",
              })}
            />
            {errors.gradeOrGPA && (
              <span className="text-danger">{errors.gradeOrGPA.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Predicted Grade</label>
            <input
              type="text"
              className="form-control"
              {...register("predictedGrade", {
                required: "Predicted Grade is required",
              })}
            />
            {errors.predictedGrade && (
              <span className="text-danger">
                {errors.predictedGrade.message}
              </span>
            )}
          </div>
        </div>

        {/* Standardized Test Scores */}
        <h5 className="fw-bold mt-3">
          Standardized Test Scores (If applicable)
        </h5>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Test Name</label>
            <input
              type="text"
              className="form-control"
              {...register("testName")}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Score</label>
            <input
              type="text"
              className="form-control"
              {...register("testScore")}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Class Rank (If available)</label>
            <input
              type="text"
              className="form-control"
              {...register("classRank")}
            />
          </div>
        </div>

        {/* Intended Area of Study */}
        <h4 className="fw-bold mt-4">Intended Area Of Study</h4>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Desired Major or Program</label>
            <input
              type="text"
              className="form-control"
              {...register("desiredMajor")}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Reason For Choosing Program</label>
            <textarea
              className="form-control"
              rows="3"
              {...register("reasonForProgram")}
            ></textarea>
          </div>
        </div>

        {/* Extracurricular Activities */}
        <h4 className="fw-bold mt-4">
          Extracurricular and Leadership Activities
        </h4>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label fw-bold">
              Extracurricular Activities
            </label>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                {...register("extracurricularClubs")}
              />
              <label className="form-check-label">Clubs</label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                {...register("extracurricularVolunteerWork")}
              />
              <label className="form-check-label">Volunteer Work</label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                {...register("extracurricularInternships")}
              />
              <label className="form-check-label">Internships</label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                {...register("extracurricularSports")}
              />
              <label className="form-check-label">Sports</label>
            </div>
          </div>
          <div className="col-md-4">
            <label className="form-label">Leadership Roles</label>
            <input
              type="text"
              className="form-control"
              {...register("leadershipRoles")}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Awards and Honors</label>
            <input
              type="text"
              className="form-control"
              {...register("awardsHonors")}
            />
          </div>
        </div>

        {/* Essay Section */}
        <h4 className="fw-bold mt-4">Essay/Personal Statement</h4>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">
              Essay (Personality and Aspirations)
            </label>
            <textarea
              className="form-control"
              rows="3"
              {...register("essay")}
            ></textarea>
          </div>
          <div className="col-md-4">
            <label className="form-label">Statement of Purpose</label>
            <textarea
              className="form-control"
              rows="3"
              {...register("sop")}
            ></textarea>
          </div>
        </div>

        {/* Financial Information */}
        <h4 className="fw-bold mt-4">Financial Information</h4>
        <div>
          {["Scholarship", "Family Funds", "Loans"].map((option) => (
            <div key={option} className="form-check">
              <input
                type="radio"
                className="form-check-input"
                value={option}
                {...register("financialInfo", { required: true })}
              />
              <label className="form-check-label">{option}</label>
            </div>
          ))}
          {errors.financialInfo && (
            <span className="text-danger d-block">
              {errors.financialInfo.message || "Financial information is required"}
            </span>
          )}
        </div>

        <div className="col-md-4 mt-3">
          <label className="form-label fw-bold">
            Financial Aid Application (if required)
          </label>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              value="FAFSA for U.S. Students"
              {...register("financialAid")}
            />
            <label className="form-check-label">FAFSA for U.S. Students</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              value="CSS Profile"
              {...register("financialAid")}
            />
            <label className="form-check-label">CSS Profile</label>
          </div>
        </div>

        {/* Documents Upload */}
        <h4 className="fw-bold mt-4 mb-3">Documents Upload</h4>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Passport Sized Photo</label>
            <input
              type="file"
              className="form-control"
              {...register("passportPhoto", {
                required: "Passport photo is required",
              })}
            />
            {errors.passportPhoto && (
              <span className="text-danger">
                {errors.passportPhoto.message}
              </span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Transcripts & Mark Sheet</label>
            <input
              type="file"
              className="form-control"
              {...register("transcripts", {
                required: "Transcripts & mark sheet are required",
              })}
            />
            {errors.transcripts && (
              <span className="text-danger">{errors.transcripts.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Test Score Reports</label>
            <input
              type="file"
              className="form-control"
              {...register("testScores", {
                required: "Test score reports are required",
              })}
            />
            {errors.testScores && (
              <span className="text-danger">{errors.testScores.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Resume</label>
            <input
              type="file"
              className="form-control"
              {...register("resume", { required: "Resume is required" })}
            />
            {errors.resume && (
              <span className="text-danger">{errors.resume.message}</span>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Portfolio</label>
            <input
              type="file"
              className="form-control"
              {...register("portfolio")}
            />
          </div>
        </div>

        {/* Application Fee */}
        <h4 className="fw-bold mt-4">Application Fee</h4>
        <div>
          <label className="form-label">Payment Method</label>
          {["Credit/Debit Card", "Fee Waiver"].map((option) => (
            <div key={option} className="form-check">
              <input
                type="radio"
                className="form-check-input"
                value={option}
                {...register("applicationFee", { required: true })}
              />
              <label className="form-check-label">{option}</label>
            </div>
          ))}
          {errors.applicationFee && (
            <span className="text-danger d-block">
              {errors.applicationFee.message || "Payment method is required"}
            </span>
          )}
        </div>

        {/* Agreement */}
        <h4 className="fw-bold mt-4">Agreement</h4>
        <div>
          <input
            type="checkbox"
            className="form-check-input"
            {...register("agreement", { required: "You must agree" })}
          />
          <label className="form-check-label">
            I agree to the terms and conditions
          </label>
          {errors.agreement && (
            <span className="text-danger d-block">
              {errors.agreement.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center mt-4">
          <button
            type="submit"
            className="btn btn-primary fs-5 px-5 py-2 fw-bold mx-auto rounded-5"
            disabled={hasApplied} // <-- Add this
          >
            Apply
          </button>
        </div>
      </form>
      {responseMessage && (
        <div className="alert alert-success text-center" role="alert">
          {responseMessage}
        </div>
      )}
    </div>
  );
};

export default ApplicationForm;