import React from 'react';
import { Link } from 'react-router-dom';
import { FiMaximize, FiSliders, FiCamera, FiClock, FiCheckCircle } from 'react-icons/fi';

const Home = () => {
  const features = [
    { 
      to: '/edge', 
      icon: <FiMaximize className="fs-1 text-cyan mb-3" />, 
      title: 'Edge Detection', 
      desc: 'Canny, Sobel, Laplacian, and Contour detection algorithms.' 
    },
    { 
      to: '/enhance', 
      icon: <FiSliders className="fs-1 text-violet mb-3" />, 
      title: 'Enhancement Kit', 
      desc: 'Histogram equalization, contrast stretching, and smoothing utilities.' 
    },
    { 
      to: '/scanner', 
      icon: <FiCamera className="fs-1 text-primary mb-3" />, 
      title: 'Document Scanner', 
      desc: 'Perspective correction, adaptive thresholding, and unsharp masking.' 
    },
    { 
      to: '/history', 
      icon: <FiClock className="fs-1 text-success mb-3" />, 
      title: 'Processing History', 
      desc: 'View, compare, and download past processed image jobs.' 
    }
  ];

  const highlights = [
    "Enterprise-grade Django Backend",
    "Real-time OpenCV Processing Engine",
    "React 18 + Vite SPA",
    "Chart.js Histogram Visualization",
    "Perspective Transform Document Scanner",
    "Live Webcam Inference Simulator"
  ];

  return (
    <div className="container-fluid py-4 fadeSlideUp">
      <div className="row mb-5">
        <div className="col-lg-8 mx-auto text-center mt-4">
          <h1 className="display-3 fw-bold mb-4 tracking-tight">
            Vision<span className="text-cyan">X</span> 
            <span className="ms-2 badge bg-cyan text-dark fs-6 align-middle px-3">ULTIMATE</span>
          </h1>
          <p className="lead text-muted mb-5 fs-4">
             AI-Powered Neural Processing Engine for Advanced Computer Vision.
          </p>
          
          <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
            {highlights.map((h, i) => (
              <span key={i} className="glass-panel border-secondary px-3 py-2 d-flex align-items-center gap-2 small fadeSlideUp" style={{ animationDelay: `${i * 0.1}s` }}>
                <FiCheckCircle className="text-cyan" /> {h}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="row g-4 px-3">
        {features.map((feature, idx) => (
          <div key={idx} className="col-md-6 col-lg-3">
            <Link to={feature.to} className="text-decoration-none h-100 d-block">
              <div 
                className="card-dark p-4 h-100 text-center text-white text-decoration-none transition-transform pulse-glow-hover fadeSlideUp d-flex flex-column align-items-center justify-content-center"
                style={{ animationDelay: `${0.4 + (idx * 0.1)}s` }}
              >
                <div className="feature-icon-wrapper mb-3">
                  {feature.icon}
                </div>
                <h4 className="fw-bold mb-2">{feature.title}</h4>
                <p className="text-light opacity-75 mb-0" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                  {feature.desc}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      <style dangerouslySetInnerHTML={{__html:`
        .feature-icon-wrapper svg {
          filter: drop-shadow(0 0 8px rgba(0, 229, 255, 0.3));
          font-size: 2.8rem !important;
        }
        .tracking-tight { letter-spacing: -2px; }
        .pulse-glow-hover:hover { 
          box-shadow: 0 0 30px rgba(0, 229, 255, 0.2); 
          border-color: var(--accent-cyan);
          background: rgba(255, 255, 255, 0.05);
        }
      `}} />
    </div>
  );
};

export default Home;
