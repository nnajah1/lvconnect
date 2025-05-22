

import FormField from "./form_field"
import SectionHeader from "./header_section"
import "@/styles/student_information.css"

export default function GuardianInfoComponent({
  title,
  guardianData,
  isEditing,
  onChange,
  incomeOptions,
  religionOptions,
  prefix,
  canEditField
}) {
const handleChange = (e) => {
  const { name, value } = e.target;
  const fullFieldName = `student_family_info.${prefix}_${name}`;
  onChange(fullFieldName, value);
};

  

  return (
    <div className="guardian_container">
      <SectionHeader title={title} isSubsection={true} />

      <div className="guardian_grid">
        <FormField
          label="First Name"
          value={guardianData?.[`${prefix}_first_name`] || ""}
          isEditing={canEditField(`${prefix}_first_name`)}
          onChange={handleChange}
          name="first_name"
        />
        <FormField
          label="Middle Name"
          value={guardianData?.[`${prefix}_middle_name`] || ""}
          isEditing={canEditField(`${prefix}_middle_name`)}
          onChange={handleChange}
          name="middle_name"
        />
        <FormField
          label="Last Name"
          value={guardianData?.[`${prefix}_last_name`] || ""}
          isEditing={canEditField(`${prefix}_last_name`)}
          onChange={handleChange}
          name="last_name"
        />
        <FormField
          label="Contact Number"
          value={guardianData?.[`${prefix}_mobile_number`] || ""}
          isEditing={canEditField(`${prefix}_mobile_number`)}
          onChange={handleChange}
          name="mobile_number"
        />
      </div>

      <div className="guardian_grid">
        <FormField
          label="Occupation"
          value={guardianData?.[`${prefix}_occupation`] || ""}
          isEditing={canEditField(`${prefix}_occupation`)}
          onChange={handleChange}
          name="occupation"
        />
        <FormField
          label="Monthly Income"
          value={guardianData?.[`${prefix}_monthly_income`] || ""}
          isEditing={canEditField(`${prefix}_monthly_income`)}
          onChange={handleChange}
          name="monthly_income"
          options={incomeOptions}
        />
        <FormField
          label="Religion"
          value={guardianData?.[`${prefix}_religion`] || ""}
          isEditing={canEditField(`${prefix}_religion`)}
          onChange={handleChange}
          name="religion"
          options={religionOptions}
        />
        {prefix === "guardian" && (
          <FormField
            label="Relationship"
            value={guardianData.relationship}
            isEditing={canEditField(`${prefix}_relationship`)}
            onChange={handleChange}
            name="relationship"
          />
        )}
      </div>
    </div>
  )
}
