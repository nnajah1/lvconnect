"use client"


import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import ProfileSection from "./../student_information/profile"
import StudentInfoSection from "./../student_information/student_info"
import AddressSection from "./../student_information/address"
import FamilyInfoSection from "./../student_information/family_info"
import SchoolInfoSection from "./../student_information/schoolinfo"
import GuardianInfoComponent from "./../student_information/guardianinfo"
import SectionHeader from "./../student_information/header_section"
import ActionButtons from "./../student_information/actions"

export default function StudentInformationForm() {
  const [profileImage, setProfileImage] = useState("")
  const [isEditing, setIsEditing] = useState(false)


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

  const studentData = {
        profile: {program: "q1"},
        family: "What is your name?",
        address: "text",
        education: "true",
        personal: "w",
        mother: "w",
        father: "w",
        guardian: "w",
      }
  
  const religionOptions = {
      yow: "why"
  }
  const incomeOptions = {
      yow: "why"
  }


  return (
    <div className="flex flex-col items-start w-full min-h-screen bg-[#F3F4F6]">
      {/* Sticky Header Section */}
      <div className="w-full bg-[#F3F4F6] pt-10 px-10">
        {/* Top Navigation */}
        <div className="flex items-center w-full">
          <button className="flex justify-center items-center p-2 border border-[#CED4DA] rounded bg-white">
            <ChevronLeft className="w-4 h-4 text-[#212529]" />
          </button>
          
          {/* Action Buttons Component */}
          <ActionButtons
            isEditing={isEditing}
            onSave={handleSave}
            onArchive={handleArchive}
            onCancel={handleCancel}
            onEditToggle={handleEditToggle}
          />
        </div>

        {/* Profile and Basic Info */}
        <ProfileSection
          profileData={studentData.profile}
          profileImage={profileImage}
          onChangeImage={handleChangeImage}
          isEditing={isEditing}
          onChange={handleFieldChange}
        />
      </div>

      {/* Scrollable Content */}
      <div className="w-full p-10 pt-6">
        {/* Student Information Section */}
        <StudentInfoSection
          personalInfo={studentData.personal}
          isEditing={isEditing}
          onChange={handleFieldChange}
          religionOptions={religionOptions}
        />

       
        <AddressSection addressInfo={studentData.address} isEditing={isEditing} onChange={handleFieldChange} />

     
        <FamilyInfoSection familyInfo={studentData.family} isEditing={isEditing} onChange={handleFieldChange} />

        {/* School Information */}
        <SchoolInfoSection educationInfo={studentData.education} isEditing={isEditing} onChange={handleFieldChange} />

        {/* Guardian Information Section */}
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
