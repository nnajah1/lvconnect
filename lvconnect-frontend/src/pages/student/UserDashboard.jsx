
import { useState } from "react"
import Calendar from "@/components/dashboards/student_dashboard/calendar"
import SchoolUpdates from "@/components/dashboards/student_dashboard/updates"
import CalendarActivities from "@/components/dashboards/comms_dashboard/calendar_of_activities"
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
  <div className="min-h-screen bg-gray-50 p-2 sm:p-3 lg:p-6 font-sans">
    <div className="max-w-7xl mx-auto">
      {showCalendarActivities ? (
        <CalendarActivities onBack={handleBackFromCalendar} selectedDate={selectedDate} isAdmin={false} />
      ) : !selectedUpdate ? (
        <div className="h-full flex flex-col">
          <div className="flex-1 flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6 min-h-0">
            {/* Class Schedule - Full width on mobile, 2/3 on desktop */}
            <div className="w-full lg:w-2/3 xl:flex-1 min-h-0 order-1 lg:order-1">
              <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6 w-full h-[45vh] sm:h-[50vh] lg:h-full flex flex-col">
                <div className="mb-3 sm:mb-4 flex-shrink-0">
                  <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-blue-900">Class schedule</h1>
                  <p className="text-gray-500 text-xs sm:text-sm lg:text-base">
                    School year {semesterInfo.schoolYear} | {semesterInfo.semester}
                  </p>
                </div>

                {/* Mobile: Horizontal scroll container */}
                <div className="flex-1 overflow-auto scrollbar-hide">
                  <div className="min-w-[500px] sm:min-w-[600px] lg:min-w-0">
                    <div className="grid grid-cols-8 gap-1 sm:gap-2 lg:gap-3 xl:gap-4 text-center text-gray-600 font-medium mb-2 sm:mb-3 lg:mb-4 flex-shrink-0">
                      <div className="col-span-1 min-w-[40px] sm:min-w-[50px] lg:min-w-[60px]"></div>
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div
                          key={day}
                          className="py-1 sm:py-2 text-xs sm:text-sm lg:text-base min-w-[60px] sm:min-w-[70px] lg:min-w-[80px] xl:min-w-[120px]"
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    <div
                      className="relative grid gap-1 sm:gap-2 lg:gap-3 xl:gap-4"
                      style={{
                        gridTemplateColumns: "40px repeat(7, minmax(60px, 1fr))",
                        height: `${["7:00", "8:00", "9:00", "10:00", "11:00", "12:00", "1:00", "2:00", "3:00", "4:00", "5:00"].length * (window.innerWidth < 640 ? 45 : window.innerWidth < 1024 ? 55 : 70)}px`,
                      }}
                    >
                      {/* Time column */}
                      <div className="text-right text-xs sm:text-sm lg:text-base text-gray-400 space-y-0 min-w-[40px] sm:min-w-[50px] lg:min-w-[60px]">
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
                        ].map((time, index) => (
                          <div key={time} className="h-[45px] sm:h-[55px] lg:h-[70px] flex items-start pt-1 sm:pt-2 pr-1 sm:pr-2">
                            {time}
                          </div>
                        ))}
                      </div>

                      {/* Day columns */}
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                        <div
                          key={index}
                          className="relative border-l border-gray-100 min-w-[60px] sm:min-w-[70px] lg:min-w-[80px] xl:min-w-[120px]"
                        >
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
                              style={{ 
                                top: `${timeIndex * (window.innerWidth < 640 ? 45 : window.innerWidth < 1024 ? 55 : 70)}px`, 
                                height: `${window.innerWidth < 640 ? 45 : window.innerWidth < 1024 ? 55 : 70}px` 
                              }}
                            />
                          ))}

                          {/* Schedule items */}
                          {scheduleItems
                            .filter((item) => item.day === day)
                            .map((item, i) => {
                              const [startTime, endTime] = item.time.split("-")
                              const [startHour, startMinute] = startTime.split(":").map(Number)
                              const [endHour, endMinute] = endTime.split(":").map(Number)

                              const cellHeight = window.innerWidth < 640 ? 45 : window.innerWidth < 1024 ? 55 : 70
                              const topPosition = (startHour - 7) * cellHeight + (startMinute / 60) * cellHeight
                              const endPosition = (endHour - 7) * cellHeight + (endMinute / 60) * cellHeight
                              const height = endPosition - topPosition

                              return (
                                <div
                                  key={i}
                                  className={`absolute left-0.5 right-0.5 sm:left-1 sm:right-1 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-[7px] sm:text-[9px] lg:text-xs shadow-sm border border-opacity-20 ${item.color} ${item.textColor}`}
                                  style={{
                                    top: `${topPosition}px`,
                                    height: `${Math.max(height - 2, 18)}px`,
                                    zIndex: 1,
                                  }}
                                >
                                  <div className="font-semibold leading-tight truncate">{item.subject}</div>
                                  <div className="opacity-75 text-[6px] sm:text-[8px] lg:text-[10px]">{item.time}</div>
                                  {item.tag && (
                                    <div className="text-gray-600 text-[5px] sm:text-[7px] lg:text-[9px] mt-0.5 truncate">
                                      {item.tag}
                                    </div>
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
            </div>

            {/* Calendar and School Updates - Stack vertically on mobile, sidebar on desktop */}
            <div className="w-full lg:w-1/3 flex flex-col gap-3 sm:gap-4 lg:gap-6 order-2 lg:order-2">
              {/* Calendar */}
              <div className="h-[30vh] sm:h-[35vh] lg:h-auto lg:flex-shrink-0">
                <Calendar onDateClick={handleDateClick} />
              </div>

              {/* School Updates */}
              <div className="h-[35vh] sm:h-[40vh] lg:flex-1 lg:min-h-0">
                <SchoolUpdates onSelect={handleSelectUpdate} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[85vh] sm:h-[80vh] flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6">
          <div className="flex-1 bg-white rounded-lg sm:rounded-xl shadow p-3 sm:p-4 lg:p-6 overflow-y-auto">
            <button onClick={handleBack} className="text-sm sm:text-base text-blue-600 mb-3 sm:mb-4 hover:underline cursor-pointer">
              ← Back
            </button>
            <div className="text-xs sm:text-sm text-gray-500 mb-2">
              {selectedUpdate.type} &gt; <span className="text-blue-600 font-medium">{selectedUpdate.title}</span>
            </div>
            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-blue-800 mb-3 sm:mb-4">{selectedUpdate.title}</h1>
            <div
              className="prose prose-sm max-w-none text-xs sm:text-sm lg:text-base text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: selectedUpdate.content }}
            />
            {selectedUpdate.image_url && (
              <img 
                src={selectedUpdate.image_url} 
                alt={selectedUpdate.title} 
                className="mt-3 sm:mt-4 rounded-lg w-full h-auto object-cover max-h-64 sm:max-h-80" 
              />
            )}
          </div>
          <div className="h-[40vh] lg:h-full lg:w-80 xl:w-96">
            <SchoolUpdates onSelect={handleSelectUpdate} selected={selectedUpdate} />
          </div>
        </div>
      )}
    </div>
  </div>
)
}
export default UserDashboard
