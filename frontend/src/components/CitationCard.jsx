import React from 'react';

const CitationCard = ({ source }) => {
  return (
    <div className="bg-white p-3 rounded border border-gray-200 text-sm">
      <div className="flex items-start justify-between mb-1">
        <span className="font-semibold text-blue-600">{source.document}</span>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          Clause {source.clauseNumber}
        </span>
      </div>
      <p className="text-gray-600 text-xs mt-2 italic">{source.excerpt}</p>
    </div>
  );
};

export default CitationCard;
