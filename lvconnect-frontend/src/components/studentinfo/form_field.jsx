
import "@/styles/student_information.css"

export default function FormField({ label, value, maxWidth, isEditing, onChange, name, options, type}) {
  return (
    <div className={`form-field-container ${maxWidth || ""}`}>
      <label className="form-label">{label}</label>
      {isEditing ? (
        Array.isArray(options) ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="form-select"
            required
          >
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type ?? "text"}
            name={name}
            value={value}
            onChange={onChange}
            className="form-input"
            required
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
