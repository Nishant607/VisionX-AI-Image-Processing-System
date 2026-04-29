import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useWebcam } from '../../hooks/useWebcam';
import { FiCamera, FiVideoOff, FiRefreshCcw, FiUploadCloud } from 'react-icons/fi';

const WebcamCapture = ({ onCaptureFile }) => {
  const {
    webcamRef,
    isCameraOn,
    deviceList,
    activeDeviceId,
    startCamera,
    stopCamera,
    getDevices,
    switchDevice,
    capture,
    dataURIToFile
  } = useWebcam();

  const [simulatedEdge, setSimulatedEdge] = useState(false);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);

  useEffect(() => {
    getDevices();
  }, [getDevices]);

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // Simple client-side edge detection simulation for preview
  const simulateLiveEdges = () => {
    if (!webcamRef.current || !canvasRef.current || !simulatedEdge) return;
    
    const video = webcamRef.current.video;
    const canvas = canvasRef.current;
    
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      // Draw frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get pixels
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const length = frame.data.length;
      const data = frame.data;
      
      // Very basic edge detection simulation (difference between adjacent pixels)
      for (let i = 0; i < length; i += 4) {
        if (i + 4 < length) {
          const diff = Math.abs(data[i] - data[i+4]) + 
                       Math.abs(data[i+1] - data[i+5]) + 
                       Math.abs(data[i+2] - data[i+6]);
                       
          const val = diff > 50 ? 255 : 0;
          data[i] = val; // R
          data[i+1] = val; // G
          data[i+2] = val; // B
        }
      }
      ctx.putImageData(frame, 0, 0);
    }
    
    requestRef.current = requestAnimationFrame(simulateLiveEdges);
  };

  useEffect(() => {
    if (simulatedEdge && isCameraOn) {
      requestRef.current = requestAnimationFrame(simulateLiveEdges);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [simulatedEdge, isCameraOn]);

  const handleCapture = () => {
    const dataUri = capture();
    if (dataUri) {
      const file = dataURIToFile(dataUri, `webcam_capture_${Date.now()}.jpg`);
      onCaptureFile(file);
    }
  };

  return (
    <div className="card-dark p-3 h-100 d-flex flex-column fadeSlideUp">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0 d-flex align-items-center gap-2">
          <FiCamera className="text-cyan" /> Live Capture
        </h6>
        
        <div className="d-flex gap-2">
          {deviceList.length > 1 && (
            <select 
              className="form-select form-select-sm form-select-dark w-auto"
              value={activeDeviceId || ''}
              onChange={(e) => switchDevice(e.target.value)}
              disabled={!isCameraOn}
            >
              {deviceList.map((device, idx) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${idx + 1}`}
                </option>
              ))}
            </select>
          )}

          <div className="form-check form-switch pt-1 ms-2">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="liveEdgeToggle"
              checked={simulatedEdge}
              onChange={() => setSimulatedEdge(!simulatedEdge)}
              disabled={!isCameraOn}
            />
            <label className="form-check-label small text-muted" htmlFor="liveEdgeToggle">
              Preview Edges
            </label>
          </div>
        </div>
      </div>

      <div className="flex-grow-1 position-relative bg-black rounded overflow-hidden d-flex align-items-center justify-content-center border border-secondary border-opacity-50">
        {!isCameraOn ? (
          <div className="text-center text-muted">
            <FiVideoOff className="fs-1 mb-2 opacity-50" />
            <div className="small">Camera is off</div>
          </div>
        ) : (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ deviceId: activeDeviceId }}
              className="w-100 h-100 object-fit-cover position-absolute"
            />
            <canvas 
              ref={canvasRef} 
              className="position-absolute w-100 h-100 object-fit-cover z-2"
              style={{ opacity: simulatedEdge ? 1 : 0, transition: 'opacity 0.3s' }}
            />
          </>
        )}
      </div>

      <div className="mt-3 d-flex gap-2">
        <button 
          className={`btn flex-grow-1 ${isCameraOn ? 'btn-outline-danger' : 'btn-outline-cyan'}`}
          onClick={isCameraOn ? stopCamera : startCamera}
        >
          {isCameraOn ? <><FiVideoOff className="me-2" /> Stop</> : <><FiCamera className="me-2" /> Start Camera</>}
        </button>
        
        <button 
          className="btn btn-cyan flex-grow-1"
          onClick={handleCapture}
          disabled={!isCameraOn}
        >
          <FiUploadCloud className="me-2" /> Capture & Process
        </button>
      </div>
    </div>
  );
};

export default WebcamCapture;
