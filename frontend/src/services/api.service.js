import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadDocument = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('document', file);

  const response = await apiClient.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      if (onProgress) onProgress(percentCompleted);
    },
  });

  return response.data;
};

export const getDocuments = async () => {
  const response = await apiClient.get('/documents');
  return response.data;
};

export const getDocumentStatus = async (documentId) => {
  const response = await apiClient.get(`/documents/${documentId}`);
  return response.data;
};

export const deleteDocument = async (documentId) => {
  const response = await apiClient.delete(`/documents/${documentId}`);
  return response.data;
};

export const queryDocuments = async (query) => {
  const response = await apiClient.post('/query', { query });
  return response.data;
};

export default apiClient;
