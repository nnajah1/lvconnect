import { ErrorModal } from '@/components/dynamic/alertModal';
import api from '@/services/axios';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';

const EditEventModal = ({ event, onClose, onEventUpdated }) => {
  const [title, setTitle] = useState(event.title || '');
  const [description, setDescription] = useState(event.description || '');
  const [startDate, setStartDate] = useState(event.date || '');
  const [endDate, setEndDate] = useState(event.endDate || '');
  const [color, setColor] = useState(event.color || '');
  const [isSaving, setIsSaving] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(event.title || '');
    setDescription(event.description || '')
    setStartDate(event.date ? new Date(event.date) : null);
    setEndDate(event.endDate ? new Date(event.endDate) : null);

    setColor(event.color || '');
  }, [event]);
  console.log(event)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !startDate || !endDate || !color) {
      toast.error("All fields are required.");
      return;
    }
    if (endDate < startDate) {
      toast.error("End date cannot be before start date.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await api.put(`/calendar-activities/${event.id}`, {
        event_title: title,
        description,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        color,
      });
      onEventUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await api.delete(`/calendar-activities/${id}`);
      toast.success("Event deleted");
      onEventUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    } finally {
      setLoading(false);
      setDeleteItem(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 flex items-center justify-center w-full">
      <div className="bg-accent rounded-lg p-4 w-[800px]">
        <h2 className="font-bold mb-2">Edit Event</h2>

        <div className="grid grid-cols-7 gap-4 items-start p-4">
          {/* Event Title */}
          <div className="col-span-7">
            <label className="block text-sm font-medium text-gray-700">Event Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              maxLength={255}
              className="w-full p-2 border rounded-md mb-2"
            />
          </div>

          {/* Description */}
          <div className="col-span-7">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              maxLength={1000}
              className="w-full h-32 p-2 border rounded-md resize-none mb-2"
            ></textarea>
          </div>

          {/* Start Date */}
          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select start date"
              className="w-full p-2 border rounded-md"
              withPortal
              isClearable
              minDate={new Date()}
            />
          </div>

          {/* End Date */}
          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select end date"
              className="w-full p-2 border rounded-md"
              withPortal
              isClearable
              minDate={startDate || new Date()}
            />
          </div>
          {/* Custom Color Picker */}
          <div className='col-span-3'>
            <label className="block text-sm font-medium text-gray-700">Select Event Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-16 h-10 p-0 border-0"
            />
          </div>
        </div>

        <div className="flex justify-between gap-2 mt-4">
          {/* Left side: Delete Button */}
          <button
            onClick={() => setDeleteItem(event)}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Delete
          </button>

          {/* Right side: Cancel and Save */}
          <div className="flex gap-2">
            <button onClick={onClose} className="border px-3 py-1 rounded">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              {isSaving ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>
      </div>

      {/* ErrorModal for Delete Confirmation */}
      {deleteItem && (
        <ErrorModal
          isOpen={!!deleteItem}
          closeModal={() => setDeleteItem(null)}
          title="Delete Event"
          description="Are you sure you want to delete this event?"
        >
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer"
            onClick={() => setDeleteItem(null)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
            onClick={() => handleDelete(deleteItem.id)}  // Confirm Delete
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </ErrorModal>
      )}


    </div>
  );

};

export default EditEventModal;
