"use client"

import { useState } from "react"
import ClassSchedule from "./class_schedule"
import Calendar from "./calendar"
import SchoolUpdates from "./updates"
import CalendarActivities from "./calendar_of_activities"

const AppStudent = () => {
  const [selectedUpdate, setSelectedUpdate] = useState(null)
  const [showCalendarActivities, setShowCalendarActivities] = useState(false)

  const semesterInfo = {
  schoolYear: "2024–2025",
  semester: "First Semester"
  }
  const type = {
  announcement: "announcement"
  }

  const handleSelectUpdate = (update) => {
    setSelectedUpdate(update)
  }

  const handleBack = () => {
    setSelectedUpdate(null)
  }

  const handleCalendarClick = () => {
    setShowCalendarActivities(true)
  }

  const handleBackFromCalendar = () => {
    setShowCalendarActivities(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      {showCalendarActivities ? (
        <CalendarActivities onBack={handleBackFromCalendar} />
      ) : !selectedUpdate ? (
        <>
           <h1 className="text-3xl font-bold text-blue-900">Class schedule</h1>
          <p className="text-gray-500 mb-6">
            School year {semesterInfo.schoolYear} | {semesterInfo.semester}
          </p>
          <div className="flex flex-col lg:flex-row gap-6">
            <ClassSchedule />
            <div className="flex flex-col gap-6 w-full lg:w-1/3">
              <Calendar onCalendarClick={handleCalendarClick} />
              <SchoolUpdates onSelect={handleSelectUpdate} />
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-white rounded-xl shadow p-6">
            <button onClick={handleBack} className="text-sm text-blue-600 mb-4 hover:underline">
              ←
            </button>
            <div className="text-xs text-gray-500 mb-2">
              {type.announcement} &gt; <span className="text-blue-600 font-medium">{selectedUpdate.title}</span>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-blue-800 mb-4">{selectedUpdate.title} </h1>
            <div
              className="prose prose-sm max-w-none text-sm text-gray-800"
              dangerouslySetInnerHTML={{ __html: selectedUpdate.content }}
            />
          </div>
          <div className="w-full lg:w-1/3">
            <SchoolUpdates onSelect={handleSelectUpdate} selected={selectedUpdate} />
          </div>
        </div>
      )}
    </div>
  )
}

export default AppStudent
