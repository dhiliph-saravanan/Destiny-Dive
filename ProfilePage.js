import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { UserContext } from "./UserContext";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../CSS/ProfilePage.css";
import logo from "./images/navlogo.png";
import star from "./images/star-img.png";
import defaultProfilePic from "./images/default-profile.png";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Lottie from "lottie-react";
import timelineAnimation from "./animations/timeline.json";
import formSubmissionAnimation from "./animations/form_submission.json";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Draggable Timeline Event Component
function DraggableTimelineEvent({ event, index, moveEvent, type }) {
  const [{ isDragging }, drag] = useDrag({
    type: type || "TIMELINE_EVENT",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: type || "TIMELINE_EVENT",
    hover: (item) => {
      if (item.index !== index) {
        moveEvent(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <motion.div
      ref={(node) => drag(drop(node))}
      className={`cc-${type === "CAREER_MAP_EVENT" ? "career-map-item" : "timeline-item"} ${isDragging ? "cc-dragging" : ""} cc-animate ${type === "CAREER_MAP_EVENT" ? "slide-in-right" : "slide-in-left"} cc-draggable`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.2 }}
      draggable="true"
    >
      <div className={`cc-${type === "CAREER_MAP_EVENT" ? "career-map-bubble" : "timeline-bubble"}`}>
        <h4>{event.title}</h4>
        <p>{event.description}</p>
        <small>{new Date(event.date).toLocaleDateString()}</small>
      </div>
    </motion.div>
  );
}

// XP Progress Component
function XPProgress({ xpPoints, careerLevel, addXP }) {
  return (
    <div className="cc-xp-progress cc-animate scale-up cc-card">
      <div className="cc-xp-ring">
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" stroke="#e5e7eb" strokeWidth="12" fill="none" />
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="#6366f1"
            strokeWidth="12"
            fill="none"
            strokeDasharray="339.292"
            strokeDashoffset={339.292 * (1 - (xpPoints % 100) / 100)}
            className="cc-progress-circle"
          />
        </svg>
      </div>
      <p>
        🏅 XP: {xpPoints}/100 → <strong>Level {careerLevel + 1} unlocks roadmap editor!</strong>
      </p>
      <div className="cc-progress">
        <div className="cc-progress-bar cc-bg-success" style={{ width: `${xpPoints % 100}%` }}></div>
      </div>
      <button
        className="cc-btn cc-btn-primary cc-btn-sm cc-mt-2 cc-animate scale-up"
        onClick={() => addXP(10)}
        aria-label="Earn 10 XP"
      >
        +10 XP (Test)
      </button>
    </div>
  );
}

// Career Map Component
function CareerMap({ careerMapEvents, setCareerMapEvents, addXP }) {
  const [showModal, setShowModal] = useState(false);
  const [careerMapForm, setCareerMapForm] = useState({ title: "", description: "", date: "" });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCareerMapForm((prev) => ({ ...prev, [name]: value }));
  };

  const addCareerMapEvent = () => {
    if (!careerMapForm.title || !careerMapForm.description) {
      toast.error("Title and description are required");
      return;
    }
    const newEvent = { ...careerMapForm, date: careerMapForm.date || new Date().toISOString().split("T")[0] };
    setCareerMapEvents((prev) => [...prev, newEvent]);
    setCareerMapForm({ title: "", description: "", date: "" });
    setShowModal(false);
    addXP(30);
  };

  const moveCareerMapEvent = (fromIndex, toIndex) => {
    const updatedEvents = [...careerMapEvents];
    const [movedEvent] = updatedEvents.splice(fromIndex, 1);
    updatedEvents.splice(toIndex, 0, movedEvent);
    setCareerMapEvents(updatedEvents);
  };

  return (
    <section className="cc-career-map cc-mt-6 cc-bg-white cc-p-6 cc-rounded-lg cc-shadow-lg cc-animate fade-in cc-card">
      <h2 className="cc-text-2xl cc-font-semibold cc-mb-4">🗺️ Career Map</h2>
      <div className="cc-career-map-container">
        <Lottie animationData={timelineAnimation} loop={true} style={{ height: "100px" }} />
        {careerMapEvents.length > 0 ? (
          <div className="cc-career-map-scroll">
            {careerMapEvents.map((event, idx) => (
              <DraggableTimelineEvent
                key={idx}
                event={event}
                index={idx}
                moveEvent={moveCareerMapEvent}
                type="CAREER_MAP_EVENT"
              />
            ))}
            <div className="cc-career-map-item cc-future cc-animate slide-in-right cc-draggable">
              <div className="cc-career-map-bubble">
                <p>Drag to plan future milestones</p>
              </div>
            </div>
          </div>
        ) : (
          <p>No milestones added yet.</p>
        )}
        <button
          className="cc-btn cc-btn-primary cc-btn-sm cc-mt-3 cc-animate scale-up"
          onClick={() => setShowModal(true)}
          aria-label="Add career map milestone"
        >
          + Add Milestone
        </button>
      </div>
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="cc-timeline-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-labelledby="career-map-modal-title"
          >
            <motion.div
              className="cc-timeline-modal-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 id="career-map-modal-title">Add Career Milestone</h3>
              <input
                type="text"
                name="title"
                className="cc-form-control cc-mb-2"
                placeholder="Milestone Title"
                value={careerMapForm.title}
                onChange={handleFormChange}
                aria-label="Milestone title"
              />
              <textarea
                name="description"
                className="cc-form-control cc-mb-2"
                placeholder="Milestone Description"
                value={careerMapForm.description}
                onChange={handleFormChange}
                rows="3"
                aria-label="Milestone description"
              />
              <input
                type="date"
                name="date"
                className="cc-form-control cc-mb-2"
                value={careerMapForm.date}
                onChange={handleFormChange}
                aria-label="Milestone date"
              />
              <div className="cc-d-flex cc-gap-2">
                <button className="cc-btn cc-btn-success cc-btn-sm cc-animate scale-up" onClick={addCareerMapEvent}>
                  Add
                </button>
                <button
                  className="cc-btn cc-btn-danger cc-btn-sm cc-animate scale-up"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// Resources Component
function Resources({ addXP }) {
  const [filter, setFilter] = useState("all");
  const resources = [
    {
      id: 1,
      title: "Python for Everybody",
      description: "Learn Python programming basics.",
      category: "Coding",
      link: "https://www.coursera.org/learn/python",
    },
    {
      id: 2,
      title: "Career Prep Workshop",
      description: "Tips for resume building and interviews.",
      category: "Career Prep",
      link: "https://www.udemy.com/course/career-prep",
    },
    {
      id: 3,
      title: "Effective Communication",
      description: "Improve your soft skills.",
      category: "Soft Skills",
      link: "https://www.linkedin.com/learning/communication-skills",
    },
    {
      id: 4,
      title: "SQL Fundamentals",
      description: "Master SQL for data analysis.",
      category: "Coding",
      link: "https://www.khanacademy.org/computing/computer-programming/sql",
    },
  ];

  const filteredResources = filter === "all" ? resources : resources.filter((r) => r.category === filter);

  const handleComplete = (id) => {
    addXP(20);
    toast.success("Resource completed! +20 XP");
  };

  return (
    <section className="cc-resources cc-mt-6 cc-bg-white cc-p-6 cc-rounded-lg cc-shadow-lg cc-animate fade-in cc-card">
      <h2 className="cc-text-2xl cc-font-semibold cc-mb-4">📚 Resources</h2>
      <div className="cc-resources-filter cc-mb-3">
        <select
          className="cc-form-control"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter resources"
        >
          <option value="all">All Categories</option>
          <option value="Coding">Coding</option>
          <option value="Career Prep">Career Prep</option>
          <option value="Soft Skills">Soft Skills</option>
        </select>
      </div>
      <div className="cc-resources-grid cc-animate-stagger">
        {filteredResources.map((resource) => (
          <motion.div
            key={resource.id}
            className="cc-resource-card cc-animate slide-in-left cc-card"
            whileHover={{ scale: 1.02 }}
          >
            <h4>{resource.title}</h4>
            <p>{resource.description}</p>
            <a href={resource.link} target="_blank" rel="noopener noreferrer">
              Learn More
            </a>
            <button
              className="cc-btn cc-btn-success cc-btn-sm cc-mt-2 cc-animate scale-up"
              onClick={() => handleComplete(resource.id)}
              aria-label={`Complete ${resource.title}`}
            >
              Complete (+20 XP)
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// New Component for Editing Skills
function SkillEditor({ radarData, setRadarData, addXP }) {
  const [showModal, setShowModal] = useState(false);
  const [skillForm, setSkillForm] = useState({ skill: "", value: "" });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSkillForm((prev) => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    if (!skillForm.skill || !skillForm.value || isNaN(skillForm.value) || skillForm.value < 0 || skillForm.value > 100) {
      toast.error("Valid skill name and value (0-100) are required");
      return;
    }
    setRadarData((prev) => [...prev, { skill: skillForm.skill, value: Number(skillForm.value) }]);
    setSkillForm({ skill: "", value: "" });
    setShowModal(false);
    addXP(10);
  };

  return (
    <div className="cc-skill-editor cc-mt-4">
      <button
        className="cc-btn cc-btn-primary cc-btn-sm cc-animate scale-up"
        onClick={() => setShowModal(true)}
        aria-label="Edit skills"
      >
        Edit Skills
      </button>
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="cc-timeline-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-labelledby="skill-modal-title"
          >
            <motion.div
              className="cc-timeline-modal-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 id="skill-modal-title">Add Skill</h3>
              <input
                type="text"
                name="skill"
                className="cc-form-control cc-mb-2"
                placeholder="Skill Name"
                value={skillForm.skill}
                onChange={handleFormChange}
                aria-label="Skill name"
              />
              <input
                type="number"
                name="value"
                className="cc-form-control cc-mb-2"
                placeholder="Skill Value (0-100)"
                value={skillForm.value}
                onChange={handleFormChange}
                min="0"
                max="100"
                aria-label="Skill value"
              />
              <div className="cc-d-flex cc-gap-2">
                <button className="cc-btn cc-btn-success cc-btn-sm cc-animate scale-up" onClick={addSkill}>
                  Add
                </button>
                <button
                  className="cc-btn cc-btn-danger cc-btn-sm cc-animate scale-up"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// New Component for Editing Quests
function QuestEditor({ dailyQuests, setDailyQuests, addXP }) {
  const [showModal, setShowModal] = useState(false);
  const [questForm, setQuestForm] = useState({ task: "", xp: "" });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setQuestForm((prev) => ({ ...prev, [name]: value }));
  };

  const addQuest = () => {
    if (!questForm.task || !questForm.xp || isNaN(questForm.xp) || questForm.xp <= 0) {
      toast.error("Valid task and XP value are required");
      return;
    }
    setDailyQuests((prev) => [
      ...prev,
      { id: prev.length + 1, task: questForm.task, xp: Number(questForm.xp), completed: false },
    ]);
    setQuestForm({ task: "", xp: "" });
    setShowModal(false);
    addXP(10);
  };

  return (
    <div className="cc-quest-editor cc-mt-4">
      <button
        className="cc-btn cc-btn-primary cc-btn-sm cc-animate scale-up"
        onClick={() => setShowModal(true)}
        aria-label="Add quest"
      >
        Add Quest
      </button>
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="cc-timeline-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-labelledby="quest-modal-title"
          >
            <motion.div
              className="cc-timeline-modal-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 id="quest-modal-title">Add Daily Quest</h3>
              <input
                type="text"
                name="task"
                className="cc-form-control cc-mb-2"
                placeholder="Quest Task"
                value={questForm.task}
                onChange={handleFormChange}
                aria-label="Quest task"
              />
              <input
                type="number"
                name="xp"
                className="cc-form-control cc-mb-2"
                placeholder="XP Reward"
                value={questForm.xp}
                onChange={handleFormChange}
                min="1"
                aria-label="XP reward"
              />
              <div className="cc-d-flex cc-gap-2">
                <button className="cc-btn cc-btn-success cc-btn-sm cc-animate scale-up" onClick={addQuest}>
                  Add
                </button>
                <button
                  className="cc-btn cc-btn-danger cc-btn-sm cc-animate scale-up"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfilePage() {
  const { user, setUser } = useContext(UserContext);
  const [profile, setProfile] = useState(user || {});
  const [image, setImage] = useState(defaultProfilePic);
  const [editFields, setEditFields] = useState({});
  const [colleges, setColleges] = useState([]);
  const [showMoreWishlist, setShowMoreWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vibe, setVibe] = useState(localStorage.getItem("vibe") || "neutral");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [showOnboarding, setShowOnboarding] = useState(!localStorage.getItem("onboarded"));
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [marksForm, setMarksForm] = useState({
    "10th": profile.marks?.["10th"] || "",
    "12th": profile.marks?.["12th"] || "",
    "UG": profile.marks?.["UG"] || "",
    domainKnowledge: profile.careerAssessment?.bestFit?.domain || "",
  });
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showSubmissionAnimation, setShowSubmissionAnimation] = useState(false);
  const [applicationFormData, setApplicationFormData] = useState({
    name: profile.username || "",
    email: profile.email || "",
    phone: profile.phoneNumber || "",
    educationLevel: profile.educationLevel || "",
    marks10: profile.marks?.["10th"] || "",
    marks12: profile.marks?.["12th"] || "",
    marksUG: profile.marks?.["UG"] || "",
    field: profile.preferredField || "",
    country: profile.interestedCountry || "",
    resume: null,
    feedback: profile.feedback || "",
    rating: profile.rating || "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [interests, setInterests] = useState([]);
  const [journeyStage, setJourneyStage] = useState("");
  const [goal, setGoal] = useState("");
  const [mood, setMood] = useState(profile.mood || "neutral");
  const [showMoodModal, setShowMoodModal] = useState(!profile.mood);
  const [chatMessages, setChatMessages] = useState([
    { text: "Hey! What stream are you in?", options: ["Science", "Arts", "Commerce"] },
  ]);
  const [widgets, setWidgets] = useState(["Upcoming Exams", "Skill Progress"]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [timelineForm, setTimelineForm] = useState({ title: "", description: "", date: "" });
  const [careerMapEvents, setCareerMapEvents] = useState([
    { title: "Complete Degree", description: "Finish B.Tech in AI & DS", date: "2026-06-01" },
    { title: "First Job", description: "Join a tech company", date: "2027-01-01" },
    { title: "Master’s Degree", description: "Pursue MS in Data Science", date: "2029-06-01" },
  ]);
  const [mentors, setMentors] = useState([]);
  const [peers, setPeers] = useState([]);
  const [xpPoints, setXpPoints] = useState(85);
  const [careerLevel, setCareerLevel] = useState(1);
  const [dailyQuests, setDailyQuests] = useState([
    { id: 1, task: "Complete your profile", xp: 50, completed: true },
    { id: 2, task: "Add a timeline event", xp: 30, completed: true },
    { id: 3, task: "Explore 1 career path", xp: 50, completed: false },
  ]);
  const [radarData, setRadarData] = useState([
    { skill: "Coding", value: 80 },
    { skill: "Communication", value: 65 },
    { skill: "Problem Solving", value: 90 },
    { skill: "Teamwork", value: 70 },
    { skill: "Leadership", value: 55 },
  ]);
  const [profileCompletion, setProfileCompletion] = useState(65);
  const [careerFilter, setCareerFilter] = useState("all");
  const navigate = useNavigate();

  // Intersection Observer for Scroll Animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(".cc-animate, .cc-animate-stagger");
    animatedElements.forEach((element) => observer.observe(element));

    return () => {
      animatedElements.forEach((element) => observer.unobserve(element));
    };
  }, []);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("darkMode", newMode);
      document.body.classList.toggle("cc-dark-mode", newMode);
      return newMode;
    });
  };

  // Add XP and Update Career Level
  const addXP = async (points) => {
    setXpPoints((prev) => {
      const newXP = prev + points;
      const newLevel = Math.floor(newXP / 100);
      if (newLevel > careerLevel) {
        setCareerLevel(newLevel);
        toast.success(`Level Up! You are now Level ${newLevel}!`);
      }
      return newXP;
    });
    try {
      await axios.put(`http://localhost:4501/api/users/${user._id}`, {
        xpPoints: xpPoints + points,
        careerLevel: Math.floor((xpPoints + points) / 100),
      });
    } catch (error) {
      console.error("Error updating XP:", error);
      toast.error("Failed to save XP");
    }
  };

  // Fetch User Profile
  const fetchUserProfile = useCallback(async () => {
    if (!user?._id) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4501/api/users/${user._id}`);
      const fetchedProfile = response.data;
      setProfile(fetchedProfile);
      setUser(fetchedProfile);
      localStorage.setItem("user", JSON.stringify(fetchedProfile));
      setImage(fetchedProfile.profileImage || defaultProfilePic);
      setMood(fetchedProfile.mood || "neutral");
      setVibe(fetchedProfile.mood || "neutral");
      setShowMoodModal(!fetchedProfile.mood);
      localStorage.setItem("vibe", fetchedProfile.mood || "neutral");
      document.body.classList.remove("cc-vibe-tech", "cc-vibe-stressed", "cc-vibe-calm", "cc-vibe-neutral");
      document.body.classList.add(`cc-vibe-${fetchedProfile.mood || "neutral"}`);
      setMarksForm({
        "10th": fetchedProfile.marks?.["10th"] || "",
        "12th": fetchedProfile.marks?.["12th"] || "",
        "UG": fetchedProfile.marks?.["UG"] || "",
        domainKnowledge: fetchedProfile.careerAssessment?.bestFit?.domain || "",
      });
      setApplicationFormData({
        name: fetchedProfile.username || "",
        email: fetchedProfile.email || "",
        phone: fetchedProfile.phoneNumber || "",
        educationLevel: fetchedProfile.educationLevel || "",
        marks10: fetchedProfile.marks?.["10th"] || "",
        marks12: fetchedProfile.marks?.["12th"] || "",
        marksUG: fetchedProfile.marks?.["UG"] || "",
        field: fetchedProfile.preferredField || "",
        country: fetchedProfile.interestedCountry || "",
        resume: null,
        feedback: fetchedProfile.feedback || "",
        rating: fetchedProfile.rating || "",
      });
      setTimelineEvents(
        fetchedProfile.timeline || [
          { title: "Class 10", description: "Completed with 90%", date: "2018-06-01" },
          { title: "Class 12", description: "Completed with 85%", date: "2020-06-01" },
          { title: "NEET", description: "Attempted NEET exam", date: "2021-09-01" },
          { title: "Joined KGiSL", description: "Enrolled in AI & DS", date: "2022-08-01" },
          { title: "Internship", description: "Started internship", date: "2024-06-01" },
        ]
      );
      setXpPoints(fetchedProfile.xpPoints || 85);
      setCareerLevel(fetchedProfile.careerLevel || 1);
      setProfileCompletion(calculateProfileCompletion(fetchedProfile));
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error(error.response?.data?.message || "Failed to fetch profile");
      if (error.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [user?._id, setUser, navigate]);

  // Calculate Profile Completion
  const calculateProfileCompletion = useMemo(() => {
    return (profile) => {
      const fields = [
        profile.username,
        profile.email,
        profile.phoneNumber,
        profile.about,
        profile.marks?.["10th"],
        profile.marks?.["12th"],
        profile.preferredField,
        profile.interestedCountry,
      ];
      const totalFields = fields.length;
      const completedFields = fields.filter((field) => field).length;
      return Math.round((completedFields / totalFields) * 100);
    };
  }, []);

  // Fetch Colleges
  const fetchColleges = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4501/api/colleges");
      setColleges(response.data);
    } catch (error) {
      console.error("Error fetching colleges:", error);
      toast.error(error.response?.data?.message || "Failed to fetch colleges");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Mentors and Peers
  const fetchMentorsAndPeers = useCallback(() => {
    const mockMentors = [
      {
        id: 1,
        name: "Dr. John Doe",
        field: "AI",
        bio: "Expert in Machine Learning",
        verified: true,
        topics: ["Deep Learning", "NLP"],
      },
      {
        id: 2,
        name: "Jane Smith",
        field: "UI/UX Design",
        bio: "Specialist in User-Centered Design",
        verified: true,
        topics: ["Prototyping", "Usability Testing"],
      },
      {
        id: 3,
        name: "Alex Carter",
        field: "Data Science",
        bio: "Big Data Specialist",
        verified: false,
        topics: ["Hadoop", "Spark"],
      },
    ];
    const mockPeers = [
      { id: 1, name: "Alice Brown", interests: ["AI", "Data Science"], college: "KGiSL" },
      { id: 2, name: "Bob Wilson", interests: ["UI/UX", "Design"], college: "IIT Madras" },
      { id: 3, name: "Clara Lee", interests: ["Cloud Computing"], college: "Anna University" },
    ];
    setMentors(mockMentors);
    setPeers(mockPeers);
  }, []);

  useEffect(() => {
    fetchUserProfile();
    fetchColleges();
    fetchMentorsAndPeers();
    document.body.classList.toggle("cc-dark-mode", darkMode);
  }, [fetchUserProfile, fetchColleges, fetchMentorsAndPeers, darkMode]);

  // Handlers
  const handleEditToggle = (field) => {
    setEditFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleMarksChange = (e) => {
    const { name, value } = e.target;
    setMarksForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateMarks = () => {
    const fields = ["10th", "12th", "UG"];
    for (const field of fields) {
      const val = marksForm[field];
      if (val !== "" && (isNaN(val) || Number(val) < 0 || Number(val) > (field === "UG" ? 10 : 100))) {
        toast.error(`${field} marks must be between 0 and ${field === "UG" ? "10" : "100"}`);
        return false;
      }
      if (field === "UG" && val !== "" && !/^\d+(\.\d{1,2})?$/.test(val)) {
        toast.error("UG CGPA must have up to 2 decimal places");
        return false;
      }
    }
    return true;
  };

  const handleSaveMarks = async () => {
    if (!validateMarks() || !user?._id) {
      toast.error("Invalid input or user ID");
      return;
    }
    setLoading(true);
    try {
      const marksData = {
        "10th": marksForm["10th"] !== "" && !isNaN(Number(marksForm["10th"])) ? Number(marksForm["10th"]) : null,
        "12th": marksForm["12th"] !== "" && !isNaN(Number(marksForm["12th"])) ? Number(marksForm["12th"]) : null,
        "UG": marksForm["UG"] !== "" && !isNaN(Number(marksForm["UG"])) ? Number(marksForm["UG"]) : null,
      };
      await axios.post(`http://localhost:4501/api/user/marks/${user._id}`, { marks: marksData });
      const response = await axios.get(`http://localhost:4501/api/users/${user._id}`);
      setProfile(response.data);
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      setProfileCompletion(calculateProfileCompletion(response.data));
      toast.success("Marks updated successfully!");
      addXP(20);
    } catch (error) {
      console.error("Error saving marks:", error);
      toast.error(error.response?.data?.message || "Failed to update marks");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (field) => {
    const validationError = validateInput(field, profile[field]);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:4501/api/users/${user._id}`, {
        [field]: profile[field],
      });
      const updatedUser = response.data.data;
      setProfile(updatedUser);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditFields((prev) => ({ ...prev, [field]: false }));
      setProfileCompletion(calculateProfileCompletion(updatedUser));
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
      addXP(10);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const validateInput = (field, value) => {
    if (field === "email") {
      const emailRegex = /^\S+@\S+\.\S+$/;
      return emailRegex.test(value) ? "" : "Invalid email format";
    }
    if (field === "phoneNumber") {
      const phoneRegex = /^\d{10}$/;
      return phoneRegex.test(value) ? "" : "Phone number must be 10 digits";
    }
    if (field === "username" && !value) {
      return "Username is required";
    }
    if (field === "preferredField" && !value) {
      return "Preferred field is required";
    }
    if (field === "interestedCountry" && !value) {
      return "Interested country is required";
    }
    return "";
  };

  const handleMoodSelect = async (selectedMood) => {
    setMood(selectedMood);
    setVibe(selectedMood);
    setShowMoodModal(false);
    localStorage.setItem("vibe", selectedMood);
    document.body.classList.remove("cc-vibe-tech", "cc-vibe-stressed", "cc-vibe-calm", "cc-vibe-neutral");
    document.body.classList.add(`cc-vibe-${selectedMood}`);
    try {
      const response = await axios.put(`http://localhost:4501/api/users/${user._id}`, {
        mood: selectedMood,
      });
      const updatedUser = response.data.data;
      setProfile(updatedUser);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Mood updated successfully!");
      addXP(5);
    } catch (error) {
      console.error("Error saving mood:", error);
      toast.error(error.response?.data?.message || "Failed to save mood");
    }
  };

  const handleEditMood = () => {
    setShowMoodModal(true);
  };

  const handleOnboardingNext = () => {
    if (onboardingStep < 2) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setShowOnboarding(false);
      localStorage.setItem("onboarded", "true");
      addXP(20);
    }
  };

  const handleTimelineFormChange = (e) => {
    const { name, value } = e.target;
    setTimelineForm((prev) => ({ ...prev, [name]: value }));
  };

  const addTimelineEvent = async () => {
    if (!timelineForm.title || !timelineForm.description) {
      toast.error("Title and description are required");
      return;
    }
    const newEvent = {
      ...timelineForm,
      date: timelineForm.date || new Date().toISOString().split("T")[0],
    };
    setTimelineEvents((prev) => [...prev, newEvent]);
    setTimelineForm({ title: "", description: "", date: "" });
    setShowTimelineModal(false);
    try {
      await axios.put(`http://localhost:4501/api/users/${user._id}`, {
        timeline: [...timelineEvents, newEvent],
      });
      toast.success("Timeline event added!");
      addXP(30);
    } catch (error) {
      console.error("Error adding timeline event:", error);
      toast.error("Failed to add timeline event");
    }
  };

  const moveTimelineEvent = (fromIndex, toIndex) => {
    const updatedEvents = [...timelineEvents];
    const [movedEvent] = updatedEvents.splice(fromIndex, 1);
    updatedEvents.splice(toIndex, 0, movedEvent);
    setTimelineEvents(updatedEvents);
  };

  const handleQuestComplete = (questId) => {
    setDailyQuests((prev) =>
      prev.map((quest) =>
        quest.id === questId ? { ...quest, completed: true } : quest
      )
    );
    const quest = dailyQuests.find((q) => q.id === questId);
    if (quest) {
      addXP(quest.xp);
      toast.success(`Quest completed! +${quest.xp} XP`);
    }
  };

  const handleApplicationFormChange = (e) => {
    const { name, value, files } = e.target;
    setApplicationFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const validateApplicationForm = () => {
    const errors = {};
    if (!applicationFormData.name) errors.name = "Name is required";
    if (!applicationFormData.email || !/^\S+@\S+\.\S+$/.test(applicationFormData.email))
      errors.email = "Valid email is required";
    if (!applicationFormData.phone || !/^\d{10}$/.test(applicationFormData.phone))
      errors.phone = "Valid 10-digit phone number is required";
    if (!applicationFormData.educationLevel)
      errors.educationLevel = "Education level is required";
    if (!applicationFormData.field) errors.field = "Field is required";
    if (!applicationFormData.country) errors.country = "Country is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!validateApplicationForm()) {
      toast.error("Please fix form errors");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(applicationFormData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      await axios.post(`http://localhost:4501/api/applications/${user._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowApplicationForm(false);
      setShowSubmissionAnimation(true);
      setTimeout(() => setShowSubmissionAnimation(false), 3000); // Hide animation after 3 seconds
      toast.success("Application submitted successfully!");
      addXP(50);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(error.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
    toast.info("Logged out successfully");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`cc-profile-page cc-min-h-screen cc-vibe-${vibe}`}>
        <ToastContainer />
        {/* Navbar */}
        <nav className="cc-navbar cc-animate fade-in">
          <div className="cc-container-fluid cc-px-5">
            <Link to="/" className="cc-nav-link">
              <img src={logo} alt="Logo" className="cc-me-2" style={{ height: "40px" }} />
            </Link>
            <div className="cc-nav-links">
              <Link to="/dashboard" className="cc-nav-link">
                Dashboard
              </Link>
              <Link to="/careers" className="cc-nav-link">
                Careers
              </Link>
              <Link to="/mentors" className="cc-nav-link">
                Mentors
              </Link>
              <button
                className="cc-btn cc-btn-secondary cc-btn-sm cc-animate scale-up"
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
              >
                {darkMode ? "☀️ Light" : "🌙 Dark"}
              </button>
              <button
                className="cc-btn cc-btn-danger cc-btn-sm cc-animate scale-up"
                onClick={handleLogout}
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Mood Modal */}
        <AnimatePresence>
          {showMoodModal && (
            <motion.div
              className="cc-mood-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="dialog"
              aria-labelledby="mood-modal-title"
            >
              <motion.div
                className="cc-mood-content cc-card"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 id="mood-modal-title">How are you feeling today?</h2>
                <p>Pick a vibe to personalize your experience!</p>
                <div className="cc-mood-options">
                  <button className="cc-animate scale-up" onClick={() => handleMoodSelect("tech")}>
                    Tech 🚀
                  </button>
                  <button className="cc-animate scale-up" onClick={() => handleMoodSelect("stressed")}>
                    Stressed 😓
                  </button>
                  <button className="cc-animate scale-up" onClick={() => handleMoodSelect("calm")}>
                    Calm 🌊
                  </button>
                  <button className="cc-animate scale-up" onClick={() => handleMoodSelect("neutral")}>
                    Neutral 😊
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Onboarding Modal */}
        <AnimatePresence>
          {showOnboarding && (
            <motion.div
              className="cc-mood-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="cc-mood-content cc-card"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {onboardingStep === 0 && (
                  <>
                    <h2>Welcome to Your Career Journey!</h2>
                    <p>Let's set up your profile to get started.</p>
                    <button className="cc-btn cc-btn-primary cc-animate scale-up" onClick={handleOnboardingNext}>
                      Next
                    </button>
                  </>
                )}
                {onboardingStep === 1 && (
                  <>
                    <h2>Add Your Academic Details</h2>
                    <p>Enter your marks to unlock personalized recommendations.</p>
                    <button className="cc-btn cc-btn-primary cc-animate scale-up" onClick={handleOnboardingNext}>
                      Next
                    </button>
                  </>
                )}
                {onboardingStep === 2 && (
                  <>
                    <h2>Explore Your Dashboard</h2>
                    <p>Check out career paths, mentors, and more!</p>
                    <button className="cc-btn cc-btn-primary cc-animate scale-up" onClick={handleOnboardingNext}>
                      Get Started
                    </button>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Submission Animation */}
        <AnimatePresence>
          {showSubmissionAnimation && (
            <motion.div
              className="cc-mood-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="cc-mood-content cc-card"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Lottie animationData={formSubmissionAnimation} loop={false} style={{ height: "200px" }} />
                <h2>Application Submitted!</h2>
                <p>Your application has been successfully sent.</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="cc-px-5 cc-py-5">
          {loading ? (
            <div className="cc-text-center">
              <span className="cc-spinner-border" role="status"></span>
            </div>
          ) : (
            <>
              <section className="cc-hero cc-animate fade-in cc-card">
                <div className="cc-hero-overlay">
                  <div className="cc-hero-content">
                    <img
                      src={image}
                      alt="Profile"
                      className="cc-rounded-circle"
                      style={{ width: "120px", height: "120px" }}
                    />
                    <h1 className="cc-username">{profile.username || "User"}</h1>
                    <p>{profile.about || "Tell us about yourself!"}</p>
                    <p>
                      Current Mood: {mood.charAt(0).toUpperCase() + mood.slice(1)}{" "}
                      {mood === "tech" ? "🚀" : mood === "stressed" ? "😓" : mood === "calm" ? "🌊" : "😊"}
                    </p>
                    <XPProgress xpPoints={xpPoints} careerLevel={careerLevel} addXP={addXP} />
                    <div className="cc-d-flex cc-gap-2 cc-justify-content-center">
                      <button
                        className="cc-btn cc-btn-primary cc-mt-3 cc-animate scale-up"
                        onClick={() => handleEditToggle("about")}
                      >
                        Edit Profile
                      </button>
                      <button
                        className="cc-btn cc-btn-secondary cc-mt-3 cc-animate scale-up"
                        onClick={handleEditMood}
                      >
                        Edit Mood
                      </button>
                    </div>
                  </div>
                </div>
              </section>
              <CareerMap careerMapEvents={careerMapEvents} setCareerMapEvents={setCareerMapEvents} addXP={addXP} />
              <Resources addXP={addXP} />
              <section className="cc-vision cc-mt-6 cc-bg-white cc-p-6 cc-rounded-lg cc-shadow-lg cc-animate fade-in cc-card">
                <h2 className="cc-text-2xl cc-font-semibold cc-mb-4">🎯 My Vision</h2>
                <div className="cc-vision-content">
                  <div className="cc-goal">
                    <span>Goal:</span>
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="cc-form-control"
                      placeholder="Set your career goal"
                      aria-label="Career goal"
                    />
                  </div>
                  <div className="cc-progress-section">
                    <h3>Progress</h3>
                    <div className="cc-progress">
                      <div
                        className="cc-progress-bar cc-bg-success"
                        style={{ width: `${profileCompletion}%` }}
                      ></div>
                    </div>
                    <div className="cc-checklist cc-animate-stagger">
                      {["Profile Completed", "Marks Added", "Goal Set"].map((task, idx) => (
                        <div key={idx} className="cc-checklist-item cc-animate slide-in-left">
                          <span
                            className={
                              idx === 0
                                ? "cc-status-completed"
                                : idx === 1 && marksForm["10th"]
                                ? "cc-status-completed"
                                : "cc-status-pending"
                            }
                          >
                            {idx === 0 || (idx === 1 && marksForm["10th"]) ? "✓" : "✗"}
                          </span>
                          {task}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="cc-ai-suggestions">
                    <h3>AI Suggestions</h3>
                    <div className="cc-suggestion-item cc-animate slide-in-right cc-card">
                      <p>Consider adding a portfolio link to your profile.</p>
                      <small>Improves profile completion by 10%</small>
                    </div>
                    <div className="cc-suggestion-item cc-animate slide-in-right cc-card">
                      <p>Explore Data Science career paths.</p>
                      <small>Matches your interests</small>
                    </div>
                  </div>
                </div>
              </section>
              <section className="cc-timeline cc-mt-6 cc-bg-white cc-p-6 cc-rounded-lg cc-shadow-lg cc-animate fade-in cc-card">
                <h2 className="cc-text-2xl cc-font-semibold cc-mb-4">🕒 Life Timeline</h2>
                <div className="cc-timeline-container">
                  <Lottie animationData={timelineAnimation} loop={true} style={{ height: "100px" }} />
                  {timelineEvents.length > 0 ? (
                    <div className="cc-timeline-scroll">
                      {timelineEvents.map((event, idx) => (
                        <DraggableTimelineEvent
                          key={idx}
                          event={event}
                          index={idx}
                          moveEvent={moveTimelineEvent}
                        />
                      ))}
                      <div className="cc-timeline-item cc-future cc-animate slide-in-left cc-draggable">
                        <div className="cc-timeline-bubble">
                          <p>Drag to plan future events</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p>No timeline events added yet.</p>
                  )}
                  <button
                    className="cc-btn cc-btn-primary cc-btn-sm cc-mt-3 cc-animate scale-up"
                    onClick={() => setShowTimelineModal(true)}
                    aria-label="Add timeline event"
                  >
                    + Add Event
                  </button>
                </div>
                <AnimatePresence>
                  {showTimelineModal && (
                    <motion.div
                      className="cc-timeline-modal"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      role="dialog"
                      aria-labelledby="timeline-modal-title"
                    >
                      <motion.div
                        className="cc-timeline-modal-content cc-card"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 id="timeline-modal-title">Add Timeline Event</h3>
                        <input
                          type="text"
                          name="title"
                          className="cc-form-control cc-mb-2"
                          placeholder="Event Title"
                          value={timelineForm.title}
                          onChange={handleTimelineFormChange}
                          aria-label="Event title"
                        />
                        <textarea
                          name="description"
                          className="cc-form-control cc-mb-2"
                          placeholder="Event Description"
                          value={timelineForm.description}
                          onChange={handleTimelineFormChange}
                          rows="3"
                          aria-label="Event description"
                        />
                        <input
                          type="date"
                          name="date"
                          className="cc-form-control cc-mb-2"
                          value={timelineForm.date}
                          onChange={handleTimelineFormChange}
                          aria-label="Event date"
                        />
                        <div className="cc-d-flex cc-gap-2">
                          <button
                            className="cc-btn cc-btn-success cc-btn-sm cc-animate scale-up"
                            onClick={addTimelineEvent}
                          >
                            Add
                          </button>
                          <button
                            className="cc-btn cc-btn-danger cc-btn-sm cc-animate scale-up"
                            onClick={() => setShowTimelineModal(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
              <section className="cc-network cc-mt-6 cc-bg-white cc-p-6 cc-rounded-lg cc-shadow-lg cc-animate fade-in cc-card">
                <h2 className="cc-text-2xl cc-font-semibold cc-mb-4">🤝 Mentor & Peer Network</h2>
                <h3>Mentors</h3>
                <div className="cc-carousel cc-animate-stagger">
                  {mentors.map((mentor) => (
                    <div key={mentor.id} className="cc-carousel-item cc-animate slide-in-right cc-card">
                      <h4>{mentor.name}</h4>
                      <p>{mentor.field}</p>
                      {mentor.verified && <span className="cc-verified-badge">✓ Verified</span>}
                      <div className="cc-mini-bio">{mentor.bio}</div>
                    </div>
                  ))}
                </div>
                <h3>Peers</h3>
                <div className="cc-grid cc-gap-4 md:cc-grid-cols-3 cc-animate-stagger">
                  {peers.map((peer) => (
                    <div key={peer.id} className="cc-peer-card cc-animate slide-in-left cc-card">
                      <h4>{peer.name}</h4>
                      <p>{peer.interests.join(", ")}</p>
                      <small>{peer.college}</small>
                    </div>
                  ))}
                </div>
              </section>
              <section className="cc-quests cc-mt-6 cc-bg-white cc-p-6 cc-rounded-lg cc-shadow-lg cc-animate fade-in cc-card">
                <h2 className="cc-text-2xl cc-font-semibold cc-mb-4">🎮 Daily Quests</h2>
                {dailyQuests.map((quest) => (
                  <div
                    key={quest.id}
                    className={`cc-quest-item ${quest.completed ? "cc-quest-completed" : ""} cc-animate slide-in-right cc-card`}
                  >
                    <span>{quest.task}</span>
                    {!quest.completed && (
                      <button
                        className="cc-btn cc-btn-success cc-btn-sm cc-animate scale-up"
                        onClick={() => handleQuestComplete(quest.id)}
                        aria-label={`Complete ${quest.task}`}
                      >
                        Complete (+{quest.xp} XP)
                      </button>
                    )}
                  </div>
                ))}
                <QuestEditor dailyQuests={dailyQuests} setDailyQuests={setDailyQuests} addXP={addXP} />
              </section>
              <section className="cc-skill-snapshot cc-mt-6 cc-bg-white cc-p-6 cc-rounded-lg cc-shadow-lg cc-animate fade-in cc-card">
                <h2 className="cc-text-2xl cc-font-semibold cc-mb-4">📊 Skill Snapshot</h2>
                <ResponsiveContainer width="100%" height={300} className="cc-radar-chart">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis />
                    <Radar
                      name="Skills"
                      dataKey="value"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="cc-skill-recommendations cc-animate-stagger">
                  <div className="cc-skill-item cc-zone-yellow cc-animate slide-in-left cc-card">
                    <p>Leadership</p>
                    <small>Take a leadership course to boost this skill</small>
                  </div>
                  <div className="cc-skill-item cc-zone-green cc-animate slide-in-left cc-card">
                    <p>Problem Solving</p>
                    <small>You're excelling here!</small>
                  </div>
                </div>
                <SkillEditor radarData={radarData} setRadarData={setRadarData} addXP={addXP} />
              </section>
              <section className="cc-colleges cc-mt-6 cc-bg-white cc-p-6 cc-rounded-lg cc-shadow-lg cc-animate fade-in cc-card">
                <h2 className="cc-text-2xl cc-font-semibold cc-mb-4">🏫 College Recommendations</h2>
                <div className="cc-grid cc-gap-4 md:cc-grid-cols-3 cc-animate-stagger">
                  {colleges.slice(0, 3).map((college) => (
                    <div key={college.id} className="cc-college-card cc-animate slide-in-left cc-card">
                      <img src={college.image || defaultProfilePic} alt={college.name} />
                      <div className="cc-college-content">
                        <h4>{college.name}</h4>
                        <p>{college.location}</p>
                        <p>{college.ranking}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              <section className="cc-career-paths cc-mt-6 cc-bg-white cc-p-6 cc-rounded-lg cc-shadow-lg cc-animate fade-in cc-card">
                <h2 className="cc-text-2xl cc-font-semibold cc-mb-4">🚀 Top Career Paths</h2>
                <div className="cc-filter-bar">
                  <select
                    className="cc-form-control"
                    value={careerFilter}
                    onChange={(e) => setCareerFilter(e.target.value)}
                    aria-label="Filter career paths"
                  >
                    <option value="all">All</option>
                    <option value="tech">Tech</option>
                    <option value="design">Design</option>
                    <option value="business">Business</option>
                  </select>
                </div>
                {[
                  {
                    title: "Data Scientist",
                    match: "92% match",
                    salary: "$120K",
                    demand: "High",
                  },
                  {
                    title: "UI/UX Designer",
                    match: "85% match",
                    salary: "$95K",
                    demand: "Moderate",
                  },
                ].map((path, idx) => (
                  <div key={idx} className="cc-career-path cc-animate slide-in-right cc-card">
                    <h4>{path.title}</h4>
                    <div className="cc-career-details">
                      <p>Match: {path.match}</p>
                      <p>Salary: {path.salary}</p>
                      <p>Demand: {path.demand}</p>
                    </div>
                  </div>
                ))}
              </section>
              <section className="cc-personalize cc-mt-6 cc-bg-white cc-p-6 cc-rounded-lg cc-shadow-lg cc-animate fade-in cc-card">
                <h2 className="cc-text-2xl cc-font-semibold cc-mb-4">✨ Personalize Profile</h2>
                <div className="cc-profile-completion">
                  <h3>Profile Completion: {profileCompletion}%</h3>
                  <div className="cc-progress">
                    <div
                      className="cc-progress-bar cc-bg-success"
                      style={{ width: `${profileCompletion}%` }}
                    ></div>
                  </div>
                </div>
                <div className="cc-personalization-form">
                  <div className="cc-form-group">
                    <label htmlFor="username">Username</label>
                    {editFields.username ? (
                      <div className="cc-d-flex cc-gap-2">
                        <input
                          type="text"
                          id="username"
                          value={profile.username || ""}
                          onChange={(e) => handleInputChange("username", e.target.value)}
                          className="cc-form-control"
                          aria-label="Username"
                        />
                        <button
                          className="cc-btn cc-btn-success cc-btn-sm cc-animate scale-up"
                          onClick={() => handleSave("username")}
                        >
                          Save
                        </button>
                        <button
                          className="cc-btn cc-btn-danger cc-btn-sm cc-animate scale-up"
                          onClick={() => handleEditToggle("username")}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="cc-d-flex cc-justify-content-between cc-align-items-center">
                        <span>{profile.username || "Not set"}</span>
                        <button
                          className="cc-btn cc-btn-link cc-animate scale-up"
                          onClick={() => handleEditToggle("username")}
                          aria-label="Edit username"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="cc-form-group">
                    <label>Academic Details</label>
                    <div className="cc-marks-group">
                      <div>
                        <label htmlFor="10th">10th Marks (%)</label>
                        <input
                          type="text"
                          id="10th"
                          name="10th"
                          value={marksForm["10th"]}
                          onChange={handleMarksChange}
                          className="cc-form-control"
                          placeholder="e.g., 85"
                          aria-label="10th marks"
                        />
                      </div>
                      <div>
                        <label htmlFor="12th">12th Marks (%)</label>
                        <input
                          type="text"
                          id="12th"
                          name="12th"
                          value={marksForm["12th"]}
                          onChange={handleMarksChange}
                          className="cc-form-control"
                          placeholder="e.g., 90"
                          aria-label="12th marks"
                        />
                      </div>
                      <div>
                        <label htmlFor="UG">UG CGPA</label>
                        <input
                          type="text"
                          id="UG"
                          name="UG"
                          value={marksForm["UG"]}
                          onChange={handleMarksChange}
                          className="cc-form-control"
                          placeholder="e.g., 8.5"
                          aria-label="UG CGPA"
                        />
                      </div>
                    </div>
                    <button
                      className="cc-btn cc-btn-primary cc-mt-3 cc-animate scale-up"
                      onClick={handleSaveMarks}
                      disabled={loading}
                    >
                      Save Marks
                    </button>
                  </div>
                </div>
              </section>
              <section className="cc-personalize cc-mt-6 cc-bg-white cc-p-6 cc-rounded-lg cc-shadow-lg cc-animate fade-in cc-card">
                <h2 className="cc-text-2xl cc-font-semibold cc-mb-4">📝 Application Form</h2>
                <button
                  className="cc-btn cc-btn-primary cc-mb-4 cc-animate scale-up"
                  onClick={() => setShowApplicationForm(!showApplicationForm)}
                >
                  {showApplicationForm ? "Hide Form" : "Show Application Form"}
                </button>
                {showApplicationForm && (
                  <form className="cc-application-form cc-animate fade-in" onSubmit={handleApplicationSubmit}>
                    <div className="cc-form-group">
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={applicationFormData.name}
                        onChange={handleApplicationFormChange}
                        className="cc-form-control"
                        aria-label="Full name"
                      />
                      {formErrors.name && <span className="cc-error">{formErrors.name}</span>}
                    </div>
                    <div className="cc-form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={applicationFormData.email}
                        onChange={handleApplicationFormChange}
                        className="cc-form-control"
                        aria-label="Email"
                      />
                      {formErrors.email && <span className="cc-error">{formErrors.email}</span>}
                    </div>
                    <div className="cc-form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={applicationFormData.phone}
                        onChange={handleApplicationFormChange}
                        className="cc-form-control"
                        aria-label="Phone number"
                      />
                      {formErrors.phone && <span className="cc-error">{formErrors.phone}</span>}
                    </div>
                    <div className="cc-form-group">
                      <label htmlFor="educationLevel">Education Level</label>
                      <select
                        id="educationLevel"
                        name="educationLevel"
                        value={applicationFormData.educationLevel}
                        onChange={handleApplicationFormChange}
                        className="cc-form-control"
                        aria-label="Education level"
                      >
                        <option value="">Select</option>
                        <option value="High School">High School</option>
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Postgraduate">Postgraduate</option>
                      </select>
                      {formErrors.educationLevel && (
                        <span className="cc-error">{formErrors.educationLevel}</span>
                      )}
                    </div>
                    <div className="cc-form-group">
                      <label htmlFor="field">Field of Interest</label>
                      <input
                        type="text"
                        id="field"
                        name="field"
                        value={applicationFormData.field}
                        onChange={handleApplicationFormChange}
                        className="cc-form-control"
                        aria-label="Field of interest"
                      />
                      {formErrors.field && <span className="cc-error">{formErrors.field}</span>}
                    </div>
                    <div className="cc-form-group">
                      <label htmlFor="country">Interested Country</label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={applicationFormData.country}
                        onChange={handleApplicationFormChange}
                        className="cc-form-control"
                        aria-label="Interested country"
                      />
                      {formErrors.country && <span className="cc-error">{formErrors.country}</span>}
                    </div>
                    <div className="cc-form-group">
                      <label htmlFor="resume">Upload Resume</label>
                      <input
                        type="file"
                        id="resume"
                        name="resume"
                        onChange={handleApplicationFormChange}
                        className="cc-form-control"
                        accept=".pdf"
                        aria-label="Upload resume"
                      />
                    </div>
                    <button type="submit" className="cc-btn cc-btn-primary cc-animate scale-up" disabled={loading}>
                      Submit Application
                    </button>
                  </form>
                )}
              </section>
              <section className="cc-wishlist cc-mt-6 cc-bg-white cc-p-6 cc-rounded-lg cc-shadow-lg cc-animate fade-in cc-card">
                <h2 className="cc-text-2xl cc-font-semibold cc-mb-4">🌟 Wishlist</h2>
                <div className="cc-wishlist-grid cc-animate-stagger">
                  {[
                    { id: 1, name: "MIT", image: star },
                    { id: 2, name: "Stanford", image: star },
                    ...(showMoreWishlist
                      ? [
                          { id: 3, name: "Harvard", image: star },
                          { id: 4, name: "Caltech", image: star },
                        ]
                      : []),
                  ].map((item) => (
                    <div key={item.id} className="cc-wishlist-item cc-animate slide-in-left cc-card">
                      <img src={item.image} alt={item.name} />
                      <p>{item.name}</p>
                    </div>
                  ))}
                </div>
                <button
                  className="cc-btn cc-btn-link cc-mt-3 cc-animate scale-up"
                  onClick={() => setShowMoreWishlist(!showMoreWishlist)}
                >
                  {showMoreWishlist ? "Show Less" : "Show More"}
                </button>
              </section>
            </>
          )}
        </main>
        <button
          className="cc-fab cc-animate scale-up"
          onClick={() => setShowApplicationForm(true)}
          aria-label="Open application form"
        >
          +
        </button>
      </div>
    </DndProvider>
  );
}

export default ProfilePage;