
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
  placeholder
}) {
  const isSelect = Array.isArray(options) && type !== "radio";
  const isRadio = Array.isArray(options) && type === "radio";
  const isCheckbox = type === "checkbox";

  return (
    <div className={`form-field-container ${maxWidth || ""}`}>
      <label className="form-label">{label}</label>

      {isEditing ? (
        isRadio ? (
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
        ) : isSelect ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="form-select bg-white"
            required
          >
            <option value="">Select {label}</option>
            {options.map((option, index) => {
              const val = typeof option === "object" ? option.id ?? option.value : option;
              const labelText = typeof option === "object" ? option.name ?? option.label : option;
              return (
                <option key={index} value={val}>
                  {labelText}
                </option>
              );
            })}
          </select>
        ) : isCheckbox ? (
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
            placeholder={placeholder}
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
          {isCheckbox ? (
            <div className="form-display-checkbox">
              <input type="checkbox" checked={!!value} disabled />
              <span>{value ? "Yes" : "No"}</span>
            </div>
          ) : isRadio ? (
            <div className="form-display-radio">
              {options.map((opt, i) => (
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
              ))}
            </div>
          ) : (
            <div className="form-display bg-gray-100">
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


