import { getPosts } from '@/services/axios';
import React, { useEffect, useState } from 'react';

const SchoolUpdates = ({ onSelect, selected }) => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPosts()
      .then((data) => {
        setUpdates(data);  // Assuming the API returns an array of posts
      })
      .catch((error) => {
        console.error('Error fetching updates:', error);
      })
      .finally(() => setLoading(false));
  }, []);

   return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 h-full flex flex-col">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">School Updates</h3>
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2 sm:space-y-3">
        {loading ? (
          <p>Loading updates...</p>
        ) : updates.length > 0 ? (
          updates.map((update) => (
            <div
              key={update.id}
              className={`p-2 sm:p-3 rounded-lg cursor-pointer transition-colors ${
                selected?.id === update.id ? "bg-blue-50 border border-blue-200" : "bg-gray-50 hover:bg-gray-100"
              }`}
              onClick={() => onSelect(update)}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-xs sm:text-sm">📧</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-xs sm:text-sm truncate">{update.title}</h4>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                    {new Date(update.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No updates available.</p>
        )}
      </div>
    </div>
  );
};

export default SchoolUpdates;