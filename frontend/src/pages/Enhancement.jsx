import React, { useState } from 'react';
import DropZone from '../components/upload/DropZone';
import WebcamCapture from '../components/webcam/WebcamCapture';
import ControlPanel from '../components/controls/ControlPanel';
import ResultViewer from '../components/output/ResultViewer';
import HistogramChart from '../components/histogram/HistogramChart';
import { useImageProcessor } from '../hooks/useImageProcessor';
import { useHistogram } from '../hooks/useHistogram';

const Enhancement = () => {
  const [inputType, setInputType] = useState('upload');

  const {
    jobId, originalUrl, processedUrl,
    isUploading, uploadProgress, isProcessing,
    upload, process, reset, download
  } = useImageProcessor();

  const { originalHist, processedHist } = useHistogram(jobId);

  const handleCaptureFile = (file) => {
    upload(file);
  };

  return (
    <div className="container-fluid h-100 d-flex flex-column fadeSlideUp">
      <div className="row mb-3 flex-shrink-0">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <div>
            <h2 className="display-font fw-bold mb-0 text-violet">Enhancement Toolkit</h2>
            <p className="text-muted small">Histogram equalization, contrast stretching, and smoothing algorithms.</p>
          </div>
          
          {!originalUrl && (
            <div className="btn-group">
              <button 
                className={`btn btn-sm ${inputType === 'upload' ? 'btn-cyan' : 'btn-outline-secondary'}`}
                onClick={() => setInputType('upload')}
              >Upload</button>
              <button 
                className={`btn btn-sm ${inputType === 'webcam' ? 'btn-cyan' : 'btn-outline-secondary'}`}
                onClick={() => setInputType('webcam')}
              >Webcam</button>
            </div>
          )}
        </div>
      </div>

      <div className="row flex-grow-1 g-4 pb-4">
        <div className="col-lg-3 d-flex flex-column gap-4">
          {!originalUrl ? (
            inputType === 'upload' ? (
              <DropZone 
                onFileSelect={upload} 
                isUploading={isUploading} 
                progress={uploadProgress} 
              />
            ) : (
              <div style={{ height: '350px' }}>
                <WebcamCapture onCaptureFile={handleCaptureFile} />
              </div>
            )
          ) : (
            <div className="card-dark p-3 text-center">
              <div className="mb-2 text-success small fw-bold">Image Loaded Successfully</div>
              <button className="btn btn-sm btn-outline-secondary w-100" onClick={reset}>
                Upload New Image
              </button>
            </div>
          )}

          <div className="flex-grow-1">
            <ControlPanel 
              onApply={process}
              onDownload={download}
              onReset={reset}
              isProcessing={isProcessing}
              hasImage={!!originalUrl}
              hasProcessed={!!processedUrl}
              category="enhance" // For now mapped to enhance, might want to include smoothing too if we combined them
            />
          </div>
        </div>

        <div className="col-lg-6 d-flex flex-column">
          <ResultViewer 
            originalUrl={originalUrl}
            processedUrl={processedUrl}
            isProcessing={isProcessing}
          />
        </div>

        <div className="col-lg-3 d-flex flex-column gap-4">
          <div className="card-dark p-3 flex-grow-1" style={{ minHeight: '250px' }}>
            <HistogramChart data={originalHist} title="Original Histogram" />
          </div>
          <div className="card-dark p-3 flex-grow-1" style={{ minHeight: '250px' }}>
            <HistogramChart data={processedHist} title="Processed Histogram" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enhancement;
