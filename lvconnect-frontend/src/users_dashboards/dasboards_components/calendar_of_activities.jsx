

import { useState } from "react"
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

const CalendarActivities = ({ onBack }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0, 1)) // January 2025

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
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800 text-lg">
          ←
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Calendar of Activities</h1>
      </div>
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-700">{format(currentMonth, "MMMM yyyy")}</h2>
        <div className="flex gap-2">
          <button onClick={handlePrevMonth} className="text-gray-500 hover:text-gray-700 text-lg px-2">
            ← Prev
          </button>
          <button onClick={handleNextMonth} className="text-gray-500 hover:text-gray-700 text-lg px-2">
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
          <div key={day} className="p-3 text-center font-medium text-gray-600 bg-gray-50">
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

        week.push(
          <div
            key={currentDay.toISOString()}
            className={`min-h-[120px] border-r border-b border-gray-200 p-2 ${
              !isCurrentMonth ? "bg-gray-50" : "bg-white"
            }`}
          >
            <div className={`text-sm font-medium mb-2 ${!isCurrentMonth ? "text-gray-400" : "text-gray-700"}`}>
              {format(currentDay, "d")}
            </div>
            <div className="space-y-1">
              {dayActivities.map((activity) => (
                <div
                  key={`${activity.id}-${currentDay.toISOString()}`}
                  className={`text-xs p-1 rounded ${activity.color} ${activity.textColor} truncate`}
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

    return <div className="border-l border-t border-gray-200">{rows}</div>
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full">
      {renderHeader()}
      {renderDaysHeader()}
      {renderCalendarGrid()}
     
    </div>
    
  )
}

export default CalendarActivities
