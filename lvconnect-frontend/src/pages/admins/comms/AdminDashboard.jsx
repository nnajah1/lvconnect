
import React, { useEffect, useState } from 'react';
import CalendarActivities from "@/components/dashboards/comms_dashboard/calendar_of_activities";

const CommsDashboard = () => {

  return (
    <div className="p-4 ">
      <CalendarActivities isAdmin={true}/>
    </div>
  );

}

export default CommsDashboard