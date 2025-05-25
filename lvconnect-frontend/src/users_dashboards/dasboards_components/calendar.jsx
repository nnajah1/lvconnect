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

const Calendar = ({ onCalendarClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const today = new Date()

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleCalendarCardClick = () => {
    if (onCalendarClick) {
      onCalendarClick()
    }
  }

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-md font-semibold text-gray-700">{format(currentMonth, "MMMM yyyy")}</h2>
      <div className="space-x-2">
        <button onClick={handlePrevMonth} className="text-gray-500 hover:text-gray-700">
          ❮
        </button>
        <button onClick={handleNextMonth} className="text-gray-500 hover:text-gray-700">
          ❯
        </button>
      </div>
    </div>
  )

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return (
      <div className="grid grid-cols-7 text-center text-sm text-gray-600 mb-2">
        {days.map((day) => (
          <div key={day}>{day}</div>
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
        const isCurrentMonth = isSameMonth(day, monthStart)

        days.push(
          <div
            key={day}
            className={`text-sm text-center rounded-full p-2 cursor-pointer transition-colors ${
              isToday ? "bg-blue-500 text-white" : !isCurrentMonth ? "text-gray-300" : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            {formattedDate}
          </div>,
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={day} className="grid grid-cols-7 gap-y-2">
          {days}
        </div>,
      )
      days = []
    }
    return <div>{rows}</div>
  }

  return (
    <div
      className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleCalendarCardClick}
    >
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      
    </div>
  )
}

export default Calendar
