import React from "react";
import "../CSS/Modal.css";

const Modal = ({ closeModal, onLogin, onSkip }) => {
  return (
    <div className="modal-overlay fade-in" onClick={closeModal}>
      <div className="modal-content pop-in" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <span className="close-btn" onClick={closeModal}>×</span>

        {/* Welcome Title & Subtitle */}
        <h2 className="modal-title">Welcome to Destiny Dive!</h2>
        <p className="modal-subtitle">
          Login for a **personalized experience**, or skip to explore freely.
        </p>

        {/* Buttons with new design */}
        <div className="modal-buttons">
          <button className="modal-btn login" onClick={onLogin}>Login</button>
          <button className="modal-btn skip" onClick={onSkip}>Skip</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
