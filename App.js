import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { UserProvider } from "./JS/UserContext";
import SignupPage from "./JS/SignupPage";
import Landing from "./JS/Landing";
import LoginPage from "./JS/LoginPage";
import Home from "./JS/Home";
import Universities from "./JS/Universities";
import Notification from "./JS/Notification";
import About from "./JS/About";
import CollegeList from "./JS/CollegeList";
import CollegeApplicationForm from "./JS/CollegeApplicationForm";
import ProfilePage from "./JS/ProfilePage";
import AdminDashboard from "./JS/AdminDashboard";
import AccommodationApp from "./JS/Accommodation";
import Scholarship from "./JS/Scholarship";
import ScholarShipForm from "./JS/ScholarShipForm";
import ScholarshipDetails from "./JS/ScholarshipDetails";
import Recommendations from "./JS/Recommendations";
import RecommendedColleges from "./JS/RecommendedColleges";
import Collegeinfo from "./JS/Collegeinfo";
import WhatsAppChat from "./JS/WhatsAppChat";
import AbroadCollegeList from "./JS/AbroadCollegeList";
import AbroadCollegeInfo from "./JS/AbroadCollegeInfo";
import IndianUniversities from "./JS/IndianUniversities";
import AbroadUniversities from "./JS/AbroadUniversities";
import Chatbot from "./JS/Chatbot";
import GeneralForm from "./JS/GeneralForm"; // Import the GeneralForm component

const App = () => {
  return (
    <Router>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </Router>
  );
};

const AppContent = () => {
  return (
    <>
      {/* Global Components */}
      <WhatsAppChat />
      <Chatbot />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/university" element={<Universities />} />
        <Route path="/colleges" element={<CollegeList />} />
        <Route path="/appform" element={<CollegeApplicationForm />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/accommodation" element={<AccommodationApp />} />
        <Route path="/scholarship" element={<Scholarship />} />
        <Route path="/scForm" element={<ScholarShipForm />} />
        <Route path="/scdetails" element={<ScholarshipDetails />} />
        <Route path="/Recommendations" element={<Recommendations />} />
        <Route path="/recommendedcolleges" element={<RecommendedColleges />} />
        <Route path="/colleges/:id" element={<Collegeinfo />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/about" element={<About />} />
        <Route path="/indianuniversities" element={<IndianUniversities />} />
        <Route path="/abroaduniversities" element={<AbroadUniversities />} />
        <Route path="/abroadcolleges" element={<AbroadCollegeList />} />
        <Route path="/abroadcolleges/:id" element={<AbroadCollegeInfo />} />
        <Route path="/application-form" element={<GeneralForm />} /> {/* New Route */}
      </Routes>
    </>
  );
};

export default App;