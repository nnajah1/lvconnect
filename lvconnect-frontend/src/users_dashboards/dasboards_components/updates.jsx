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
  return (
    <div className="bg-white rounded-xl shadow p-4 h-full">
      <h2 className="text-md font-semibold mb-4">School Updates</h2>
      <ul className="space-y-3 overflow-y-auto">
        {updates.map((update) => (
          <li
            key={update.id}
            onClick={() => onSelect(update)}
            className={`flex items-start gap-2 text-sm cursor-pointer p-2 rounded-md ${
              selected?.id === update.id ? 'bg-blue-50' : 'hover:bg-gray-100'
            }`}
          >
            <span className="bg-blue-100 text-blue-600 rounded-full p-1">✉️</span>
            <div>
              <div className="font-medium text-gray-700">{update.title}</div>
              <div className="text-xs text-gray-500">{update.date}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SchoolUpdates;