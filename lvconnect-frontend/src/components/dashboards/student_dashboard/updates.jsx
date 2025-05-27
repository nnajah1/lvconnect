import React from 'react';

const updates = [
  {
    id: 1,
    title: 'LVCC @ 26: Celebrating Free Education, Excellence, and Unity!',
    date: '06 February 2025, Thursday',
    content: `
      <p class="mb-2">Gear up, LVCC family! From <strong>February 24–28, 2025</strong>, we’re marking <span class="text-orange-500 font-semibold">26 years of free and quality education</span> with a week-long celebration filled with excitement, creativity, and camaraderie!</p>
      <p class="font-semibold"> What’s coming your way?</p>
      <ul class="list-disc ml-5 my-3 space-y-1">
        <li><strong>Grand Finale!</strong> Closing Ceremony & Awarding</li>
      </ul>
      <p>Let’s unite, celebrate, and make this 26th Foundation Anniversary one for the books! Are you ready? See you there, God willing! 🎉</p>
      <img src="/foundation-banner.png" alt="LVCC Event" class="rounded-lg mt-4 w-full max-w-md" />
    `
  },
  {
    id: 2,
    title: 'Child Protection Policy Symposium',
    date: '17 January 2025, Friday',
    content: `<p>Join us for the Child Protection Policy Symposium. Stay informed, stay empowered. </p>`
  },
  {
    id: 3,
    title: 'Earthquake Drill Announcement',
    date: '13 January 2025, Monday',
    content: `<p>Prepare and participate in the school-wide Earthquake Drill. Safety first! </p>`
  },
  {
    id: 4,
    title: 'Intramurals 2024',
    date: '03 December 2024, Tuesday',
    content: `<p>Let the games begin! Don’t miss our exciting intramurals. </p>`
  },
  {
    id: 5,
    title: 'President’s Day Celebration',
    date: '26 November 2024, Wednesday',
    content: `<p>Join us as we honor leadership and excellence this President’s Day. 🇵🇭</p>`
  },
  {
    id: 6,
    title: '12/18/2024 No Classes Announcement',
    date: '18 December 2024, Wednesday',
    content: `<p>No classes on December 18, 2024 due to system maintenance. </p>`
  }
];


const SchoolUpdates = ({ onSelect, selected }) => {
  const updates = [
    {
      id: 1,
      title: "Child Protection Policy",
      date: "17 January 2025, Friday",
      content: "<p>Important updates regarding child protection policies...</p>",
    },
    {
      id: 2,
      title: "Earthquake Drill Announcement",
      date: "13 January 2025, Monday",
      content: "<p>Scheduled earthquake drill announcement...</p>",
    },
    {
      id: 3,
      title: "Intramurals 2024",
      date: "03 December 2024, Tuesday",
      content: "<p>Intramurals event details and schedule...</p>",
    },
    {
      id: 4,
      title: "Academic Calendar Update",
      date: "10 January 2025, Wednesday",
      content: "<p>Updates to the academic calendar for the semester...</p>",
    },
    {
      id: 5,
      title: "Library Hours Extension",
      date: "08 January 2025, Monday",
      content: "<p>Extended library hours during exam period...</p>",
    },
    {
      id: 6,
      title: "Student Health Services",
      date: "05 January 2025, Friday",
      content: "<p>New health services available for students...</p>",
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 h-full flex flex-col">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">School Updates</h3>
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2 sm:space-y-3">
        {updates.map((update) => (
          <div
            key={update.id}
            className={`p-2 sm:p-3 rounded-lg cursor-pointer transition-colors ${
              selected?.id === update.id ? "bg-blue-50 border border-blue-200" : "bg-gray-50 hover:bg-gray-100"
            }`}
            onClick={() => onSelect(update)}
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-xs sm:text-sm">📧</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-xs sm:text-sm truncate">{update.title}</h4>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">{update.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SchoolUpdates;