// components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Reagent Inventory</h2>
      <NavLink to="/" activeClassName="active">
        <i className="fas fa-list"></i> Reagent List
      </NavLink>
      <NavLink to="/add" activeClassName="active">
        <i className="fas fa-plus"></i> Add Reagent
      </NavLink>
      <NavLink to="/expiring" activeClassName="active">
        <i className="fas fa-exclamation-triangle"></i> Expiring Soon
      </NavLink>
      <NavLink to="/stock" activeClassName="active">
        <i className="fas fa-boxes"></i> Stock Maintenance
      </NavLink>
      
    </div>
  );
}

export default Sidebar;