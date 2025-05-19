

import "@/styles/student_information.css"
import FormField from "./form_field"

export default function SchoolInfoSection({ educationInfo, isEditing, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange("education", name, value)
  }

  return (
    <div className="school_section_container">
      <div className="school_form_grid">
        <FormField
          label="School Last Attended"
          value={educationInfo.schoolLastAttended}
          isEditing={isEditing}
          onChange={handleChange}
          name="schoolLastAttended"
        />
        <FormField
          label="Address"
          value={educationInfo.schoolAddress}
          isEditing={isEditing}
          onChange={handleChange}
          name="schoolAddress"
        />
        <FormField
          label="Type"
          value={educationInfo.schoolType}
          maxWidth="md:max-w-[150px]"
          isEditing={isEditing}
          onChange={handleChange}
          name="schoolType"
          options={["Public", "Private", "State University"]}
        />
      </div>
    </div>
  )
}
