import { useState, useEffect, useCallback } from 'react';
import { visionApi } from '../api/visionApi';

export const useHistogram = (jobId) => {
  const [originalHist, setOriginalHist] = useState(null);
  const [processedHist, setProcessedHist] = useState(null);
  const [isLoadingOriginal, setIsLoadingOriginal] = useState(false);
  const [isLoadingProcessed, setIsLoadingProcessed] = useState(false);

  const fetchOriginal = useCallback(async () => {
    if (!jobId) return;
    setIsLoadingOriginal(true);
    try {
      const res = await visionApi.getHistogram(jobId, 'original');
      if (res.success) {
        setOriginalHist(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch original histogram', err);
    } finally {
      setIsLoadingOriginal(false);
    }
  }, [jobId]);

  const fetchProcessed = useCallback(async () => {
    if (!jobId) return;
    setIsLoadingProcessed(true);
    try {
      const res = await visionApi.getHistogram(jobId, 'processed');
      if (res.success) {
        setProcessedHist(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch processed histogram', err);
    } finally {
      setIsLoadingProcessed(false);
    }
  }, [jobId]);

  // Optionally auto-fetch when jobId changes, but we will leave it manual or hook driven
  useEffect(() => {
    if (jobId) {
      fetchOriginal();
      // Reset processed when jobId changes assuming it's a new image
      setProcessedHist(null);
    } else {
      setOriginalHist(null);
      setProcessedHist(null);
    }
  }, [jobId, fetchOriginal]);

  return {
    originalHist,
    processedHist,
    isLoadingOriginal,
    isLoadingProcessed,
    fetchOriginal,
    fetchProcessed
  };
};
