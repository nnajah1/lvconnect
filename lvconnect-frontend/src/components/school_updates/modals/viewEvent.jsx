export const ViewEventModal = ({ event, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 flex items-center justify-center w-full">
      <div className="bg-accent rounded-lg p-4 w-[800px]">
        <h2 className="font-bold text-lg mb-4">View Event</h2>

        <div className="grid grid-cols-7 gap-4 items-start p-4">
          {/* Event Title */}
          <div className="col-span-7">
            <label className="block text-sm font-medium text-gray-700">Event Title</label>
            <p className="p-2 border rounded-md bg-gray-100">{event.title || 'No title'}</p>
          </div>

          {/* Description */}
          <div className="col-span-7">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <p className="p-2 border rounded-md bg-gray-100 whitespace-pre-wrap">
              {event.description || 'No description'}
            </p>
          </div>

          {/* Start Date */}
          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <p className="p-2 border rounded-md bg-gray-100">
              {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
            </p>
          </div>

          {/* End Date */}
          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <p className="p-2 border rounded-md bg-gray-100">
              {event.endDate ? new Date(event.endDate).toLocaleDateString() : 'N/A'}
            </p>
          </div>

        </div>

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className=" bg-gray-500 text-white hover:bg-gray-400 px-4 py-2 rounded cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
