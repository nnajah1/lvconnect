

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
              value={familyInfo.num_children_in_family}
              onChange={handleChange}
              className="family-input"
            />
          ) : (
            <div className="family-static">
              <span className="family-value">{familyInfo.num_children_in_family}</span>
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
              value={familyInfo.birth_order}
              onChange={handleChange}
              className="family-input"
            />
          ) : (
            <div className="family-static">
              <span className="family-value">{familyInfo.birth_order}</span>
            </div>
          )}
        </div>

        {/* Siblings in LVCC */}
        <div className="family-item">
          <label className="family-label">Siblings studying in LVCC:</label>
          <div className="family-radio-group">
            {[{ label: "Yes", value: true }, { label: "No", value: false }].map((option) => {
              const selected = familyInfo.has_sibling_in_lvcc === option.value;
              return (
                <div key={option.label} className="family-radio-option">
                  <div
                    className={`family-radio-circle ${selected ? "selected" : ""} ${isEditing ? "clickable" : ""}`}
                    onClick={isEditing ? () => handleRadioChange(option.value) : undefined}
                  >
                    {selected && <div className="family-radio-dot"></div>}
                  </div>
                  <span className="family-value">{option.label}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
