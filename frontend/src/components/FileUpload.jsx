import React, { useState } from 'react';
import { uploadDocument } from '../services/api.service';

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        return;
      }
      if (selectedFile.size > 10485760) {
        setError('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const response = await uploadDocument(file, setProgress);
      onUploadSuccess(response);
      setFile(null);
      setProgress(0);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload Legal Document</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PDF only (MAX. 10MB)</p>
            </div>
            <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
          </label>
        </div>

        {file && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-gray-700 truncate">{file.name}</span>
            <button
              onClick={() => setFile(null)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
