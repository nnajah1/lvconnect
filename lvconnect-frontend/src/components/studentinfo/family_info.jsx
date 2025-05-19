

import "@/styles/student_information.css"
export default function FamilyInfoSection({ familyInfo, isEditing, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange("family", name, value)
  }

  const handleRadioChange = (value) => {
    onChange("family", "hasSiblingsInLVCC", value)
  }

  return (
    <div className="family-container">
      <div className="family-content">
        {/* Number of Children */}
        <div className="family-item">
          <label className="family-label">Number of Children in Family:</label>
          {isEditing ? (
            <input
              type="text"
              name="numberOfChildren"
              value={familyInfo.numberOfChildren}
              onChange={handleChange}
              className="family-input"
            />
          ) : (
            <div className="family-static">
              <span className="family-value">{familyInfo.numberOfChildren}</span>
            </div>
          )}
        </div>

        {/* Birth Order */}
        <div className="family-item">
          <label className="family-label">Birth Order:</label>
          {isEditing ? (
            <input
              type="text"
              name="birthOrder"
              value={familyInfo.birthOrder}
              onChange={handleChange}
              className="family-input"
            />
          ) : (
            <div className="family-static">
              <span className="family-value">{familyInfo.birthOrder}</span>
            </div>
          )}
        </div>

        {/* Siblings in LVCC */}
        <div className="family-item">
          <label className="family-label">Siblings studying in LVCC:</label>
          <div className="family-radio-group">
            <div className="family-radio-option">
              <div
                className={`family-radio-circle ${familyInfo.hasSiblingsInLVCC ? "selected" : ""} ${
                  isEditing ? "clickable" : ""
                }`}
                onClick={isEditing ? () => handleRadioChange(true) : undefined}
              >
                {familyInfo.hasSiblingsInLVCC && <div className="family-radio-dot"></div>}
              </div>
              <span className="family-value">Yes</span>
            </div>
            <div className="family-radio-option">
              <div
                className={`family-radio-circle ${!familyInfo.hasSiblingsInLVCC ? "selected" : ""} ${
                  isEditing ? "clickable" : ""
                }`}
                onClick={isEditing ? () => handleRadioChange(false) : undefined}
              >
                {!familyInfo.hasSiblingsInLVCC && <div className="family-radio-dot"></div>}
              </div>
              <span className="family-value">No</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
