import React from "react";
import "../CSS/whatsapp.css"; // Import the CSS file

const WhatsAppChat = () => {
  const phoneNumber = "+91 94433 05688"; // Replace with your number
  const message = "Hello! I need career guidance.";

  const openWhatsApp = () => {
    const whatsappURL = `https://wa.me/${+919443305688}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <button className="whatsapp-chat" onClick={openWhatsApp}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
      />
    </button>
  );
};

export default WhatsAppChat;
