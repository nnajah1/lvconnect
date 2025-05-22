
import "@/styles/student_information.css"

export default function FormField({
  label,
  value,
  maxWidth,
  isEditing,
  onChange,
  name,
  options,
  type,
  inputMode,
  pattern,
  maxLength,
  min,
  numericOnly,
}) {
  return (
    <div className={`form-field-container ${maxWidth || ""}`}>
      <label className="form-label">{label}</label>

      {isEditing ? (
        Array.isArray(options) ? (
          type === "radio" ? (
            <div className="form-radio-group">
              {options.map((option, index) => (
                <label key={index} className="radio-label">
                  <input
                    type="radio"
                    name={name}
                    value={String(option.value)}
                    checked={String(value) === String(option.value)}
                    onChange={onChange}
                    required
                  />
                  {option.label}
                </label>
              ))}
            </div>
          ) : (
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
                  value={typeof option === "object" ? option.id ?? option.value : option}
                >
                  {typeof option === "object" ? option.name ?? option.label : option}
                </option>
              ))}
            </select>
          )
        ) : type === "checkbox" ? (
          <input
            type="checkbox"
            name={name}
            checked={!!value}
            onChange={onChange}
            className="form-checkbox"
          />
        ) : (
          <input
            type={type ?? "text"}
            name={name}
            value={value}
            onChange={onChange}
            className="form-input"
            required
            inputMode={inputMode}
            pattern={pattern}
            maxLength={maxLength}
            min={min}
            onKeyDown={(e) => {
              if (
                numericOnly &&
                !/^[0-9]$/.test(e.key) &&
                e.key !== "Backspace" &&
                e.key !== "Tab"
              ) {
                e.preventDefault();
              }
            }}
          />
        )
      ) : (
        <>
          {(type === "checkbox" || type === "radio") ? (
            type === "checkbox" ? (
              <div className="form-display-checkbox">
                <input type="checkbox" checked={!!value} disabled />
                <span>{value ? "Yes" : "No"}</span>
              </div>
            ) : (
              <div className="form-display-radio">
                {Array.isArray(options) ? options.map((opt, i) => (
                  <label
                    key={i}
                    className={`radio-label ${String(opt.value) === String(value) ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      checked={String(opt.value) === String(value)}
                      disabled
                    />
                    {opt.label}
                  </label>
                )) : (
                  <span>{String(value)}</span>
                )}
              </div>
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
        </>
      )}
    </div>
  );
}

