"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ProfileSection from "@/components/studentinfo/profile"
import StudentInfoSection from "@/components/studentinfo/student_info"
import AddressSection from "@/components/studentinfo/address"
import FamilyInfoSection from "@/components/studentinfo/family_info"
import SchoolInfoSection from "@/components/studentinfo/school_info"
import GuardianInfoComponent from "@/components/studentinfo/guardian_info"
import SectionHeader from "@/components/studentinfo/header_section"
import ActionButtons from "@/components/studentinfo/action"
import { getEnrollee } from "@/services/enrollmentAPI";

const Enrollees = ({ userRole }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/';
  const { studentId } = useParams();
  const handleBack = () => navigate(from);

  const [profileImage, setProfileImage] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  // Sample data for dropdown options
  const incomeOptions = [
    "Below ₱10,000",
    "₱10,000 - ₱20,000",
    "₱20,001 - ₱30,000",
    "₱30,001 - ₱40,000",
    "₱40,001 - ₱50,000",
    "₱50,001 - ₱60,000",
    "₱60,001 - ₱70,000",
    "₱70,001 - ₱80,000",
    "₱80,001 - ₱90,000",
    "₱90,001 - ₱100,000",
    "Above ₱100,000",
  ]

  const religionOptions = [
    "Catholic",
    "Islam",
    "Protestant",
    "Iglesia ni Cristo",
    "Seventh Day Adventist",
    "Born Again Christian",
    "Buddhist",
    "Hindu",
    "Judaism",
    "Other",
  ]

  // Sample data for the student information form
  const [studentData, setStudentData] = useState({
    profile: {
      program: "Bachelor of Science in Information Technology",
      year: "3rd Year",
      studentNumber: "2021-00123",
      email: "student@example.edu.ph",
    },
    personal: {
      firstName: "Juan",
      middleName: "Dela",
      lastName: "Cruz",
      suffix: "Jr.",
      birthdate: "January 15, 2000",
      birthplace: "Manila City",
      gender: "Male",
      civilStatus: "Single",
      religion: "Catholic",
      contactNumber: "09123456789",
      facebookProfile: "facebook.com/juandelacruz",
    },
    address: {
      province: "Metro Manila",
      cityMunicipality: "Quezon City",
      barangay: "Barangay Commonwealth",
      address: "123 Main Street, Block 5 Lot 12",
      zipCode: "1121",
    },
    family: {
      numberOfChildren: "3",
      birthOrder: "1",
      hasSiblingsInLVCC: true,
    },
    education: {
      schoolLastAttended: "National High School",
      schoolAddress: "456 Education Avenue, Quezon City",
      schoolType: "Public",
    },
    mother: {
      firstName: "Maria",
      middleName: "Santos",
      lastName: "Dela Cruz",
      contactNumber: "09187654321",
      occupation: "Teacher",
      monthlyIncome: "₱20,001 - ₱30,000",
      religion: "Catholic",
    },
    father: {
      firstName: "Pedro",
      middleName: "Garcia",
      lastName: "Cruz",
      contactNumber: "09198765432",
      occupation: "Engineer",
      monthlyIncome: "₱30,001 - ₱40,000",
      religion: "Catholic",
    },
    guardian: {
      firstName: "Elena",
      middleName: "Reyes",
      lastName: "Santos",
      contactNumber: "09123456780",
      occupation: "Business Owner",
      monthlyIncome: "₱40,001 - ₱50,000",
      religion: "Catholic",
      relationship: "sister"
    },
  })

    useEffect(() => {
    const loadStudentInfo = async () => {
      const data = await getEnrollee(studentId);
      setStudentData(data);
    };
    loadStudentInfo();
  }, []);

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
    <div className="flex flex-col items-start w-full min-h-screen">

      <div className="w-full p-2 sticky top-0 bg-muted">
       
        <ActionButtons
          isEditing={isEditing}
          handleSave={handleSave}
          handleArchive={handleArchive}
          handleCancel={handleCancel}
          handleEditToggle={handleEditToggle}
          handleBack={handleBack}
        />

        <ProfileSection
          profileData={studentData.profile}
          profileImage={profileImage}
          onChangeImage={handleChangeImage}
          isEditing={isEditing}
          onChange={handleFieldChange}
        />
      </div>


      <div className="w-full">
        <StudentInfoSection
          personalInfo={studentData.personal}
          isEditing={isEditing}
          onChange={handleFieldChange}
          religionOptions={religionOptions}
        />

        <AddressSection addressInfo={studentData.address} isEditing={isEditing} onChange={handleFieldChange} />


        <FamilyInfoSection familyInfo={studentData.family} isEditing={isEditing} onChange={handleFieldChange} />


        <SchoolInfoSection educationInfo={studentData.education} isEditing={isEditing} onChange={handleFieldChange} />


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
  );
}

export default Enrollees;