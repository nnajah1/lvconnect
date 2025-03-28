import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdCalendarMonth } from "react-icons/md";
import "../comms_styling/calendar.css"; 

const Calendar = ({ label }) => {
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (event) => {
    const inputDate = event.target.value;
    if (inputDate) {
      const formattedDate = new Date(inputDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setSelectedDate(formattedDate);
    } else {
      setSelectedDate("");
    }
  };

  return (
    <div className="calendar-container">
      <label className="calendar-label">{label}</label>
      
      <div className="calendar-wrapper">
        {/* Display Formatted Date */}
        <input
          type="text"
          className="calendar-input"
          value={selectedDate}
          placeholder="Select Date"
          readOnly
          onClick={() => document.getElementById(`hidden-date-${label}`).showPicker()}
        />

        {/* Calendar Icon */}
        <MdCalendarMonth className="calendar-icon" onClick={() => document.getElementById(`hidden-date-${label}`).showPicker()} />

        {/* Hidden Native Date Picker */}
        <input
          type="date"
          id={`hidden-date-${label}`}
          className="hidden-calendar"
          onChange={handleDateChange}
        />
      </div>
    </div>
  );
};

export default Calendar;