import React, { useState, useEffect } from 'react';
import FilterSelector from './FilterSelector';
import { FiZap, FiDownload, FiRotateCcw, FiImage, FiSliders } from 'react-icons/fi';

const ControlPanel = ({ 
  onApply, 
  onDownload, 
  onReset,
  isProcessing, 
  hasImage, 
  hasProcessed,
  category = null 
}) => {
  const [filterType, setFilterType] = useState('');
  const [params, setParams] = useState({});

  // Reset params when filter type changes
  useEffect(() => {
    setParams(getDefaultParams(filterType));
  }, [filterType]);

  const getDefaultParams = (type) => {
    switch(type) {
      case 'canny': return { threshold1: 100, threshold2: 200 };
      case 'sobel': return { direction: 'combined', ksize: 3 };
      case 'gaussian_blur':
      case 'median_filter': return { ksize: 5 };
      case 'brightness_contrast': return { brightness: 0, contrast: 1.0 };
      case 'unsharp_mask': return { strength: 1.5 };
      case 'contrast_stretch': return { strength: 50 };
      case 'histogram_eq': return { clip_limit: 2.0 };
      default: return {};
    }
  };

  const handleParamChange = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    if (!filterType) return;
    onApply(filterType, params);
  };

  return (
    <div className="card-dark p-3 fadeSlideUp h-100 d-flex flex-column border-opacity-10">
      <h5 className="mb-4 d-flex align-items-center gap-3 px-1">
        <div className="p-2 glass-panel border-cyan border-opacity-25 rounded shadow-cyan-sm">
          <FiSliders className="text-cyan d-flex" /> 
        </div>
        <span className="fw-bold tracking-tight">NEURAL CONTROLS</span>
      </h5>

      <div className="mb-4">
        <FilterSelector 
          value={filterType} 
          onChange={setFilterType} 
          category={category} 
        />
      </div>

      <div className="flex-grow-1 overflow-auto pe-2 border-top border-secondary border-opacity-25 pt-3 mt-1">
        {/* Dynamic Controls based on selected filter */}
        {!filterType && (
          <div className="text-center py-5 text-bright">
            <FiZap className="fs-1 mb-3 text-cyan opacity-75" />
            <div className="fw-bold">Select a filter to view parameters</div>
          </div>
        )}

        {filterType === 'canny' && (
          <div className="fadeSlideUp">
            <div className="mb-3">
              <label className="form-label d-flex justify-content-between small text-bright fw-bold">
                <span>Threshold 1</span>
                <span className="text-cyan font-monospace">{params.threshold1}</span>
              </label>
              <input type="range" className="form-range" min="0" max="255" 
                value={params.threshold1 || 100} 
                onChange={(e) => handleParamChange('threshold1', parseInt(e.target.value))} />
            </div>
            <div className="mb-3">
              <label className="form-label d-flex justify-content-between small text-bright fw-bold">
                <span>Threshold 2</span>
                <span className="text-cyan font-monospace">{params.threshold2}</span>
              </label>
              <input type="range" className="form-range" min="0" max="255" 
                value={params.threshold2 || 200} 
                onChange={(e) => handleParamChange('threshold2', parseInt(e.target.value))} />
            </div>
          </div>
        )}

        {filterType === 'sobel' && (
          <div className="fadeSlideUp">
            <div className="mb-3">
              <label className="form-label small text-muted">Direction</label>
              <select className="form-select form-select-dark" 
                value={params.direction || 'combined'} 
                onChange={(e) => handleParamChange('direction', e.target.value)}>
                <option value="combined">Combined Magnitude</option>
                <option value="x">X Axis (Vertical Edges)</option>
                <option value="y">Y Axis (Horizontal Edges)</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label small text-muted">Kernel Size</label>
              <select className="form-select form-select-dark" 
                value={params.ksize || 3} 
                onChange={(e) => handleParamChange('ksize', parseInt(e.target.value))}>
                <option value={3}>3x3</option>
                <option value={5}>5x5</option>
                <option value={7}>7x7</option>
              </select>
            </div>
          </div>
        )}

        {(filterType === 'gaussian_blur' || filterType === 'median_filter') && (
          <div className="fadeSlideUp mb-3">
            <label className="form-label d-flex justify-content-between small text-bright fw-bold">
              <span>Kernel Size</span>
              <span className="text-cyan font-monospace">{params.ksize || 5}x{params.ksize || 5}</span>
            </label>
            <input type="range" className="form-range" min="3" max="31" step="2"
              value={params.ksize || 5} 
              onChange={(e) => handleParamChange('ksize', parseInt(e.target.value))} />
          </div>
        )}

        {filterType === 'brightness_contrast' && (
          <div className="fadeSlideUp">
            <div className="mb-3">
              <label className="form-label d-flex justify-content-between small text-bright fw-bold">
                <span>Brightness</span>
                <span className="text-cyan font-monospace">{params.brightness}</span>
              </label>
              <input type="range" className="form-range" min="-100" max="100" 
                value={params.brightness || 0} 
                onChange={(e) => handleParamChange('brightness', parseInt(e.target.value))} />
            </div>
            <div className="mb-3">
              <label className="form-label d-flex justify-content-between small text-bright fw-bold">
                <span>Contrast (Multiplier)</span>
                <span className="text-cyan font-monospace">{params.contrast}x</span>
              </label>
              <input type="range" className="form-range" min="0.1" max="3.0" step="0.1"
                value={params.contrast || 1.0} 
                onChange={(e) => handleParamChange('contrast', parseFloat(e.target.value))} />
            </div>
          </div>
        )}
        
        {filterType === 'unsharp_mask' && (
          <div className="fadeSlideUp mb-3">
            <label className="form-label d-flex justify-content-between small text-bright fw-bold">
              <span>Strength</span>
              <span className="text-cyan font-monospace">{params.strength}</span>
            </label>
            <input type="range" className="form-range" min="0.1" max="5.0" step="0.1"
              value={params.strength || 1.5} 
              onChange={(e) => handleParamChange('strength', parseFloat(e.target.value))} />
          </div>
        )}

        {filterType === 'contrast_stretch' && (
          <div className="fadeSlideUp mb-3">
            <label className="form-label d-flex justify-content-between small text-bright fw-bold">
              <span>Intensity</span>
              <span className="text-cyan font-monospace">{params.strength !== undefined ? params.strength : 50}%</span>
            </label>
            <input type="range" className="form-range" min="0" max="100" step="5"
              value={params.strength !== undefined ? params.strength : 50} 
              onChange={(e) => handleParamChange('strength', parseInt(e.target.value))} />
          </div>
        )}

        {filterType === 'histogram_eq' && (
          <div className="fadeSlideUp mb-3">
            <label className="form-label d-flex justify-content-between small text-bright fw-bold">
              <span>Clip Ceiling</span>
              <span className="text-cyan font-monospace">{params.clip_limit !== undefined ? params.clip_limit : 2.0}</span>
            </label>
            <input type="range" className="form-range" min="0.1" max="10.0" step="0.1"
              value={params.clip_limit !== undefined ? params.clip_limit : 2.0} 
              onChange={(e) => handleParamChange('clip_limit', parseFloat(e.target.value))} />
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html:`
        .shadow-cyan-sm { box-shadow: 0 0 15px rgba(0, 229, 255, 0.15); }
        .tracking-tight { letter-spacing: -0.5px; }
      `}} />

      <div className="mt-4 pt-3 border-top border-secondary d-grid gap-2">
        <button 
          className="btn btn-cyan d-flex align-items-center justify-content-center gap-2 py-2 text-wrap"
          style={{ fontSize: '0.9rem' }}
          onClick={handleApply}
          disabled={!hasImage || !filterType || isProcessing}
        >
          <FiZap /> {isProcessing ? 'Processing Engine...' : 'Apply AI Filter'}
        </button>
        
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-cyan flex-grow-1 d-flex align-items-center justify-content-center gap-2 text-wrap"
            style={{ fontSize: '0.9rem' }}
            onClick={onDownload}
            disabled={!hasProcessed}
          >
            <FiDownload /> Download
          </button>
          
          <button 
            className="btn btn-outline-light-custom d-flex align-items-center justify-content-center gap-2"
            onClick={() => { setFilterType(''); onReset(); }}
            title="Reset Image"
            disabled={!hasImage}
          >
            <FiRotateCcw className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
