import { BsCalendarCheck } from "react-icons/bs";
import Button_confirmation from "./comms_components/button_cofirmation";

const PublishEvent = ({ onClose }) => {
  return (
    <Button_confirmation 
      onClose={onClose}
      icon={BsCalendarCheck }
      title="Event Added to Calendar!"
      description="Your event has been successfully added to the calendar. All Users now view it in the Event Calender."
      buttonText="See Calendar"
    />
  );
};

export default PublishEvent;
