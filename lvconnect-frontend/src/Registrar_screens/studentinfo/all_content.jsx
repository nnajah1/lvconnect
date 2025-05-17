"use client"

import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import ProfileSection from "./profile"
import StudentInfoSection from ".student_info"
import AddressSection from ".address"
import FamilyInfoSection from ".family_info"
import SchoolInfoSection from ".school_info"
import GuardianInfoComponent from ".guardian_info"
import SectionHeader from ".header_section"
import ActionButtons from ".action"

export default function StudentInformationForm() {
  const [profileImage, setProfileImage] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  const [studentData, setStudentData] = useState({
    profile: {
      name: "Juan Dela Cruz",
      lrn: "123456789012",
      gradeSection: "Grade 12 - ICT",
    },
    personal: {
      firstName: "Juan",
      middleName: "Santos",
      lastName: "Dela Cruz",
      suffix: "Jr.",
      birthdate: "2005-05-15",
      birthplace: "Manila",
      gender: "Male",
      civilStatus: "Single",
      religion: "Catholic",
      contactNumber: "09171234567",
      facebookProfile: "https://facebook.com/juandelacruz",
    },
    address: {
      street: "123 Mabuhay St.",
      barangay: "San Isidro",
      city: "Quezon City",
      province: "Metro Manila",
      zipCode: "1100",
    },
    family: {
      siblings: 3,
      birthOrder: "2nd",
      parentsStatus: "Married",
    },
    education: {
      previousSchool: "LVCC Junior High",
      lastYearAttended: "2023",
      awards: "With Honors",
    },
    mother: {
      fullName: "Maria Dela Cruz",
      occupation: "Housewife",
      income: "Less than ₱10,000",
      religion: "Catholic",
    },
    father: {
      fullName: "Jose Dela Cruz",
      occupation: "Driver",
      income: "₱10,000 - ₱20,000",
      religion: "Catholic",
    },
    guardian: {
      fullName: "Ana Santos",
      occupation: "Teacher",
      income: "₱20,000 - ₱30,000",
      religion: "Christian",
    },
  })

  const religionOptions = ["Catholic", "Christian", "Muslim", "Others"]
  const incomeOptions = ["Less than ₱10,000", "₱10,000 - ₱20,000", "₱20,000 - ₱30,000", "₱30,000 and above"]

  const handleChangeImage = () => {
    console.log("Change image clicked")
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  const handleSave = () => {
    console.log("Saving data:", studentData)
    setIsEditing(false)
  }

  const handleArchive = () => {
    console.log("Archiving student record")
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleFieldChange = (section, field, value) => {
    setStudentData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }))
  }

  return (
    <div className="flex flex-col items-start w-full min-h-screen bg-[#F3F4F6]">
      <div className="w-full bg-[#F3F4F6] pt-10 px-10">
        <div className="flex items-center w-full">
          <button className="flex justify-center items-center p-2 border border-[#CED4DA] rounded bg-white">
            <ChevronLeft className="w-4 h-4 text-[#212529]" />
          </button>

          <ActionButtons
            isEditing={isEditing}
            onSave={handleSave}
            onArchive={handleArchive}
            onCancel={handleCancel}
            onEditToggle={handleEditToggle}
          />
        </div>

        <ProfileSection
          profileData={studentData.profile}
          profileImage={profileImage}
          onChangeImage={handleChangeImage}
          isEditing={isEditing}
          onChange={handleFieldChange}
        />
      </div>

      <div className="w-full p-10 pt-6">
        <StudentInfoSection
          personalInfo={studentData.personal}
          isEditing={isEditing}
          onChange={handleFieldChange}
          religionOptions={religionOptions}
        />

        <AddressSection
          addressInfo={studentData.address}
          isEditing={isEditing}
          onChange={handleFieldChange}
        />

        <FamilyInfoSection
          familyInfo={studentData.family}
          isEditing={isEditing}
          onChange={handleFieldChange}
        />

        <SchoolInfoSection
          educationInfo={studentData.education}
          isEditing={isEditing}
          onChange={handleFieldChange}
        />

        <div className="w-full">
          <SectionHeader title="GUARDIAN INFORMATION" />
          <GuardianInfoComponent
            title="Mother's Information"
            guardianData={studentData.mother}
            isEditing={isEditing}
            onChange={handleFieldChange}
            incomeOptions={incomeOptions}
            religionOptions={religionOptions}
            prefix="mother"
          />
          <GuardianInfoComponent
            title="Father's Information"
            guardianData={studentData.father}
            isEditing={isEditing}
            onChange={handleFieldChange}
            incomeOptions={incomeOptions}
            religionOptions={religionOptions}
            prefix="father"
          />
          <GuardianInfoComponent
            title="Guardian's Information"
            guardianData={studentData.guardian}
            isEditing={isEditing}
            onChange={handleFieldChange}
            incomeOptions={incomeOptions}
            religionOptions={religionOptions}
            prefix="guardian"
          />
        </div>
      </div>
    </div>
  )
}
