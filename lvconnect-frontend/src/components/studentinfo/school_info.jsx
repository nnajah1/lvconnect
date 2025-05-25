

import "@/styles/student_information.css"
import FormField from "./form_field"

export default function SchoolInfoSection({ educationInfo, isEditing, onChange, canEditField }) {
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
          isEditing={canEditField("last_school_attended")}
          onChange={handleChange}
          name="last_school_attended"
        />
        <FormField
          label="Address"
          value={educationInfo.previous_school_address}
          isEditing={canEditField("previous_school_address")}
          onChange={handleChange}
          name="previous_school_address"
        />
        <FormField
          label="School Type"
          value={educationInfo.school_type}
          maxWidth="md:max-w-[150px]"
          isEditing={canEditField("school_type")}
          onChange={handleChange}
          name="school_type"
          options={["Public", "Private", "State University"]}
        />
      </div>
    </div>
  )
}
