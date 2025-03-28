import "..//comms_styling/button_confirmation.css";
import { IoArrowForwardSharp } from "react-icons/io5";

const Button_confirmation = ({ onClose, icon: Icon, title, description, buttonText }) => {
  return (
    <div className="approval-modal-overlay">
      <div className="approval-modal-container">
        {/* Close Button */}
        <button onClick={onClose} className="approval-modal-close-button">
          ✕
        </button>

        {/* Icon */}
        {Icon && <Icon className="approval-modal-icon" />}

        {/* Title */}
        <h2 className="approval-modal-title">{title}</h2>

        {/* Description */}
        <p className="approval-modal-description">{description}</p>

        {/* Button */}
        <button className="approval-modal-button" onClick={onClose}>
          {buttonText}
          <IoArrowForwardSharp className="approval-modal-button-icon" />
        </button>
      </div>
    </div>
  );
};

export default Button_confirmation;

