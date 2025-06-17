

import { useEffect, useState } from "react"

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from "@/services/axios";
import AddEventModal from "@/components/school_updates/modals/event";
import { Loader3 } from "@/components/dynamic/loader";
import EditEventModal from "@/components/school_updates/modals/editEvent";
import { ViewEventModal } from "@/components/school_updates/modals/viewEvent";
import { useLoading } from "@/context/LoadingContext";

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

export default function CalendarActivities({ onBack, selectedDate, isAdmin }) {
  const [activities, setActivities] = useState([]);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const { setLoading } = useLoading();

  const [calendarDate, setCalendarDate] = useState(selectedDate || new Date());

  useEffect(() => {
    if (selectedDate) {
      setCalendarDate(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = () => {
    setLoading(true);
    api.get('/calendar-activities')
      .then((res) => {
        setActivities(res.data.map(event => ({
          id: event.id,
          title: event.event_title,
          description: event.description,
          start: event.start_date,
          end: event.end_date,
          color: event.color || '#3b82f6', // default blue
        })));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleEventAdded = () => {
    setIsAddEventModalOpen(false);
    fetchActivities();
  };

  const handleEventUpdated = () => {
    setSelectedActivity(null);
    fetchActivities();
  };

  const getEventById = (id) => {
    return activities.find((e) => e.id.toString() === id.toString());
  };

  return (
    <div className="h-screen max-h-screen w-full rounded-xl shadow-lg p-4 sm:p-6 bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          {!isAdmin && (
            <button onClick={onBack} className="text-blue-900 hover:text-gray-800 text-lg cursor-pointer">
              ← 
            </button>
          )}
          <h1 className="text-xl sm:text-2xl font-bold text-blue-900 text-center">Calendar of Activities</h1>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsAddEventModalOpen(true)}
            className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
          >
            Add Event
          </button>
        )}
      </div>

      {/* FullCalendar */}
      <div className="flex-1 overflow-hidden">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          initialDate={calendarDate}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: '',
          }}
          height="100%"
          events={activities}
          eventClick={(info) => {
            const activity = getEventById(info.event.id);
            setSelectedActivity(activity);
          }}
          dateClick={(info) => {
            if (isAdmin) {
              setIsAddEventModalOpen(true);
              setCalendarDate(new Date(info.dateStr));
            }
          }}
          eventColor="#3b82f6"
        />
      </div>

      {/* Modals */}
      {isAddEventModalOpen && (
        <AddEventModal
          isOpen={isAddEventModalOpen}
          onEventAdded={handleEventAdded}
          onClose={() => setIsAddEventModalOpen(false)}
        />
      )}
      {isAdmin && selectedActivity && (
        <EditEventModal
          isOpen={selectedActivity}
          event={selectedActivity}
          onEventUpdated={handleEventUpdated}
          onClose={() => setSelectedActivity(null)}
        />
      )}
      {!isAdmin && selectedActivity && (
        <ViewEventModal
          event={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </div>
  );
}
