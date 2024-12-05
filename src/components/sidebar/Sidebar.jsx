import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink for navigation
import './Sidebar.scss';
import logo from '../../assets/logo.png'; 
import { FaHome, FaChartLine, FaCog, FaRegQuestionCircle, FaClipboard, FaUserCircle } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <img src={logo} alt="Logo" className="navbar__logo" />
        <h2>InjeX Pro</h2>
      </div>
      <ul className="sidebar__menu">
        <li>
          <NavLink to="/dashboard" activeClassName="active" className="menu-item">
            <FaHome className="icon" />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/analytics" activeClassName="active" className="menu-item">
            <FaChartLine className="icon" />
            <span>Analytics</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/reports" activeClassName="active" className="menu-item">
            <FaClipboard className="icon" />
            <span>Reports</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" activeClassName="active" className="menu-item">
            <FaCog className="icon" />
            <span>Settings</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/help" activeClassName="active" className="menu-item">
            <FaRegQuestionCircle className="icon" />
            <span>Help</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
