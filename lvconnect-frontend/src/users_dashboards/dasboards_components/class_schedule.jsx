import React from 'react';

const scheduleItems = [
  { day: 'Tue', time: '9:00 - 10:00', subject: 'Christian Teachings 7', color: 'bg-orange-100', tag: 'ETS-4A' },
  { day: 'Wed', time: '8:30 - 10:00', subject: 'Ethics', color: 'bg-green-100', tag: 'ETS-4A' },
  { day: 'Tue', time: '10:30 - 12:00', subject: 'Ethics', color: 'bg-green-100', tag: 'ETS-4A' },
  { day: 'Thu', time: '9:00 - 12:00', subject: 'Customer Relationship Management', color: 'bg-blue-100', tag: '' },
  { day: 'Sat', time: '8:00 - 11:00', subject: 'IS Strategy, Management, and Acquisition', color: 'bg-orange-100', tag: 'ETS-4A' },
];

const ClassSchedule = () => {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto w-full">
      <div className="grid grid-cols-8 gap-4 text-center text-gray-600 font-medium mb-4">
        <div className="col-span-1"></div>
        {days.map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="relative grid grid-cols-8 gap-4 h-[600px]">
        <div className="text-right text-sm text-gray-400 space-y-6 col-span-1">
          {['7:00', '8:00', '9:00', '10:00', '11:00'].map(time => (
            <div key={time} className="h-[100px]">{time}</div>
          ))}
        </div>
        {days.map((day, index) => (
          <div key={index} className="relative col-span-1">
            {scheduleItems
              .filter(item => item.day === day)
              .map((item, i) => (
                <div
                  key={i}
                  className={`absolute left-0 right-0 px-2 py-1 rounded-md text-xs text-gray-800 ${item.color}`}
                  style={{
                    top: `${(parseInt(item.time.split(':')[0]) - 7) * 100}px`,
                    height: `${
                      (parseInt(item.time.split('-')[1].split(':')[0]) - parseInt(item.time.split(':')[0])
                    ) * 100}px`,
                  }}
                >
                  <div className="font-semibold">{item.subject}</div>
                  <div>{item.time}</div>
                  {item.tag && <div className="text-gray-500 text-[10px]">{item.tag}</div>}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassSchedule;
