

import { useEffect, useState } from "react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay
} from "date-fns"

const activities = [
  {
    id: 1,
    title: "Resumption of Classes",
    date: "2025-01-02",
    color: "bg-yellow-200",
    textColor: "text-yellow-800",
  },
  {
    id: 2,
    title: "End of Bible Reading Month",
    date: "2025-01-03",
    color: "bg-yellow-200",
    textColor: "text-yellow-800",
  },
  {
    id: 3,
    title: "Communication Week",
    date: "2025-01-06",
    endDate: "2025-01-10",
    color: "bg-blue-200",
    textColor: "text-blue-800",
  },
  {
    id: 4,
    title: "Fun Run",
    date: "2025-01-20",
    endDate: "2025-01-25",
    color: "bg-orange-200",
    textColor: "text-orange-800",
  },
]

const CalendarActivities = ({ onBack, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date(2025, 0, 1))

  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(selectedDate)
    }
  }, [selectedDate])

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const getActivitiesForDate = (date) => {
    return activities.filter((activity) => {
      const activityDate = new Date(activity.date)
      const endDate = activity.endDate ? new Date(activity.endDate) : activityDate
      return date >= activityDate && date <= endDate
    })
  }

  const renderHeader = () => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800 text-lg">
          ←
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Calendar of Activities</h1>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700">{format(currentMonth, "MMMM yyyy")}</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="text-gray-500 hover:text-gray-700 text-sm sm:text-base px-2 py-1 rounded hover:bg-gray-100"
          >
            ← Prev
          </button>
          <button
            onClick={handleNextMonth}
            className="text-gray-500 hover:text-gray-700 text-sm sm:text-base px-2 py-1 rounded hover:bg-gray-100"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )

  const renderDaysHeader = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return (
      <div className="grid grid-cols-7 border-b border-gray-200">
        {days.map((day) => (
          <div key={day} className="p-2 sm:p-3 text-center font-medium text-gray-600 bg-gray-50 text-xs sm:text-sm">
            {day}
          </div>
        ))}
      </div>
    )
  }

  const renderCalendarGrid = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })

    const rows = []
    let day = startDate

    while (day <= endDate) {
      const week = []
      for (let i = 0; i < 7; i++) {
        const currentDay = day
        const dayActivities = getActivitiesForDate(currentDay)
        const isCurrentMonth = isSameMonth(currentDay, monthStart)
        const isSelectedDate = selectedDate && isSameDay(currentDay, selectedDate)

        week.push(
          <div
            key={currentDay.toISOString()}
            className={`min-h-[80px] sm:min-h-[120px] border-r border-b border-gray-200 p-1 sm:p-2 ${
              !isCurrentMonth ? "bg-gray-50" : isSelectedDate ? "bg-blue-50" : "bg-white"
            }`}
          >
            <div
              className={`text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${
                !isCurrentMonth ? "text-gray-400" : isSelectedDate ? "text-blue-700 font-bold" : "text-gray-700"
              }`}
            >
              {format(currentDay, "d")}
            </div>
            <div className="space-y-1">
              {dayActivities.map((activity) => (
                <div
                  key={`${activity.id}-${currentDay.toISOString()}`}
                  className={`text-[10px] sm:text-xs p-1 rounded ${activity.color} ${activity.textColor} truncate`}
                  title={activity.title}
                >
                  {activity.title}
                </div>
              ))}
            </div>
          </div>,
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={day.toISOString()} className="grid grid-cols-7">
          {week}
        </div>,
      )
    }

    return <div className="border-l border-t border-gray-200 overflow-x-auto">{rows}</div>
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 w-full h-[calc(100vh-2rem)]">
      {selectedDate && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Selected Date:</span> {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </p>
        </div>
      )}
      {renderHeader()}
      {renderDaysHeader()}
      <div className="h-[calc(100vh-300px)] overflow-y-auto">{renderCalendarGrid()}</div>
    </div>
  )
}

export default CalendarActivities
