import React, { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiFile, FiAlertCircle } from 'react-icons/fi';

const DropZone = ({ onFileSelect, isUploading, progress }) => {
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles?.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    acceptedFiles,
    fileRejections
  } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'image/bmp': []
    },
    maxSize: 20 * 1024 * 1024, // 20MB
    multiple: false
  });

  const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px',
    borderWidth: 2,
    borderRadius: '12px',
    borderColor: 'var(--border)',
    borderStyle: 'dashed',
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-muted)',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    cursor: 'pointer'
  };

  const activeStyle = {
    borderColor: 'var(--accent-cyan)',
    backgroundColor: 'rgba(0, 212, 255, 0.05)'
  };

  const acceptStyle = {
    borderColor: 'var(--accent-green)'
  };

  const rejectStyle = {
    borderColor: '#ef4444'
  };

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragActive && !isDragReject ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [isDragActive, isDragReject]);

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-100">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <div className="text-center">
          {isDragReject ? (
            <FiAlertCircle className="fs-1 text-danger mb-3 pulse-glow" />
          ) : (
            <FiUploadCloud className={`fs-1 mb-3 ${isDragActive ? 'text-cyan pulse-glow' : ''}`} />
          )}
          
          <h5 className="text-white mb-2">
            {isDragActive ? "Drop the image here ..." : "Drag & drop an image here"}
          </h5>
          <p className="small mb-0">or click to browse from your computer</p>
          <div className="mt-3 small" style={{ color: 'var(--border-color)' }}>
            Supports: JPG, PNG, WEBP, BMP (Max: 20MB)
          </div>
        </div>
      </div>

      {fileRejections.length > 0 && (
        <div className="mt-3 text-danger small d-flex align-items-center gap-2">
          <FiAlertCircle />
          <span>{fileRejections[0].errors[0].message}</span>
        </div>
      )}

      {acceptedFiles.length > 0 && !isUploading && (
        <div className="mt-3 p-3 card-dark rounded d-flex align-items-center justify-content-between fadeSlideUp">
          <div className="d-flex align-items-center gap-3">
            <FiFile className="fs-4 text-cyan" />
            <div>
              <div className="text-white small fw-bold text-truncate" style={{ maxWidth: '200px' }}>
                {acceptedFiles[0].name}
              </div>
              <div className="small text-muted">{formatSize(acceptedFiles[0].size)}</div>
            </div>
          </div>
          <span className="badge bg-success bg-opacity-25 text-success border border-success">Ready</span>
        </div>
      )}

      {isUploading && (
        <div className="mt-4">
          <div className="d-flex justify-content-between mb-1 small text-cyan">
            <span>Uploading array...</span>
            <span>{progress}%</span>
          </div>
          <div className="progress" style={{ height: '6px', backgroundColor: 'var(--bg-secondary)' }}>
            <div 
              className="progress-bar progress-bar-striped progress-bar-animated bg-cyan" 
              role="progressbar" 
              style={{ width: `${progress}%`, backgroundColor: 'var(--accent-cyan)' }} 
              aria-valuenow={progress} 
              aria-valuemin="0" 
              aria-valuemax="100"
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropZone;
