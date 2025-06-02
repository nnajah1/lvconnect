import React, { useState } from 'react';
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from '@/services/axios';

const AddEventModal = ({ onEventAdded, onClose }) => {
  const [eventTitle, setEventTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#3490dc");
  const [isSaving, setIsSaving] = useState(false);

  const eventColors = ["#3490dc", "#f56565", "#48bb78", "#ecc94b"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventTitle.trim() || !description.trim() || !startDate || !endDate || !selectedColor) {
      toast.error("All fields are required.");
      return;
    }
    if (endDate < startDate) {
      toast.error("End date cannot be before start date.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await api.post('/calendar-activities', {
        event_title: eventTitle,
        description,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        color: selectedColor,
      });
      onEventAdded(response.data);
      toast.success("Event added successfully!")
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add event");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 flex items-center justify-center w-full">
      <div className="bg-accent rounded-lg p-4 w-[800px]">
        <h2 className="font-bold mb-2">Add Event</h2>

        <div className="grid grid-cols-7 gap-4 items-start p-4">
          {/* Event Title */}
          <div className="col-span-7">
            <label className="block text-sm font-medium text-gray-700">Event Title</label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
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
          <div className="col-span-7">
            <label className="block text-sm font-medium text-gray-700">Select Event Color</label>
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-16 h-10 p-0 border-0"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="border px-3 py-1 rounded">
            Cancel
          </button>
          <button onClick={handleSubmit}
            disabled={isSaving} className="bg-blue-600 text-white px-3 py-1 rounded">
            {isSaving ? 'Saving...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;