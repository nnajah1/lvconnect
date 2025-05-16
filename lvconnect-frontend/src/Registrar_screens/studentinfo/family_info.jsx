

import "./student_information.css";

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
      <div className="family-wrapper">
        {/* Number of Children */}
        <div className="family-group">
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
            <div className="family-display-box">
              <span className="family-text">{familyInfo.numberOfChildren}</span>
            </div>
          )}
        </div>

        {/* Birth Order */}
        <div className="family-group">
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
            <div className="family-display-box">
              <span className="family-text">{familyInfo.birthOrder}</span>
            </div>
          )}
        </div>

        {/* Siblings in LVCC */}
        <div className="family-group">
          <label className="family-label">Siblings studying in LVCC:</label>
          <div className="family-radio-group">
            {/* Yes */}
            <div className="family-radio-option">
              <div
                className={`family-radio-outer ${familyInfo.hasSiblingsInLVCC ? "family-radio-active" : ""} ${
                  isEditing ? "cursor-pointer" : ""
                }`}
                onClick={isEditing ? () => handleRadioChange(true) : undefined}
              >
                {familyInfo.hasSiblingsInLVCC && <div className="family-radio-inner"></div>}
              </div>
              <span className="family-text">Yes</span>
            </div>
            {/* No */}
            <div className="family-radio-option">
              <div
                className={`family-radio-outer ${!familyInfo.hasSiblingsInLVCC ? "family-radio-active" : ""} ${
                  isEditing ? "cursor-pointer" : ""
                }`}
                onClick={isEditing ? () => handleRadioChange(false) : undefined}
              >
                {!familyInfo.hasSiblingsInLVCC && <div className="family-radio-inner"></div>}
              </div>
              <span className="family-text">No</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
