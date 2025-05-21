

import "@/styles/student_information.css"
import FormField from "./form_field"

export default function SchoolInfoSection({ educationInfo, isEditing, onChange }) {
  const handleChange = (e) => {
  const { name, value } = e.target;
  onChange(name, value); 
};

  return (
    <div className="school_section_container">
      <div className="school_form_grid">
        <FormField
          label="School Last Attended"
          value={educationInfo.last_school_attended}
          isEditing={isEditing}
          onChange={handleChange}
          name="last_school_attended"
        />
        <FormField
          label="Address"
          value={educationInfo.previous_school_address}
          isEditing={isEditing}
          onChange={handleChange}
          name="previous_school_address"
        />
        <FormField
          label="Type"
          value={educationInfo.school_type}
          maxWidth="md:max-w-[150px]"
          isEditing={isEditing}
          onChange={handleChange}
          name="school_type"
          options={["Public", "Private", "State University"]}
        />
      </div>
    </div>
  )
}
