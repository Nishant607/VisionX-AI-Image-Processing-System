import React, { useState } from 'react';
import ComparisonSlider from './ComparisonSlider';
import Spinner from '../ui/Spinner';
import { FiImage } from 'react-icons/fi';

const ResultViewer = ({ originalUrl, processedUrl, isProcessing }) => {
  const [viewMode, setViewMode] = useState('split'); // split, slider, processedOnly

  if (!originalUrl && !processedUrl) {
    return (
      <div className="card-dark w-100 h-100 d-flex flex-column align-items-center justify-content-center text-muted" style={{ minHeight: '400px' }}>
        <FiImage className="fs-1 mb-3 opacity-50 pulse-glow" />
        <p className="mb-0">Awaiting image input...</p>
      </div>
    );
  }

  return (
    <div className="card-dark w-100 h-100 d-flex flex-column fadeSlideUp overflow-hidden position-relative border-opacity-25">
      
      {/* Tab bar */}
      <div className="border-bottom border-secondary border-opacity-25 d-flex bg-black bg-opacity-30">
        <button 
          className={`btn btn-link shadow-none rounded-0 px-4 py-3 text-decoration-none border-bottom border-3 fw-bold small transition-all ${viewMode === 'split' ? 'text-white' : 'text-muted'}`}
          onClick={() => setViewMode('split')}
          style={{ borderColor: viewMode === 'split' ? 'var(--accent-cyan)' : 'transparent', background: viewMode === 'split' ? 'rgba(0, 229, 255, 0.05)' : 'transparent' }}
        >
          Split Preview
        </button>
        <button 
          className={`btn btn-link shadow-none rounded-0 px-4 py-3 text-decoration-none border-bottom border-3 fw-bold small transition-all ${viewMode === 'slider' ? 'text-white' : 'text-muted'}`}
          onClick={() => setViewMode('slider')}
          disabled={!processedUrl}
          style={{ borderColor: viewMode === 'slider' ? 'var(--accent-cyan)' : 'transparent', background: viewMode === 'slider' ? 'rgba(0, 229, 255, 0.05)' : 'transparent' }}
        >
          Comparison Slider
        </button>
        <button 
          className={`btn btn-link shadow-none rounded-0 px-4 py-3 text-decoration-none border-bottom border-3 fw-bold small transition-all ${viewMode === 'processedOnly' ? 'text-white' : 'text-muted'}`}
          onClick={() => setViewMode('processedOnly')}
          disabled={!processedUrl}
          style={{ borderColor: viewMode === 'processedOnly' ? 'var(--accent-cyan)' : 'transparent', background: viewMode === 'processedOnly' ? 'rgba(0, 229, 255, 0.05)' : 'transparent' }}
        >
          Result Output
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-grow-1 position-relative bg-black d-flex align-items-center justify-content-center overflow-hidden sci-grid" style={{ minHeight: '500px' }}>
        
        {isProcessing && (
          <div className="z-3">
            <Spinner text="Neural Core Processing..." />
          </div>
        )}

        {!originalUrl && !isProcessing && (
          <div className="text-center text-bright">
            <FiImage className="fs-1 mb-3 text-cyan opacity-75" />
            <h4 className="fw-bold">Awaiting Neural Input...</h4>
            <p className="text-soft small">Upload an image to begin processing</p>
          </div>
        )}
        
        {!isProcessing && viewMode === 'split' && (
          <div className="row g-0 w-100 h-100">
            <div className={`col-12 h-100 border-end border-secondary border-opacity-10 ${processedUrl ? 'col-md-6' : 'col-md-12'}`}>
              <div className="position-absolute p-2 m-3 glass-panel border-secondary text-white small z-1 font-monospace tracking-widest px-3">INPUT_RAW</div>
              <img src={originalUrl} alt="Original" className="w-100 h-100 object-fit-contain p-4" />
            </div>
            {processedUrl && (
              <div className="col-12 col-md-6 h-100 position-relative">
                <div className="position-absolute p-2 m-3 glass-panel border-cyan text-cyan small z-1 font-monospace tracking-widest px-3">OUTPUT_INF</div>
                <img src={processedUrl} alt="Processed" className="w-100 h-100 object-fit-contain p-4 fadeSlideUp" />
              </div>
            )}
          </div>
        )}

        {!isProcessing && viewMode === 'slider' && processedUrl && (
          <ComparisonSlider leftImage={originalUrl} rightImage={processedUrl} />
        )}

        {!isProcessing && viewMode === 'processedOnly' && processedUrl && (
          <div className="w-100 h-100 position-relative fadeSlideUp">
            <div className="position-absolute p-2 m-3 glass-panel border-cyan text-cyan small z-1 font-monospace tracking-widest px-3">FINAL_RESULT_EXPORT</div>
            <img src={processedUrl} alt="Processed" className="w-100 h-100 object-fit-contain p-4" />
          </div>
        )}

        <style dangerouslySetInnerHTML={{__html:`
          .sci-grid {
            background-image: 
              linear-gradient(rgba(0, 229, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px);
            background-size: 30px 30px;
          }
        `}} />
      </div>
    </div>
  );
};

export default ResultViewer;
