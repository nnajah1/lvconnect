import React from 'react';

const UpdateContent = ({ update, onBack }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 w-full">
      <div className="flex-1 bg-white rounded-xl shadow p-6">
        <div className="text-xs text-gray-500 mb-2">
          <button onClick={onBack} className="text-blue-600 hover:underline">← </button> &gt; <span className="text-blue-600 font-medium">{update.title}</span>
        </div>
        <h1 className="text-lg md:text-xl font-bold text-blue-800 mb-4">{update.title} </h1>
        <div
          className="prose prose-sm max-w-none text-sm text-gray-800"
          dangerouslySetInnerHTML={{ __html: update.content }}
        />
      </div>
    </div>
  );
};

export default UpdateContent;
