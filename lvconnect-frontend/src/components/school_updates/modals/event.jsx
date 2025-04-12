import Calendar from "@/user_pages/communication_page/comms_components/calendar";
const EventFields = ({ selectedColor, setSelectedColor, eventColors,   about, setAbout, startDate, setStartDate, endDate, setEndDate  }) => (
    <div className="grid grid-cols-7 gap-4 items-start p-4">
      {/* Start Date */}
      <div className="col-span-2">
        <Calendar label="Start Date" value={startDate} onChange={setStartDate} />
      </div>
  
      {/* End Date */}
      <div className="col-span-2">
        <Calendar label="End Date" value={endDate} onChange={setEndDate}/>
      </div>
  
      {/* About Event */}
      <div className="col-span-3">
        <label className="block text-sm font-medium text-gray-700">About Event</label>
        <textarea
          className="w-full h-32 p-2 border border-gray-300 rounded-md bg-white resize-none focus:border-[#2CA4DD] focus:ring-0 focus:outline-none"
          placeholder="About event"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        ></textarea>
      </div>
  
      {/* Select Event Color */}
      <div className="col-span-7">
        <label className="block text-sm font-medium text-gray-700">Select Event Color</label>
        <div className="flex space-x-3 mt-2">
          {eventColors.map((color) => (
            <button
              key={color}
              className={`w-6 h-6 rounded-full border-2 ${
                selectedColor === color ? "border-black" : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  export default EventFields;

  //to use outside
//   <EventFields
//   selectedColor={selectedColor}
//   setSelectedColor={setSelectedColor}
//   eventColors={eventColors}
//   about={about}
//   setAbout={setAbout}
//   startDate={startDate}
//   setStartDate={setStartDate}
//   endDate={endDate}
//   setEndDate={setEndDate}
// />

        // if (!startDate || !endDate || !about?.trim() || !selectedColor) {

        //   setError("All event fields are required.");
        //   setIsLoading(false);
        //   return;
        // }
        // formData.append("start_date", startDate);
        // formData.append("end_date", endDate);
        // formData.append("about", about.trim());
        // formData.append("color", selectedColor);