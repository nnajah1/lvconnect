import { BsFillFileEarmarkCheckFill } from "react-icons/bs";
import Button_confirmation from "./comms_components/button_cofirmation";

const ApprovalModal = ({ onClose }) => {
  return (
        <Button_confirmation 
          onClose={onClose}
          icon={BsFillFileEarmarkCheckFill}
          title="Post submitted for approval!"
          description="Your post has been successfully submitted and is now awaiting review by the School Admin."
          buttonText="Manage Your Posts"
        />
      );
    };

export default ApprovalModal;


