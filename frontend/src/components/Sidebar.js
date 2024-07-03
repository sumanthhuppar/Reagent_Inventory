import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2
        style={{
          fontSize: "32px",
          color: "#7ed957", // Lighter shade of green
        }}
      >
        ReAgent <span> </span>
        <span
          style={{
            color: "orange",
            animation: "glow 1s infinite",
            fontSize: "36px", // Increase text size
            fontWeight: "bold", // Make text bold
            borderRadius: "50%", // Make text rounded
            padding: "5px", // Add padding for roundness
          }}
        >
          .
        </span>
      </h2>
      <NavLink to="/" activeClassName="active">
        <i className="fas fa-list"></i> REAGENTS LIST
      </NavLink>
      <NavLink to="/add" activeClassName="active">
        <i className="fas fa-plus"></i> ADD REAGENTS
      </NavLink>
    
      <NavLink to="/stock" activeClassName="active">
        <i className="fas fa-boxes"></i> STOCK CARE
      </NavLink>
      <style>
        {`
        @keyframes glow {
          0% {
            text-shadow: 0 0 15px rgba(255, 165, 0, 1);
          }
          50% {
            text-shadow: 0 0 15px rgba(255, 165, 0, 1);
          }
        }
        `}
      </style>
    </div>
  );
}

export default Sidebar;
