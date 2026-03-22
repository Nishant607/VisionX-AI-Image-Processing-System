import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 30000,
});

export const visionApi = {
  uploadImage: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('original_image', file);
    
    const response = await api.post('/upload-image/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  },

  processImage: async (params) => {
    const response = await api.post('/process-image/', params);
    return response.data;
  },

  downloadImage: async (jobId) => {
    const response = await api.get(`/download/${jobId}/`, {
      responseType: 'blob',
    });
    return response.data;
  },

  getHistogram: async (jobId, type = 'original') => {
    const response = await api.get(`/histogram/${jobId}/?type=${type}`);
    return response.data;
  },

  getJobHistory: async () => {
    const response = await api.get('/jobs/');
    return response.data;
  },

  deleteJob: async (jobId) => {
    const response = await api.delete(`/jobs/${jobId}/`);
    return response.data;
  }
};
