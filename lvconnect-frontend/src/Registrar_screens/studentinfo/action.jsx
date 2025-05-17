import "./student_information.css";

export default function ActionButtons({
  isEditing,
  onSave,
  onArchive,
  onCancel,
  onEditToggle,
}) {
  return (
    <div className="actions-container-button">
      {isEditing ? (
        <>
          <button onClick={onSave} className="action-btn-button save-btn-button">
            <span>Save</span>
          </button>
          <button onClick={onArchive} className="action-btn-button archive-btn-button">
            <span>Archive</span>
          </button>
          <button onClick={onCancel} className="action-btn-button cancel-btn-button">
            <span>Cancel</span>
          </button>
        </>
      ) : (
        <button onClick={onEditToggle} className="action-btn-button edit-btn-button">
          <span>Edit</span>
        </button>
      )}
    </div>
  );
}
