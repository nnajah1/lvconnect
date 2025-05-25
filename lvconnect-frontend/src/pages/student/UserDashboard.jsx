
import { useState } from "react"
import Calendar from "@/components/dashboards/student_dashboard/calendar"
import SchoolUpdates from "@/components/dashboards/student_dashboard/updates"
import CalendarActivities from "@/components/dashboards/student_dashboard/calendar_of_activities"
 const semesterInfo = {
  schoolYear: "2024–2025",
  semester: "First Semester"
  }
  const scheduleItems = [
  {
    day: "Mon",
    time: "9:00-10:00",
    subject: "Christian Teachings 7",
    tag: "EFS 404",
    color: "bg-orange-200",
    textColor: "text-orange-900",
  },
  {
    day: "Tue",
    time: "8:30-10:00",
    subject: "Ethics",
    tag: "EFS 404",
    color: "bg-green-200",
    textColor: "text-green-900",
  },
  {
    day: "Tue",
    time: "10:30-12:00",
    subject: "Ethics",
    tag: "",
    color: "bg-green-200",
    textColor: "text-green-900",
  },
  {
    day: "Wed",
    time: "9:00-12:00",
    subject: "Customer Relationship Management",
    tag: "",
    color: "bg-blue-200",
    textColor: "text-blue-900",
  },
  {
    day: "Fri",
    time: "8:00-11:00",
    subject: "IS Strategy, Management, and Acquisition",
    tag: "EFS 404",
    color: "bg-orange-200",
    textColor: "text-orange-900",
  },
]

const UserDashboard = () => {
  const [showCalendarActivities, setShowCalendarActivities] = useState(false)
  const [selectedUpdate, setSelectedUpdate] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)

  const handleDateClick = (date) => {
    setSelectedDate(date)
    setShowCalendarActivities(true)
    console.log("Selected date:", format(date, "yyyy-MM-dd"))
  }

  const handleBackFromCalendar = () => {
    setShowCalendarActivities(false)
    setSelectedDate(null)
  }

  const handleSelectUpdate = (update) => {
    setSelectedUpdate(update)
  }

  const handleBack = () => {
    setSelectedUpdate(null)
  }

  const type = {
    announcement: "Announcement",
  }

  return (
    <div className="h-full w-full p-3 sm:p-6 font-sans">
      {showCalendarActivities ? (
        <CalendarActivities onBack={handleBackFromCalendar} selectedDate={selectedDate} />
      ) : !selectedUpdate ? (
        <div className="h-full flex flex-col">
          <div className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-6 min-h-0">
            <div className="flex-1 min-h-0">
              <div className="bg-white rounded-lg shadow-md p-2 sm:p-4 w-full h-full flex flex-col">
                <div className="mb-4 flex-shrink-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">Class schedule</h1>
                  <p className="text-gray-500 text-sm sm:text-base">
                    School year {semesterInfo.schoolYear} | {semesterInfo.semester}
                  </p>
                </div>
                <div className="grid grid-cols-8 gap-1 sm:gap-4 text-center text-gray-600 font-medium mb-4 flex-shrink-0">
                  <div className="col-span-1 min-w-[60px]"></div>
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="py-2 text-xs sm:text-sm min-w-[80px] sm:min-w-[120px]">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Fixed height container with hidden scrollbar */}
                <div className="flex-1 overflow-y-scroll scrollbar-hide">
                  <div
                    className="relative grid gap-1 sm:gap-4"
                    style={{
                      gridTemplateColumns: "60px repeat(7, minmax(80px, 1fr))",
                      height: `${["7:00", "8:00", "9:00", "10:00", "11:00", "12:00", "1:00", "2:00", "3:00", "4:00", "5:00"].length * 80}px`,
                    }}
                  >
                    {/* Time column */}
                    <div className="text-right text-xs sm:text-sm text-gray-400 space-y-0 min-w-[60px]">
                      {["7:00", "8:00", "9:00", "10:00", "11:00", "12:00", "1:00", "2:00", "3:00", "4:00", "5:00"].map(
                        (time, index) => (
                          <div key={time} className="h-[80px] flex items-start pt-2 pr-1 sm:pr-2">
                            {time}
                          </div>
                        ),
                      )}
                    </div>

                    {/* Day columns */}
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                      <div key={index} className="relative border-l border-gray-100 min-w-[80px] sm:min-w-[120px]">
                        {/* Grid lines for hours */}
                        {[
                          "7:00",
                          "8:00",
                          "9:00",
                          "10:00",
                          "11:00",
                          "12:00",
                          "1:00",
                          "2:00",
                          "3:00",
                          "4:00",
                          "5:00",
                        ].map((_, timeIndex) => (
                          <div
                            key={timeIndex}
                            className="absolute left-0 right-0 border-t border-gray-50"
                            style={{ top: `${timeIndex * 80}px`, height: "80px" }}
                          />
                        ))}

                        {/* Schedule items */}
                        {scheduleItems
                          .filter((item) => item.day === day)
                          .map((item, i) => {
                            const [startTime, endTime] = item.time.split("-")
                            const [startHour, startMinute] = startTime.split(":").map(Number)
                            const [endHour, endMinute] = endTime.split(":").map(Number)

                            const topPosition = (startHour - 7) * 80 + (startMinute / 60) * 80
                            const endPosition = (endHour - 7) * 80 + (endMinute / 60) * 80
                            const height = endPosition - topPosition

                            return (
                              <div
                                key={i}
                                className={`absolute left-1 right-1 px-2 py-1 rounded-md text-[10px] sm:text-xs shadow-sm border border-opacity-20 ${item.color} ${item.textColor}`}
                                style={{
                                  top: `${topPosition}px`,
                                  height: `${Math.max(height - 2, 20)}px`,
                                  zIndex: 1,
                                }}
                              >
                                <div className="font-semibold leading-tight">{item.subject}</div>
                                <div className="opacity-75">{item.time}</div>
                                {item.tag && (
                                  <div className="text-gray-600 text-[8px] sm:text-[10px] mt-1">{item.tag}</div>
                                )}
                              </div>
                            )
                          })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:gap-6 w-full xl:w-1/3 h-full">
              <Calendar onDateClick={handleDateClick} />
              <div className="flex-1 min-h-0">
                <SchoolUpdates onSelect={handleSelectUpdate} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col xl:flex-row gap-4 sm:gap-6">
          <div className="flex-1 bg-white rounded-xl shadow p-4 sm:p-6 overflow-y-auto">
            <button onClick={handleBack} className="text-sm text-blue-600 mb-4 hover:underline">
              ←
            </button>
            <div className="text-xs text-gray-500 mb-2">
              {type.announcement} &gt; <span className="text-blue-600 font-medium">{selectedUpdate.title}</span>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-blue-800 mb-4">{selectedUpdate.title}</h1>
            <div
              className="prose prose-sm max-w-none text-sm text-gray-800"
              dangerouslySetInnerHTML={{ __html: selectedUpdate.content }}
            />
          </div>
          <div className="w-full xl:w-1/3 h-full">
            <SchoolUpdates onSelect={handleSelectUpdate} selected={selectedUpdate} />
          </div>
        </div>
      )}
    </div>
  )
}
export default UserDashboard
