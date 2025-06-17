export function SOACard({ soaData, onView, onDownload }) {
  return (
    <div className="border border-gray-200 rounded-md p-4 shadow-sm bg-white">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-sm text-gray-800">
          Statement of Account for A.Y. {soaData.school_year}
        </h3>
        {/* {soaData.status === 'published' && (
          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">
            Published
          </span>
        )} */}
      </div>

      <div className="mt-4 space-y-2">
        <button
          className="w-full bg-blue-900 text-white text-sm py-1 rounded hover:bg-blue-800"
          onClick={onView}
        >
          View Details
        </button>
        {/* <button
          className="w-full bg-blue-900 text-white text-sm py-1 rounded hover:bg-blue-800"
          onClick={onDownload}
        >
          Download File
        </button> */}
      </div>
    </div>
  );
}
