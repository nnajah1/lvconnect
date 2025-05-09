// src/components/ActionButtons.js

import "../registrar_styling/student_information.css";

export default function ActionButtons({
  isEditing,
  onSave,
  onArchive,
  onCancel,
  onEditToggle,
}) {
  return (
    
    <div className="actions-container">
   
      {isEditing ? (
        <>


          <button onClick={onSave} className="action-btn save-btn">
            <span>Save</span>
          </button>
          <button onClick={onArchive} className="action-btn archive-btn">
            <span>Archive</span>
          </button>
          <button onClick={onCancel} className="action-btn cancel-btn">
            <span>Cancel</span>
          </button>
        </>
        
      ) : (
        <button onClick={onEditToggle} className="action-btn edit-btn">
          
          <span>Edit</span>
        </button>
      )}
    </div>
  );
}
