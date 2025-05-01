import "../psas_styling/psas_modal.css";

const PsasModal = ({
    isOpen,
    onClose,
    icon: Icon,
    title,
    message,
    buttonText,
    onButtonClick,
    showButton = true,
    footer = null,
    className = "", 
  }) => {
    if (!isOpen) return null;
  
    const handleClick = () => {
      if (onButtonClick) onButtonClick();
      onClose();
    };
  
    return (
      <div className="psas-modal-overlay" onClick={onClose}>
        <div
          className={`psas-modal-container ${className}`} 
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="psas-modal-close-button">✕</button>
          {Icon && <Icon className="psas-modal-icon" />}
          <h2 className="psas-modal-title">{title}</h2>
          <p className="psas-modal-description">{message}</p>
          {footer ? (
            <div className="psas-modal-footer">{footer}</div>
          ) : (
            showButton && (
              <button className="psas-modal-button" onClick={handleClick}>
                {buttonText}
              </button>
            )
          )}
        </div>
      </div>
    );
  };
  

export default PsasModal;
