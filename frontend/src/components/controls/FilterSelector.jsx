import React from 'react';

export const filterGroups = {
  edge: {
    label: 'Edge Details',
    filters: [
      { id: 'canny', name: 'Canny Edge' },
      { id: 'sobel', name: 'Sobel Filter' },
      { id: 'laplacian', name: 'Laplacian' },
      { id: 'contour', name: 'Contours' },
    ]
  },
  enhance: {
    label: 'Enhancements',
    filters: [
      { id: 'histogram_eq', name: 'Smart Equalize' },
      { id: 'contrast_stretch', name: 'Auto Contrast' },
      { id: 'brightness_contrast', name: 'Bright & Contrast' },
    ]
  },
  smooth: {
    label: 'Smoothing',
    filters: [
      { id: 'gaussian_blur', name: 'Gaussian Blur' },
      { id: 'median_filter', name: 'Median Filter' },
    ]
  },
  advanced: {
    label: 'Advanced',
    filters: [
      { id: 'document_scanner', name: 'Doc Scanner' },
      { id: 'unsharp_mask', name: 'Sharpen Filter' },
      { id: 'auto_white_balance', name: 'Auto Color' },
    ]
  }
};

const FilterSelector = ({ value, onChange, category = null }) => {
  return (
    <div className="mb-4">
      <label className="form-label text-bright small fw-bold text-uppercase tracking-wider">Select Filter Mode</label>
      <select 
        className="form-select form-select-dark py-2 border-secondary border-opacity-50 text-truncate text-white fw-bold" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        title={value ? filterGroups[category ? category : Object.keys(filterGroups).find(k => filterGroups[k].filters.some(f => f.id === value))]?.filters.find(f => f.id === value)?.name : "Select an option..."}
      >
        <option value="" disabled className="bg-dark text-white">Select filter...</option>
        
        {category ? (
          // Show only specific category if provided
          <optgroup label={filterGroups[category].label}>
            {filterGroups[category].filters.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </optgroup>
        ) : (
          // Show all categories
          Object.values(filterGroups).map(group => (
            <optgroup key={group.label} label={group.label}>
              {group.filters.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </optgroup>
          ))
        )}
      </select>
    </div>
  );
};

export default FilterSelector;
