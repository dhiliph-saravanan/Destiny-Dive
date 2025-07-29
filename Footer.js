import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import "../CSS/footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="custom-footer">
      <div className="footer-container">
        {/* Divider */}
        <hr className="footer-divider" />

        {/* Social Media Icons */}
        <div className="social-icons">
  <a href="#" aria-label="Facebook">
    <FaFacebook />
  </a>
  <a
    href="https://www.instagram.com/destiny_dive?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
  >
    <FaInstagram />
  </a>
  <a href="#" aria-label="Twitter">
    <FaTwitter />
  </a>
  <a href="https://www.linkedin.com/in/destiny-dive-55025133b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app&lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3BcqbBlf2VTe2llLFa5N6ujA%3D%3D" 
  aria-label="LinkedIn"
    target="_blank"
    rel="noopener noreferrer">
    <FaLinkedin />
  </a>
</div>


        {/* Links */}
        <div className="footer-links">
          <a href="#">About</a>
          <a href="#">Contact Us</a>
          <a href="#">FAQs</a>
          <a href="#">Terms and Conditions</a>
          <a href="#">Cookie Policy</a>
          <a href="#">Privacy</a>
        </div>

        {/* Copyright */}
        <p className="copyright">© {currentYear} - DESTINY DIVE</p>
      </div>
    </footer>
  );
};

export default Footer;
