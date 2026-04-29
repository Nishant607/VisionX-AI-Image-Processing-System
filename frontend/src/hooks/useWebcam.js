import { useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';

export const useWebcam = () => {
  const webcamRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [deviceList, setDeviceList] = useState([]);
  const [activeDeviceId, setActiveDeviceId] = useState(null);

  const startCamera = useCallback(() => {
    setIsCameraOn(true);
  }, []);

  const stopCamera = useCallback(() => {
    setIsCameraOn(false);
  }, []);

  const getDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(i => i.kind === 'videoinput');
      setDeviceList(videoDevices);
      if (videoDevices.length > 0 && !activeDeviceId) {
        setActiveDeviceId(videoDevices[0].deviceId);
      }
    } catch (err) {
      toast.error('Could not get media devices');
    }
  }, [activeDeviceId]);

  const switchDevice = useCallback((deviceId) => {
    setActiveDeviceId(deviceId);
  }, []);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      return imageSrc;
    }
    return null;
  }, []);
  
  // Convert base64 DataURI to File object
  const dataURIToFile = (dataURI, filename) => {
    const arr = dataURI.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return {
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
  };
};
