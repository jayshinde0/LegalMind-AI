import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import ChatInterface from './components/ChatInterface';
import { getDocuments } from './services/api.service';

function App() {
  const [documents, setDocuments] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await getDocuments();
      setDocuments(response.documents);
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  const handleUploadSuccess = (response) => {
    setNotification({
      type: 'success',
      message: `${response.document.originalName} uploaded successfully and is being processed`,
    });
    setTimeout(() => setNotification(null), 5000);
    loadDocuments();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">LegalMind AI</h1>
          <p className="text-gray-600">Tree-Based Reasoning Legal Document Assistant</p>
        </header>

        {notification && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              notification.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {notification.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <FileUpload onUploadSuccess={handleUploadSuccess} />
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Uploaded Documents ({documents.length})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {documents.map((doc) => (
                  <div
                    key={doc._id}
                    className="p-3 bg-gray-50 rounded border border-gray-200"
                  >
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {doc.originalName}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          doc.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : doc.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {doc.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {doc.metadata?.totalClauses || 0} clauses
                      </span>
                    </div>
                  </div>
                ))}
                {documents.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No documents uploaded yet
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <ChatInterface />
          </div>
        </div>

        <footer className="mt-8 text-center text-sm text-gray-600">
          <p>Powered by Mistral (Ollama) with Tree-Based Reasoning</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
