import React, { useState, useEffect } from 'react';
import { visionApi } from '../api/visionApi';
import toast from 'react-hot-toast';
import { FiTrash2, FiDownload, FiClock, FiActivity } from 'react-icons/fi';

const filterColors = {
  canny: 'primary',
  sobel: 'primary',
  laplacian: 'primary',
  contour: 'primary',
  histogram_eq: 'info',
  contrast_stretch: 'info',
  brightness_contrast: 'info',
  gaussian_blur: 'secondary',
  median_filter: 'secondary',
  document_scanner: 'warning',
  unsharp_mask: 'warning',
  auto_white_balance: 'warning',
};

const History = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await visionApi.getJobHistory();
      if (res.success) {
        setJobs(res.data);
      }
    } catch (err) {
      toast.error('Failed to load history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this processing record?')) return;
    try {
      const res = await visionApi.deleteJob(id);
      if (res.success) {
        toast.success('Record deleted');
        setJobs(jobs.filter(j => j.id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete record');
    }
  };

  const handleDownload = async (id, param) => {
    try {
      const blob = await visionApi.downloadImage(id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `visionx_${param}_${id.substring(0,8)}.jpg`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      toast.error('Download failed');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffMins < 1440) return `${Math.round(diffMins / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="container-fluid py-4 fadeSlideUp">
      <div className="d-flex justify-content-between align-items-end mb-4 border-bottom border-secondary pb-3">
        <div>
          <h2 className="display-font fw-bold mb-0">Processing History</h2>
          <p className="text-muted small mb-0">Last 20 processing jobs</p>
        </div>
        <button className="btn btn-outline-cyan btn-sm d-flex align-items-center gap-2" onClick={fetchJobs}>
          <FiActivity /> Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-cyan mb-3" role="status"></div>
          <div className="text-muted">Loading history records...</div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="card-dark p-5 text-center text-muted">
          <FiClock className="fs-1 mb-3 opacity-50 pulse-glow" />
          <h5>No history found</h5>
          <p className="small mb-0">Process some images to see them here.</p>
        </div>
      ) : (
        <div className="row g-4">
          {jobs.map(job => (
            <div key={job.id} className="col-12 col-md-6 col-xl-4">
              <div className="card-dark h-100 overflow-hidden d-flex flex-column">
                
                {/* Images Preview */}
                <div className="d-flex h-50 border-bottom border-secondary" style={{ backgroundColor: '#000', minHeight: '160px' }}>
                  <div className="w-50 position-relative border-end border-secondary">
                    <span className="position-absolute top-0 start-0 m-1 badge bg-dark opacity-75 small">Input</span>
                    <img src={job.original_image} alt="Original" className="w-100 h-100 object-fit-cover" />
                  </div>
                  <div className="w-50 position-relative">
                    <span className="position-absolute top-0 start-0 m-1 badge bg-dark text-cyan opacity-75 small">Output</span>
                    {job.processed_image ? (
                      <img src={job.processed_image} alt="Processed" className="w-100 h-100 object-fit-cover" />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center text-danger small bg-dark">
                        {job.status === 'error' ? 'Failed' : 'Processing...'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Details */}
                <div className="p-3 d-flex flex-column flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className={`badge bg-${filterColors[job.filter_type] || 'secondary'} bg-opacity-25 text-${filterColors[job.filter_type] || 'light'} border border-${filterColors[job.filter_type] || 'secondary'} px-2 py-1`}>
                      {job.filter_type}
                    </span>
                    <span className="text-muted small d-flex align-items-center gap-1">
                      <FiClock /> {formatTime(job.created_at)}
                    </span>
                  </div>
                  
                  <div className="small text-muted mb-3 font-monospace" style={{ fontSize: '0.75rem' }}>
                    ID: {job.id.substring(0, 13)}...
                  </div>

                  <div className="mt-auto d-flex gap-2">
                    <button 
                      className="btn btn-sm btn-outline-cyan flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                      onClick={() => handleDownload(job.id, job.filter_type)}
                      disabled={!job.processed_image}
                    >
                      <FiDownload /> Output
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger px-3 d-flex align-items-center justify-content-center"
                      onClick={() => handleDelete(job.id)}
                      title="Delete Record"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
