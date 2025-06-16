import { ErrorModal } from '@/components/dynamic/alertModal';
import DynamicModal from '@/components/dynamic/DynamicModal';
import api from '@/services/axios';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';

const EditEventModal = ({ event, onClose, onEventUpdated, isOpen }) => {
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

    if (!title.trim()) {
      toast.error("Event title is required.");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required.");
      return;
    }
    if (!startDate) {
      toast.error("Start date is required.");
      return;
    }
    if (!endDate) {
      toast.error("End date is required.");
      return;
    }
    if (!color) {
      toast.error("Event color is required.");
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
    <DynamicModal
      isOpen={isOpen}
      closeModal={onClose}
      showCloseButton={false}
      title="Edit Event"
      description="Fill out the form below to create a new school form."
      showTitle={true}
      showDescription={false}
    >
      <div className="rounded-lg">

        <div className="grid grid-cols-7 gap-4 items-start p-4">
          {/* Event Title */}
          <div className="col-span-7">
            <label className="block font-bold text-[14px] text-gray-700">Event Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              maxLength={255}
              className="w-full h-full-p-3 border rounded-md bg-white"
            />
          </div>

          {/* Description */}
          <div className="col-span-7">
            <label className="block font-bold text-[14px] text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              maxLength={1000}
              className="w-full h-30 bg-white p-2 border  border-gray-200 rounded-md resize-none mb-2"
            ></textarea>
          </div>

          {/* Start Date */}
          <div className="col-span-3">
            <label className="block text-sm font-bold text-gray-700">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select start date"
              className="w-full p-2 border rounded-md "
              withPortal
              isClearable
              minDate={new Date()}
            />
          </div>

          {/* End Date */}
          <div className="col-span-3">
            <label className="block text-sm font-bold text-gray-700">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select end date"
              className="w-full p-2 border rounded-md "
              withPortal
              isClearable
              minDate={startDate || new Date()}
            />
          </div>
          {/* Custom Color Picker */}
          <div className='col-span-3'>
            <label className="block text-sm font-bold text-gray-700">Select Event Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-16 h-10 p-0 border-0  "
            />
          </div>
        </div>

        <div className="flex justify-between gap-2 mt-4 px-4">
          {/* Left side: Delete Button */}
          <button
            onClick={() => setDeleteItem(event)}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Delete
          </button>

          {/* Right side: Cancel and Save */}
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-400">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
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


    </DynamicModal>

  );

};

export default EditEventModal;
