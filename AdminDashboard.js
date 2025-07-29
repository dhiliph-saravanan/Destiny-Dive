import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import {
  FaUsers, FaUniversity, FaFileAlt, FaGlobe, FaBed, FaBrain,
  FaChartBar, FaPaintBrush, FaBell, FaCog, FaUserShield, FaDatabase,
  FaGraduationCap, FaRobot, FaBook, FaSearch, FaCheck, FaTimes
} from "react-icons/fa";
import "../CSS/adminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [abroadColleges, setAbroadColleges] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [careerPaths, setCareerPaths] = useState([]);
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [aiLogs, setAiLogs] = useState([]);
  const [content, setContent] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [settings, setSettings] = useState({ maintenanceMode: false });
  const [examsGenerated, setExamsGenerated] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");
  const [loading, setLoading] = useState(true);

  // Search and Filter States
  const [userSearch, setUserSearch] = useState("");
  const [mentorSearch, setMentorSearch] = useState("");
  const [applicationSearch, setApplicationSearch] = useState("");
  const [applicationFilter, setApplicationFilter] = useState("all");
  const [collegeSearch, setCollegeSearch] = useState("");
  const [careerPathSearch, setCareerPathSearch] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchUsers(),
        fetchMentors(),
        fetchUniversities(),
        fetchAbroadColleges(),
        fetchAccommodations(),
        fetchApplications(),
        fetchCareerPaths(),
        fetchCourses(),
        fetchAnalytics(),
        fetchAiLogs(),
        fetchContent(),
        fetchNotifications(),
        fetchAdmins(),
        fetchSettings(),
        fetchExamsGenerated(),
      ]);
      setLoading(false);
    };
    fetchAllData();
  }, []);

  // Fetch Functions
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:4501/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchMentors = async () => {
    try {
      const response = await axios.get("http://localhost:4501/api/mentors");
      setMentors(response.data);
    } catch (error) {
      console.error("Error fetching mentors:", error);
    }
  };

  const fetchUniversities = async () => {
    try {
      const response = await axios.get("http://localhost:4501/api/colleges");
      setUniversities(response.data);
    } catch (error) {
      console.error("Error fetching universities:", error);
    }
  };

  const fetchAbroadColleges = async () => {
    try {
      const response = await axios.get("http://localhost:4501/api/abroadcolleges");
      setAbroadColleges(response.data);
    } catch (error) {
      console.error("Error fetching abroad colleges:", error);
    }
  };

  const fetchAccommodations = async () => {
    try {
      const response = await axios.get("http://localhost:4501/api/accommodations");
      setAccommodations(response.data);
    } catch (error) {
      console.error("Error fetching accommodations:", error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await axios.get("http://localhost:4501/api/applications");
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const fetchCareerPaths = async () => {
    try {
      const response = await axios.get("http://localhost:4501/api/careerpaths");
      setCareerPaths(response.data);
    } catch (error) {
      console.error("Error fetching career paths:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:4501/api/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get("http://localhost:4501/api/analytics");
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const fetchAiLogs = async () => {
    try {
      const response = await axios.get("http://localhost:4501/api/ailogs");
      setAiLogs(response.data);
    } catch (error) {
      console.error("Error fetching AI logs:", error);
    }
  };

  const fetchContent = async () => {
    try {
      const response = await axios.get("http://localhost:4501/api/content");
      setContent(response.data);
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:4501/api/notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await axios.get("http://localhost:4501/api/admins");
      setAdmins(response.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get("http://localhost:4501/api/settings");
      setSettings(response.data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const fetchExamsGenerated = async () => {
    try {
      const response = await axios.get("http://localhost:4501/api/exams");
      setExamsGenerated(response.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  // Action Handlers
  const handleStatusChange = async (id, newStatus, comment = "") => {
    try {
      await axios.put(`http://localhost:4501/api/applications/${id}`, { status: newStatus, comment });
      fetchApplications();
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const handleBulkApprove = async (ids) => {
    try {
      await axios.post("http://localhost:4501/api/applications/bulk-approve", { ids });
      fetchApplications();
    } catch (error) {
      console.error("Error bulk approving applications:", error);
    }
  };

  const toggleMaintenanceMode = async () => {
    try {
      const newMode = !settings.maintenanceMode;
      await axios.put("http://localhost:4501/api/settings", { maintenanceMode: newMode });
      setSettings({ ...settings, maintenanceMode: newMode });
    } catch (error) {
      console.error("Error toggling maintenance mode:", error);
    }
  };

  // Filters
  const filteredUsers = users.filter(user =>
    (user.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
     user.emailOrMobile?.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const filteredMentors = mentors.filter(mentor =>
    mentor.username?.toLowerCase().includes(mentorSearch.toLowerCase())
  );

  const filteredApplications = applications.filter(app =>
    (applicationFilter === "all" || app.status === applicationFilter) &&
    (app.fullName?.toLowerCase().includes(applicationSearch.toLowerCase()) ||
     app.collegeName?.toLowerCase().includes(applicationSearch.toLowerCase()))
  );

  const filteredCareerPaths = careerPaths.filter(path =>
    path.name?.toLowerCase().includes(careerPathSearch.toLowerCase())
  );

  const filteredUniversities = universities.filter(col =>
    col.name?.toLowerCase().includes(collegeSearch.toLowerCase())
  );

  const statusCounts = {
    total: applications.length,
    approved: applications.filter(app => app.status === "approved").length,
    pending: applications.filter(app => app.status === "pending").length,
    rejected: applications.filter(app => app.status === "rejected").length,
  };

  const chartData = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [{
      data: [statusCounts.approved, statusCounts.pending, statusCounts.rejected],
      backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
    }],
  };

  const chartOptions = {
    plugins: { legend: { position: "bottom" } },
  };

  const activeUsersToday = users.filter(user => {
    const lastLogin = new Date(user.lastLogin);
    const today = new Date();
    return lastLogin.toDateString() === today.toDateString();
  }).length;

  const topCareerPaths = careerPaths
    .sort((a, b) => (b.viewsToday || 0) - (a.viewsToday || 0))
    .slice(0, 5);

  return (
    <div className="adm-container">
      {/* Sidebar */}
      <div className="adm-sidebar fixed h-full">
        <div className="p-4 text-xl font-bold text-gray-800">Admin Dashboard</div>
        <ul>
          {[
            { id: "overview", icon: <FaBrain />, label: "Overview" },
            { id: "users", icon: <FaUsers />, label: "Users" },
            { id: "applications", icon: <FaFileAlt />, label: "Applications" },
            { id: "careerPaths", icon: <FaBook />, label: "Career Paths" },
            { id: "institutes", icon: <FaUniversity />, label: "Institutes" },
            { id: "analytics", icon: <FaChartBar />, label: "Analytics" },
          ].map(section => (
            <li
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={activeSection === section.id ? "adm-active" : ""}
            >
              <span className="flex items-center">
                {section.icon}
                <span className="ml-2">{section.label}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="adm-main-content">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="adm-spinner"></div>
          </div>
        ) : (
          <>
            {/* Overview */}
            {activeSection === "overview" && (
              <div className="adm-section-card">
                <div className="adm-section-header">
                  <h2 className="adm-section-title">Website Overview</h2>
                </div>
                <div className="adm-grid-overview">
                  <div className="adm-overview-card">
                    <h3>Total Users: {users.length}</h3>
                    <div className="adm-chart-container">
                      <Pie data={chartData} options={chartOptions} />
                    </div>
                  </div>
                  <div className="adm-overview-card">
                    <h3>New Registrations</h3>
                    <ul className="list-disc pl-5">
                      {users.slice(0, 5).map(user => (
                        <li key={user._id}>{user.username}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="adm-overview-card">
                    <h3>Active Users Today: {activeUsersToday}</h3>
                  </div>
                  <div className="adm-overview-card">
                    <h3>Applications Pending: {statusCounts.pending}</h3>
                    <button onClick={() => setActiveSection("applications")} className="adm-btn">View</button>
                  </div>
                  <div className="adm-overview-card">
                    <h3>Total Exams Generated: {examsGenerated.length}</h3>
                  </div>
                  <div className="adm-overview-card">
                    <h3>Mentors: {mentors.length} (Verified: {mentors.filter(m => m.verified).length})</h3>
                  </div>
                  <div className="adm-overview-card">
                    <h3>Daily Career Searches: {analytics.dailySearches || 0}</h3>
                  </div>
                  <div className="adm-overview-card">
                    <h3>Top 5 Career Paths Today</h3>
                    <ul className="list-disc pl-5">
                      {topCareerPaths.map(path => (
                        <li key={path._id}>{path.name} ({path.viewsToday || 0})</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* User Management */}
            {activeSection === "users" && (
              <div className="adm-section-card">
                <div className="adm-section-header">
                  <h2 className="adm-section-title">User Management</h2>
                </div>
                <div className="flex space-x-4 mb-4">
                  <button onClick={() => setActiveSection("users_students")} className="adm-btn">Students</button>
                  <button onClick={() => setActiveSection("users_mentors")} className="adm-btn">Mentors</button>
                </div>
                {activeSection === "users_students" && (
                  <>
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="adm-search-input"
                    />
                    <table className="adm-table">
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>Grade</th>
                          <th>Goal</th>
                          <th>Location</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map(user => (
                          <tr key={user._id}>
                            <td>{user.username}</td>
                            <td>{user.grade || "N/A"}</td>
                            <td>{user.goal || "N/A"}</td>
                            <td>{user.location || "N/A"}</td>
                            <td>{user.activityStatus || "N/A"}</td>
                            <td>
                              <button className="text-blue-500 hover:underline">View</button>
                              <button className="text-red-500 hover:underline ml-2">Ban</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
                {activeSection === "users_mentors" && (
                  <>
                    <input
                      type="text"
                      placeholder="Search mentors..."
                      value={mentorSearch}
                      onChange={(e) => setMentorSearch(e.target.value)}
                      className="adm-search-input"
                    />
                    <table className="adm-table">
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>Expertise</th>
                          <th>Verified</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMentors.map(mentor => (
                          <tr key={mentor._id}>
                            <td>{mentor.username}</td>
                            <td>{mentor.expertise || "N/A"}</td>
                            <td>{mentor.verified ? "Yes" : "No"}</td>
                            <td>
                              <button className="text-blue-500 hover:underline">View</button>
                              <button
                                onClick={() => handleStatusChange(mentor._id, mentor.verified ? "rejected" : "approved")}
                                className="text-green-500 hover:underline ml-2"
                              >
                                {mentor.verified ? "Deny" : "Approve"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            )}

            {/* Application Management */}
            {activeSection === "applications" && (
              <div className="adm-section-card">
                <div className="adm-section-header">
                  <h2 className="adm-section-title">Application Management</h2>
                  <button onClick={() => handleBulkApprove(filteredApplications.map(app => app._id))} className="adm-btn">Bulk Approve</button>
                </div>
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={applicationSearch}
                  onChange={(e) => setApplicationSearch(e.target.value)}
                  className="adm-search-input"
                />
                <select
                  value={applicationFilter}
                  onChange={(e) => setApplicationFilter(e.target.value)}
                  className="p-2 mb-4 border rounded"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map(app => (
                      <tr key={app._id}>
                        <td>{app.fullName}</td>
                        <td>{app.userType}</td>
                        <td>{new Date(app.date).toLocaleDateString()}</td>
                        <td>{app.status}</td>
                        <td>
                          <button onClick={() => handleStatusChange(app._id, "approved")} className="text-green-500 hover:underline"><FaCheck /></button>
                          <button onClick={() => handleStatusChange(app._id, "rejected")} className="text-red-500 hover:underline ml-2"><FaTimes /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Career Roadmap & Course Control */}
            {activeSection === "careerPaths" && (
              <div className="adm-section-card">
                <div className="adm-section-header">
                  <h2 className="adm-section-title">Career Roadmap & Course Control</h2>
                </div>
                <input
                  type="text"
                  placeholder="Search career paths..."
                  value={careerPathSearch}
                  onChange={(e) => setCareerPathSearch(e.target.value)}
                  className="adm-search-input"
                />
                <div className="adm-grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredCareerPaths.map(path => (
                    <div key={path._id} className="p-4 bg-white rounded-lg shadow">
                      <img src={path.image || "default.jpg"} alt={path.name} className="w-full h-40 object-cover rounded" />
                      <h3 className="font-semibold mt-2">{path.name}</h3>
                      <p className="text-gray-600">{path.description}</p>
                      <button className="text-blue-500 hover:underline mt-2">Edit</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Institute & Course Database */}
            {activeSection === "institutes" && (
              <div className="adm-section-card">
                <div className="adm-section-header">
                  <h2 className="adm-section-title">Institute & Course Database</h2>
                </div>
                <input
                  type="text"
                  placeholder="Search institutes..."
                  value={collegeSearch}
                  onChange={(e) => setCollegeSearch(e.target.value)}
                  className="adm-search-input"
                />
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Courses</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUniversities.map(col => (
                      <tr key={col._id}>
                        <td>{col.name}</td>
                        <td>{col.type || "N/A"}</td>
                        <td>{col.courses?.length || 0}</td>
                        <td>
                          <button className="text-blue-500 hover:underline">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Analytics */}
            {activeSection === "analytics" && (
              <div className="adm-section-card">
                <div className="adm-section-header">
                  <h2 className="adm-section-title">Analytics Dashboard</h2>
                </div>
                <div className="adm-grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="font-semibold">User Behavior</h3>
                    <p>Most Searched Careers: {analytics.mostSearchedCareers?.join(", ") || "N/A"}</p>
                    <div className="adm-chart-container">
                      <Bar data={chartData} options={chartOptions} />
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="font-semibold">Exam Generator Usage</h3>
                    <p>Total Exams: {examsGenerated.length}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;