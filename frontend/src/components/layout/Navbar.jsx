import React from 'react';
import { Link } from 'react-router-dom';
import { FiMonitor } from 'react-icons/fi';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg header-dark px-4 py-3 sticky-top border-bottom border-secondary border-opacity-25">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center gap-3 text-white" to="/">
          <div className="p-2 bg-black rounded-circle shadow-lg border border-cyan border-opacity-25">
            <FiMonitor className="text-cyan fs-4" />
          </div>
          <span className="font-weight-bold display-font tracking-wide ls-1">VISION<span className="text-cyan text-glow">X</span></span>
        </Link>
        <div className="d-flex align-items-center">
          <span className="glass-panel text-uppercase py-2 px-4 rounded-pill border border-secondary border-opacity-50 small tracking-wider">AI Processing Engine v2.0</span>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html:`
        .ls-1 { letter-spacing: 0.1em; }
        .text-glow { text-shadow: 0 0 10px rgba(0, 229, 255, 0.5); }
      `}} />
    </nav>
  );
};

export default Navbar;
