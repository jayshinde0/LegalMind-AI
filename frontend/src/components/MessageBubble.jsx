import React from 'react';
import CitationCard from './CitationCard';

const MessageBubble = ({ message }) => {
  const isUser = message.type === 'user';
  const isError = message.type === 'error';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-lg p-4 ${
            isUser
              ? 'bg-blue-600 text-white'
              : isError
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
          
          {!isUser && !isError && message.confidence !== undefined && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-600">Confidence:</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                <div
                  className={`h-2 rounded-full ${
                    message.confidence >= 0.8
                      ? 'bg-green-500'
                      : message.confidence >= 0.6
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${message.confidence * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-600">
                {(message.confidence * 100).toFixed(0)}%
              </span>
            </div>
          )}
          
          {!isUser && !isError && message.sources && message.sources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-300">
              <p className="text-sm font-semibold mb-2 text-gray-700">Sources:</p>
              <div className="space-y-2">
                {message.sources.map((source, idx) => (
                  <CitationCard key={idx} source={source} />
                ))}
              </div>
            </div>
          )}
        </div>
        
        <p className="text-xs text-gray-500 mt-1 px-2">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
