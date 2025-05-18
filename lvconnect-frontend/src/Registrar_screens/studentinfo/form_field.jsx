
import "./student_information.css"

export default function FormField({ label, value, maxWidth, isEditing, onChange, name, options }) {
  return (
    <div className={`form-field-container ${maxWidth || ""}`}>
      <label className="form-label">{label}</label>
      {isEditing ? (
        options ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="form-select"
          >
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            className="form-input"
          />
        )
      ) : (
        <div className="form-display">
          <span className="form-value">{value}</span>
        </div>
      )}
    </div>
  )
}
