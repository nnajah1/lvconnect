import React, { useState } from 'react';
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from '@/services/axios';
import DynamicModal from '@/components/dynamic/DynamicModal';

const AddEventModal = ({ onEventAdded, onClose, isOpen }) => {
  const [eventTitle, setEventTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#3490dc");
  const [isSaving, setIsSaving] = useState(false);

  const eventColors = ["#3490dc", "#f56565", "#48bb78", "#ecc94b"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventTitle.trim()) {
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
    if (!selectedColor) {
      toast.error("Event color is required.");
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
    <DynamicModal
      isOpen={isOpen}
      closeModal={onClose}
      showCloseButton={false}
      title="Create New Event"
      description="Fill out the form below to create a new school form."
      showTitle={true}
      showDescription={false}
    >
      <div className="rounded-lg">
        {/* <h2 className="text-2xl font-bold text-[#2CA4DD] text-center">Add Event</h2>
        <hr className="divider m-3" /> */}

        <div className="grid grid-cols-7 gap-4 items-start p-4">
          {/* Event Title */}
          <div className="col-span-7">
            <label className="block font-medium text-sm text-gray-700">Event Title</label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Enter event title"
              maxLength={255}
              className="w-full h-full-p-3 border rounded-md bg-white"
            />
          </div>


          {/* Description */}
          <div className="col-span-7">
            <label className="block font-medium text-sm text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              maxLength={1000}
              className="w-full h-25 bg-white p-2 border border-gray-200 rounded-md resize-none mb-2"
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

        <div className="flex justify-end gap-2 ">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSubmit}
            disabled={isSaving} className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800">
            {isSaving ? 'Saving...' : 'Add Event'}
          </button>
        </div>
      </div>
    </DynamicModal>
  );
};

export default AddEventModal;