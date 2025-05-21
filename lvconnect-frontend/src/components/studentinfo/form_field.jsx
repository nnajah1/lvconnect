
import "@/styles/student_information.css"

export default function FormField({ label, value, maxWidth, isEditing, onChange, name, options, type, inputMode, pattern }) {

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
            <option value="">Select {label}</option>
            {options.map((option, index) => (
              <option
                key={index}
                value={typeof option === "object" ? option.id : option}
              >
                {typeof option === "object" ? option.name : option}
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
          <span className="form-value">
            {Array.isArray(options)
              ? typeof options[0] === "object"
                ? options.find((opt) => opt.id === Number(value))?.name || value
                : value 
              : value}
          </span>
        </div>
      )}
    </div>

  )
}
