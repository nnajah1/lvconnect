
import "@/styles/student_information.css"
import FormField from "./form_field"
import SectionHeader from "./header_section"
import { formatDate } from "@/utils/formatDate";

export default function StudentInfoSection({ personalInfo, canEditField, onChange, religionOptions }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className="student_section_container">
      <SectionHeader title="STUDENT INFORMATION" />

      {/* Name Fields */}
      <div className="student_grid">
        <FormField
          label="First Name"
          value={personalInfo.first_name}
          isEditing={canEditField("first_name")}
          onChange={handleChange}
          name="first_name"
        />
        <FormField
          label="Middle Name"
          value={personalInfo.middle_name}
          isEditing={canEditField("middle_name")}
          onChange={handleChange}
          name="middle_name"
        />
        <FormField
          label="Last Name"
          value={personalInfo.last_name}
          isEditing={canEditField("last_name")}
          onChange={handleChange}
          name="last_name"
        />
        <FormField
          label="Suffix"
          value={personalInfo.suffix}
          isEditing={canEditField("suffix")}
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
          isEditing={canEditField("birth_date")}
          onChange={handleChange}
          name="birth_date"
        />
        <FormField
          label="Birthplace"
          value={personalInfo.birth_place}
          isEditing={canEditField("birth_place")}
          onChange={handleChange}
          name="birth_place"
        />
        <FormField
          label="Gender"
          value={personalInfo.gender}
          maxWidth="md:max-w-[150px]"
          isEditing={canEditField("gender")}
          onChange={handleChange}
          name="gender"
          options={[{ value: "male", label: "Male" },
          { value: "female", label: "Female" },]}
        />
        <FormField
          label="Civil Status"
          value={personalInfo.civil_status}
          maxWidth="md:max-w-[150px]"
          isEditing={canEditField("civil_status")}
          onChange={handleChange}
          name="civil_status"
          options={[{ value: "single", label: "Single" },
          { value: "married", label: "Married" },
          { value: "widowed", label: "Widowed" },
          { value: "separated", label: "Separated" },
          { value: "divorced", label: "Divorced" },]}
        />
      </div>

      {/* Religion, Contact, Facebook */}
      <div className="student_grid">
        <FormField
          label="Religion"
          value={personalInfo.religion}
          maxWidth="md:max-w-[200px]"
          isEditing={canEditField("religion")}
          onChange={handleChange}
          name="religion"
          options={religionOptions}
        />
        <FormField
          type="tel"
          label="Contact Number"
          value={personalInfo.mobile_number}
          maxWidth="md:max-w-[200px]"
          isEditing={canEditField("mobile_number")}
          onChange={handleChange}
          name="mobile_number"
          inputMode="numeric"
          pattern="[0-9]*"
        />
        <FormField
          label="Facebook Profile link"
          value={personalInfo.fb_link}
          maxWidth="md:max-w-[300px]"
          isEditing={canEditField("fb_link")}
          onChange={handleChange}
          name="fb_link"
        />

      </div>
    </div>
  )
}
