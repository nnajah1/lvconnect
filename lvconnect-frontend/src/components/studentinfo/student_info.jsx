
import "@/styles/student_information.css"
import FormField from "./form_field"
import SectionHeader from "./header_section"
import { formatDate } from "@/utils/formatDate";

export default function StudentInfoSection({ personalInfo, isEditing, onChange, religionOptions }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange("personal", name, value)
  }

  return (
    <div className="student_section_container">
      <SectionHeader title="STUDENT INFORMATION" />

      {/* Name Fields */}
      <div className="student_grid">
        <FormField
          label="First Name"
          value={personalInfo.first_name}
          isEditing={isEditing}
          onChange={handleChange}
          name="firstName"
        />
        <FormField
          label="Middle Name"
          value={personalInfo.middle_name}
          isEditing={isEditing}
          onChange={handleChange}
          name="middleName"
        />
        <FormField
          label="Last Name"
          value={personalInfo.last_name}
          isEditing={isEditing}
          onChange={handleChange}
          name="lastName"
        />
        <FormField
          label="Suffix"
          value={personalInfo.suffix}
          isEditing={isEditing}
          onChange={handleChange}
          name="suffix"
        />
      </div>

      {/* Birth Info, Gender, Civil Status */}
      <div className="student_grid">
        <FormField
          type="date"
          label="Birthdate"
          value={formatDate(personalInfo.birth_date)}
          isEditing={isEditing}
          onChange={handleChange}
          name="birthdate"
        />
        <FormField
          label="Birthplace"
          value={personalInfo.birth_place}
          isEditing={isEditing}
          onChange={handleChange}
          name="birthplace"
        />
        <FormField
          label="Gender"
          value={personalInfo.gender}
          maxWidth="md:max-w-[150px]"
          isEditing={isEditing}
          onChange={handleChange}
          name="gender"
          options={["Male", "Female", "Other"]}
        />
        <FormField
          label="Civil Status"
          value={personalInfo.civil_status}
          maxWidth="md:max-w-[150px]"
          isEditing={isEditing}
          onChange={handleChange}
          name="civilStatus"
          options={["Single", "Married", "Widowed", "Separated", "Divorced"]}
        />
      </div>

      {/* Religion, Contact, Facebook */}
      <div className="student_grid">
        <FormField
          label="Religion"
          value={personalInfo.religion}
          maxWidth="md:max-w-[200px]"
          isEditing={isEditing}
          onChange={handleChange}
          name="religion"
          options={religionOptions}
        />
        <FormField
          label="Contact Number"
          value={personalInfo.contact_number}
          maxWidth="md:max-w-[200px]"
          isEditing={isEditing}
          onChange={handleChange}
          name="contactNumber"
        />
        <FormField
          label="Facebook Profile link"
          value={personalInfo.fb_link}
          maxWidth="md:max-w-[300px]"
          isEditing={isEditing}
          onChange={handleChange}
          name="facebookProfile"
        />
      </div>
    </div>
  )
}
