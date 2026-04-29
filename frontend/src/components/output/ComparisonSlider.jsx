import React, { useState, useRef, useEffect } from 'react';

const ComparisonSlider = ({ leftImage, rightImage }) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef(null);

  const handleMove = (e) => {
    if (!containerRef.current) return;
    
    let clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const x = clientX - left;
    const pos = Math.max(0, Math.min(100, (x / width) * 100));
    setPosition(pos);
  };

  const startDrag = () => {
    document.addEventListener('mousemove', handleGlobalMove);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchmove', handleGlobalMove, { passive: false });
    document.addEventListener('touchend', endDrag);
  };

  const handleGlobalMove = (e) => { 
    if (e.type === 'touchmove') e.preventDefault(); // prevent scrolling while sliding
    handleMove(e); 
  };

  const endDrag = () => {
    document.removeEventListener('mousemove', handleGlobalMove);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchmove', handleGlobalMove);
    document.removeEventListener('touchend', endDrag);
  };
  
  useEffect(() => {
    return () => endDrag();
  }, []);

  if (!leftImage || !rightImage) return null;

  return (
    <div 
      className="comparison-container w-100 h-100 position-relative bg-black rounded overflow-hidden" 
      style={{ minHeight: '500px', cursor: 'ew-resize' }}
      ref={containerRef}
      onMouseDown={handleMove}
      onTouchStart={handleMove}
    >
      {/* Background (Right/Processed Image) */}
      <img src={rightImage} alt="Processed" className="position-absolute top-0 start-0 w-100 h-100 object-fit-contain p-2 pointer-events-none" />
      
      {/* Foreground (Left/Original Image) using clip-path */}
      <img 
        src={leftImage} 
        alt="Original" 
        className="position-absolute top-0 start-0 w-100 h-100 object-fit-contain p-2 pointer-events-none" 
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      />

      {/* Slider Line & Handle */}
      <div 
        className="position-absolute top-0 bottom-0 d-flex justify-content-center pointer-events-none z-1"
        style={{ left: `${position}%`, width: '2px', backgroundColor: 'var(--accent-cyan)', transform: 'translateX(-50%)' }}
      >
        <div 
          className="position-absolute top-50 translate-middle d-flex align-items-center justify-content-center rounded-circle bg-dark border pointer-events-auto"
          style={{ width: '40px', height: '40px', borderColor: 'var(--accent-cyan)', cursor: 'ew-resize' }}
          onMouseDown={(e) => { e.stopPropagation(); startDrag(); }}
          onTouchStart={(e) => { e.stopPropagation(); startDrag(); }}
        >
          <div className="d-flex text-cyan opacity-75 gap-1 fw-bold">
             <span>&lt;</span><span>&gt;</span>
          </div>
        </div>
      </div>
      
      {/* Labels */}
      <div className="position-absolute bottom-0 start-0 m-3 z-2">
        <span className="badge bg-dark bg-opacity-75 text-white font-monospace px-2 py-1">ORIGINAL</span>
      </div>
      <div className="position-absolute bottom-0 end-0 m-3 z-2">
        <span className="badge bg-dark bg-opacity-75 text-cyan font-monospace px-2 py-1">PROCESSED</span>
      </div>
    </div>
  );
};

export default ComparisonSlider;
