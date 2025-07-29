import React from "react";
import "../CSS/navbar.css";
const Navbar2 = () => {
  return (
    <>
      <div>
        <Link to="/" className="navbar-brand">
          <img
            src={logo}
            alt="Logo"
            style={{
              width: "20vw",
              height: "auto",
              maxWidth: "50px",
            }}
          />
        </Link>
      </div>
    </>
  );
};

export default Navbar2;
