import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiMaximize, FiSliders, FiClock, FiCamera } from 'react-icons/fi';

const Sidebar = () => {
  const links = [
    { to: '/', icon: <FiHome />, label: 'Dashboard' },
    { to: '/edge', icon: <FiMaximize />, label: 'Edge Detection' },
    { to: '/enhance', icon: <FiSliders />, label: 'Enhancement' },
    { to: '/scanner', icon: <FiCamera />, label: 'Doc Scanner' },
    { to: '/history', icon: <FiClock />, label: 'History' },
  ];

  return (
    <aside className="sidebar-dark d-none d-md-flex flex-column p-4 h-100 border-end border-secondary border-opacity-10">
      <div className="mb-4 text-light text-uppercase small fw-bold px-3 pt-2 tracking-widest opacity-50">
        Engine Modules
      </div>
      <nav className="nav flex-column gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-link-custom text-decoration-none ${isActive ? 'active' : ''}`}
          >
            <span className="fs-5 d-flex">{link.icon}</span>
            <span className="fw-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="mt-auto px-3 py-4 text-center">
        <div className="small text-muted mb-2">Developed by AI Systems Architect</div>
      </div>
    </aside>
  );
};

export default Sidebar;
