import React, { useContext, useEffect, useState, useCallback, useRef } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "../CSS/About.css";

function About() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [insights, setInsights] = useState({
    searchHistory: [],
    marks: { "10th": null, "12th": null, "UG": null },
    aiScore: null,
    profileCompletion: { resumeUploaded: false, sopSubmitted: false, letterOfRec: false },
  });
  const [profileStatus, setProfileStatus] = useState({ completionPercentage: 0 });
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const lastUpdateRef = useRef(new Date());

  // Fetch user insights
  const fetchInsights = useCallback(async () => {
    if (!user?._id) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const insightsResponse = await axios.get(`http://localhost:4501/api/user/insights/${user._id}`);
      setInsights(insightsResponse.data);

      const statusResponse = await axios.get(`http://localhost:4501/api/user/profile-status/${user._id}`);
      setProfileStatus(statusResponse.data);

      const searchFreq = insightsResponse.data.searchHistory.reduce((acc, term) => {
        acc[term] = (acc[term] || 0) + 1;
        return acc;
      }, {});
      const chartData = Object.keys(searchFreq).map((term) => ({ term, frequency: searchFreq[term] }));
      setSearchData(chartData);
    } catch (error) {
      console.error("Error fetching insights:", error);
      toast.error(error.response?.data?.message || "Failed to fetch insights");
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [user?._id, navigate]);

  useEffect(() => {
    fetchInsights();
    const interval = setInterval(() => {
      const now = new Date();
      const diffDays = (now - lastUpdateRef.current) / (1000 * 60 * 60 * 24);
      if (diffDays >= 3 && !insights.profileCompletion.resumeUploaded) {
        toast.info("Don’t forget to complete your profile. It boosts your university matches!");
      }
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [fetchInsights, insights.profileCompletion.resumeUploaded]);

  // Suggest next action
  const suggestNextAction = () => {
    const { resumeUploaded, sopSubmitted, letterOfRec } = insights.profileCompletion;
    if (!resumeUploaded) return "Upload your resume to improve your profile!";
    if (!sopSubmitted) return "Submit your Statement of Purpose (SOP) next.";
    if (!letterOfRec) return "Add a Letter of Recommendation to complete your profile.";
    return "Your profile is complete! Explore colleges now.";
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setResumeFile(file);
    } else {
      toast.error("Please upload a .pdf or .docx file.");
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileUpload(e);
  };

  // Upload resume to backend
  const uploadResume = async () => {
    if (!resumeFile) {
      toast.error("Please select a resume file first.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", resumeFile);

    try {
      await axios.post(`http://localhost:4501/api/user/upload-resume`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchInsights(); // Update insights and status
      setShowUploadModal(false);
      setResumeFile(null);
      toast.success("Resume uploaded successfully!");
      lastUpdateRef.current = new Date();
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error(error.response?.data?.message || "Failed to upload resume");
    } finally {
      setLoading(false);
    }
  };

  // AI-based suggestions (simulated)
  const getAiSuggestions = () => {
    const keywords = ["Data Science", "AI", "Engineering"];
    const resumeKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    const searchKeyword = searchData.length > 0 ? searchData[0].term : "";
    const suggestion = `You might want to check out ${resumeKeyword === "Data Science" ? "Carnegie Mellon’s MS in DS" : resumeKeyword === "AI" ? "MIT’s AI Program" : "Stanford’s Engineering Program"} program.`;
    return suggestion;
  };

  // Peer comparison (simulated)
  const getPeerComparison = () => {
    const randomPercentile = Math.floor(Math.random() * 100);
    return `Your profile is more complete than ${randomPercentile}% of students aiming for USA`;
  };

  // Gamified badges
  const getBadges = () => {
    const badges = [];
    if (insights.profileCompletion.resumeUploaded) badges.push("✅ Resume Hero");
    if (insights.searchHistory.length >= 10) badges.push("✅ Research Explorer");
    if (insights.profileCompletion.sopSubmitted) badges.push("✅ SOP Master");
    return badges.length > 0 ? badges.join(", ") : "No badges yet!";
  };

  return (
    <div className="ud-about-container">
      <ToastContainer />
      {loading ? (
        <div className="ud-text-center ud-my-5">
          <div className="ud-spinner-border" role="status">
            <span className="ud-visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="ud-container ud-py-5">
          <h1 className="ud-mb-5 ud-text-center">About You</h1>

          {/* Profile Summary Card */}
          <div className="ud-profile-summary-card ud-card ud-mb-5">
            <div className="ud-card-body ud-text-center">
              <h3 className="ud-card-title">{user?.username || "User"}</h3>
              <p className="ud-card-text">
                <strong>Goal:</strong> Pursuing higher education
              </p>
              <p className="ud-card-text">
                <strong>Last Action:</strong>{" "}
                {insights.searchHistory.length > 0
                  ? `Searched for "${insights.searchHistory[insights.searchHistory.length - 1]}"`
                  : "No recent searches"}
              </p>
            </div>
          </div>

          {/* Profile Completion Progress */}
          <div className="ud-progress-section ud-mb-5">
            <h4>Profile Completion</h4>
            <div className="ud-progress ud-mb-3">
              <div
                className="ud-progress-bar ud-bg-success"
                role="progressbar"
                style={{ width: `${profileStatus.completionPercentage}%` }}
                aria-valuenow={profileStatus.completionPercentage}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {profileStatus.completionPercentage}%
              </div>
            </div>
            <p>
              <strong>Status:</strong>{" "}
              {Object.entries(insights.profileCompletion)
                .map(([key, value]) => `${key}: ${value ? "Completed" : "Pending"}`)
                .join(", ")}
            </p>
            <p><strong>Dynamic Progress:</strong> Profile {profileStatus.completionPercentage}% complete</p>
            <p><strong>Badges:</strong> {getBadges()}</p>
            <p><strong>Peer Comparison:</strong> {getPeerComparison()}</p>
          </div>

          {/* Search History Chart */}
          {searchData.length > 0 && (
            <div className="ud-chart-section ud-mb-5">
              <h4>Search History Trends</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={searchData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="term" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="frequency" fill="#007bff" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Insights Cards */}
          <div className="ud-insights-section ud-mb-5">
            <h4>Insights</h4>
            <div className="ud-row">
              <div className="ud-col-md-4 ud-mb-3">
                <div className="ud-insight-card ud-card">
                  <div className="ud-card-body">
                    <h5 className="ud-card-title">Academic Performance</h5>
                    <p className="ud-card-text">
                      10th: {insights.marks["10th"] || "N/A"}%<br />
                      12th: {insights.marks["12th"] || "N/A"}%<br />
                      UG: {insights.marks["UG"] || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="ud-col-md-4 ud-mb-3">
                <div className="ud-insight-card ud-card">
                  <div className="ud-card-body">
                    <h5 className="ud-card-title">AI Score</h5>
                    <p className="ud-card-text">
                      {insights.aiScore !== null ? `${insights.aiScore}/100` : "Not calculated yet"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="ud-col-md-4 ud-mb-3">
                <div className="ud-insight-card ud-card">
                  <div className="ud-card-body">
                    <h5 className="ud-card-title">Search Preference</h5>
                    <p className="ud-card-text">
                      {searchData.length > 0
                        ? `You search most for "${searchData.reduce((a, b) => (a.frequency > b.frequency ? a : b)).term}"`
                        : "No search history"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="ud-col-12 ud-mb-3">
                <div className="ud-insight-card ud-card">
                  <div className="ud-card-body">
                    <h5 className="ud-card-title">AI Suggestions</h5>
                    <p className="ud-card-text">{getAiSuggestions()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Suggested Action */}
          <div className="ud-next-action-section ud-text-center">
            <h4>Next Suggested Action</h4>
            <p className="ud-mb-3">{suggestNextAction()}</p>
            <button className="ud-btn ud-btn-primary" onClick={() => setShowUploadModal(true)}>
              Take Action
            </button>
          </div>

          {/* Resume Upload Modal */}
          {showUploadModal && (
            <div className="ud-modal-overlay" onClick={() => setShowUploadModal(false)}>
              <div className="ud-modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Upload Your Resume</h2>
                <div
                  className={`ud-drag-drop-area ${dragActive ? "ud-drag-active" : ""}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                    accept=".pdf,.docx"
                  />
                  {resumeFile ? (
                    <p>Selected: {resumeFile.name}</p>
                  ) : (
                    <p>Drag and drop a .pdf or .docx file here, or click to select.</p>
                  )}
                </div>
                <div className="ud-modal-actions">
                  <button className="ud-btn ud-btn-success" onClick={uploadResume} disabled={loading}>
                    Upload
                  </button>
                  <button className="ud-btn ud-btn-secondary" onClick={() => setShowUploadModal(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default About;