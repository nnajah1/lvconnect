import React from "react"
import CalendarActivities from "../student_dashboard/calendar_of_activities"

const CommunicationOfficerDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Calendar Of Activities
          </h1>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Event
          </button>
        </div>

        <CalendarActivities hideTitle={true} />
      </div>
    </div>
  )
}

export default CommunicationOfficerDashboard
