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
