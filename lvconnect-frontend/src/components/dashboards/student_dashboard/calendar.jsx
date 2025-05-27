"use client"

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
  isSameDay,
} from "date-fns"

const Calendar = ({ onDateClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const today = new Date()

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleDateClick = (date, event) => {
    event.stopPropagation()
    setSelectedDate(date)
    if (onDateClick) {
      onDateClick(date)
    }
  }

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-sm sm:text-md font-semibold text-gray-700">{format(currentMonth, "MMMM yyyy")}</h2>
      <div className="space-x-1 sm:space-x-2">
        <button onClick={handlePrevMonth} className="text-gray-500 hover:text-gray-700 p-1 text-sm sm:text-base">
          ❮
        </button>
        <button onClick={handleNextMonth} className="text-gray-500 hover:text-gray-700 p-1 text-sm sm:text-base">
          ❯
        </button>
      </div>
    </div>
  )

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return (
      <div className="grid grid-cols-7 text-center text-xs sm:text-sm text-gray-600 mb-2">
        {days.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>
    )
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })

    const rows = []
    let days = []
    let day = startDate
    let formattedDate = ""

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d")
        const cloneDay = day

        const isToday = isSameDay(day, today)
        const isSelected = isSameDay(day, selectedDate)
        const isCurrentMonth = isSameMonth(day, monthStart)

        days.push(
          <div
            key={day}
            className={`text-xs sm:text-sm text-center rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center cursor-pointer transition-colors mx-auto ${
              isToday
                ? "bg-blue-500 text-white"
                : isSelected
                  ? "bg-blue-100 text-blue-700 ring-1 sm:ring-2 ring-blue-300"
                  : !isCurrentMonth
                    ? "text-gray-300"
                    : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={(e) => handleDateClick(cloneDay, e)}
          >
            {formattedDate}
          </div>,
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={day} className="grid grid-cols-7 gap-y-1 mb-1">
          {days}
        </div>,
      )
      days = []
    }
    return <div>{rows}</div>
  }

  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {selectedDate && (
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-600">Selected: {format(selectedDate, "MMM d, yyyy")}</p>
        </div>
      )}
    </div>
  )
}
export default Calendar
