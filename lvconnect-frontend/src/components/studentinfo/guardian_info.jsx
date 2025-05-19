

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
}) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange(prefix, name, value)
  }

  return (
    <div className="guardian_container">
      <SectionHeader title={title} isSubsection={true} />

      <div className="guardian_grid">
        <FormField
          label="First Name"
          value={guardianData.firstName}
          isEditing={isEditing}
          onChange={handleChange}
          name="firstName"
        />
        <FormField
          label="Middle Name"
          value={guardianData.middleName}
          isEditing={isEditing}
          onChange={handleChange}
          name="middleName"
        />
        <FormField
          label="Last Name"
          value={guardianData.lastName}
          isEditing={isEditing}
          onChange={handleChange}
          name="lastName"
        />
        <FormField
          label="Contact Number"
          value={guardianData.contactNumber}
          isEditing={isEditing}
          onChange={handleChange}
          name="contactNumber"
        />
      </div>

      <div className="guardian_grid">
        <FormField
          label="Occupation"
          value={guardianData.occupation}
          isEditing={isEditing}
          onChange={handleChange}
          name="occupation"
        />
        <FormField
          label="Monthly Income"
          value={guardianData.monthlyIncome}
          isEditing={isEditing}
          onChange={handleChange}
          name="monthlyIncome"
          options={incomeOptions}
        />
        <FormField
          label="Religion"
          value={guardianData.religion}
          isEditing={isEditing}
          onChange={handleChange}
          name="religion"
          options={religionOptions}
        />
        {prefix === "guardian" && (
          <FormField
            label="Relationship"
            value={guardianData.relationship}
            isEditing={isEditing}
            onChange={handleChange}
            name="relationship"
          />
        )}
      </div>
    </div>
  )
}
