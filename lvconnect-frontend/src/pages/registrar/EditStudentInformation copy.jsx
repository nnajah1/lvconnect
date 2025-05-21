
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
import { programOptions, religionOptions, incomeOptions } from "@/utils/enrollmentHelper.js"

const EditStudentInformation = ({ mode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/';
  const { studentId } = useParams();
  const handleBack = () => navigate(from);

  const [profileImage, setProfileImage] = useState("")
  const [isEditing, setIsEditing] = useState(mode ==="edit")


  const [studentData, setStudentData] = useState({
    student_id_number: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    civil_status: "",
    gender: "",
    birth_date: "",
    birth_place: "",
    mobile_number: "",
    religion: "",
    lrn: "",
    fb_link: "",
    student_type: "",
    government_subsidy: "",
    scholarship_status: "",
    last_school_attended: "",
    previous_school_address: "",
    school_type: "",
    academic_awards: "",
    floorUnitBuildingNo: "",
    houseNoStreet: "",
    barangay: "",
    city_municipality: "",
    province: "",
    zip_code: "",
    student_family_info: {
      num_children_in_family: 0,
      birth_order: 0,
      has_sibling_in_lvcc: false,
      mother_first_name: "",
      mother_middle_name: "",
      mother_last_name: "",
      mother_religion: "",
      mother_occupation: "",
      mother_monthly_income: "",
      mother_mobile_number: "",
      father_first_name: "",
      father_middle_name: "",
      father_last_name: "",
      father_religion: "",
      father_occupation: "",
      father_monthly_income: "",
      father_mobile_number: "",
      guardian_first_name: "",
      guardian_middle_name: "",
      guardian_last_name: "",
      guardian_religion: "",
      guardian_occupation: "",
      guardian_monthly_income: "",
      guardian_mobile_number: "",

    }
  });

 const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  if (!studentId) return;

  const loadStudentInfo = async () => {
    setIsLoading(true);
    try {
      const data = await getEnrollee(studentId);
      setStudentData(data);
    } finally {
      setIsLoading(false);
    }
  };

  loadStudentInfo();
}, [studentId]);

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
          mode={mode}
        />

        <ProfileSection
          profileData={studentData}
          profileImage={profileImage}
          onChangeImage={handleChangeImage}
          isEditing={isEditing}
          onChange={handleFieldChange}
        />
      </div>


      <div className="w-full">
        <StudentInfoSection
          personalInfo={studentData}
          isEditing={isEditing}
          onChange={handleFieldChange}
          religionOptions={religionOptions}
        />

        <AddressSection addressInfo={studentData} isEditing={isEditing} onChange={handleFieldChange} />


        <FamilyInfoSection familyInfo={studentData.student_family_info} isEditing={isEditing} onChange={handleFieldChange} />


        <SchoolInfoSection educationInfo={studentData} isEditing={isEditing} onChange={handleFieldChange} />


        <div className="w-full">
          <SectionHeader title="GUARDIAN INFORMATION" />


          <GuardianInfoComponent
            title="Mother's Information"
            guardianData={studentData.student_family_info}
            isEditing={isEditing}
            onChange={handleFieldChange}
            incomeOptions={incomeOptions}
            religionOptions={religionOptions}
            prefix="mother"
          />


          <GuardianInfoComponent
            title="Father's Information"
            guardianData={studentData.student_family_info}
            isEditing={isEditing}
            onChange={handleFieldChange}
            incomeOptions={incomeOptions}
            religionOptions={religionOptions}
            prefix="father"
          />


          <GuardianInfoComponent
            title="Guardian's Information"
            guardianData={studentData.student_family_info}
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

export default EditStudentInformation;