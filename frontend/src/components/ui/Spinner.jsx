import React from 'react';

const Spinner = ({ text = "Processing..." }) => {
  return (
    <div className="processing-overlay">
      <div className="position-relative overflow-hidden rounded mb-3" style={{ width: '120px', height: '4px', background: 'rgba(255,255,255,0.1)' }}>
        <div className="scan-line"></div>
      </div>
      <div className="text-cyan font-monospace small pulse-glow">{text}</div>
    </div>
  );
};

export default Spinner;
