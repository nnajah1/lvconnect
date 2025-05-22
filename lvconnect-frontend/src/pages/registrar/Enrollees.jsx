
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
import { createEnrollee, getEnrollee } from "@/services/enrollmentAPI";
import { programOptions, religionOptions, incomeOptions, partialFieldsAdmin, partialFieldsStudent } from "@/utils/enrollmentHelper.js"
import { useUserRole } from "@/utils/userRole";

const Enrollees = ({ mode, editType }) => {
  const userRole = useUserRole();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/';
  const { studentId } = useParams();
  const handleBack = () => navigate(from);

  const [profileImage, setProfileImage] = useState("")
  const [isEditing, setIsEditing] = useState(mode === "edit")

  const [studentData, setStudentData] = useState({
    program_id: 1,
    year_level: 1,
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
    "floor/unit/building_no": "",
    "house_no/street": "",
    barangay: "",
    city_municipality: "",
    province: "",
    zip_code: "",
    privacy_policy: "",
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
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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

   const handleSave = async () => {
    setError(null);
    setSuccess(null);

    try {
      const payload = mapToApiPayload(studentData);
      const response = await createEnrollee(studentId, payload)
      
      setSuccess("Enrollment submitted successfully!");
      setIsEditing(false);
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Enrollment submission error:", error);

      if (error.response) {
        if (error.response.status === 422) {
          setError("Validation failed. Please check your inputs.");
          // Optionally, extract detailed validation errors here:
          // error.response.data.errors
        } else if (error.response.status === 409) {
          setError("You have already enrolled.");
        } else {
          setError("An error occurred. Please try again.");
        }
      } else {
        setError("Network error. Please try again later.");
      }
    }
  };

  //  const handleSave = () => {
  //   console.log("Saving data:", studentData);
  //   handleSubmit();
  //   setIsEditing(false);
  // };


  const handleArchive = () => {

    console.log("Archiving student record")
    setIsEditing(false)
  }

  const handleCancel = () => {

    setIsEditing(false)
  }

 const handleFieldChange = (name, value) => {
  setStudentData((prev) => {
    const keys = name.split(".");

    if (keys.length === 1) {
      return { ...prev, [name]: value };
    } else {
      const [section, field] = keys;
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      };
    }
  });
};

  const canEditField = (fieldName) => {
    if (!isEditing) return false;

    if (userRole === "registrar") {
      return editType === "full" || (editType === "partial" && partialFieldsAdmin.includes(fieldName));
    }

    if (userRole === "student") {
      return partialFieldsStudent.includes(fieldName);
    }

    return false;
  };

  function mapToApiPayload(data) {
    return {
      user_id: studentId,
      program_id: 1,
      year_level: 1,
      privacy_policy: true, 
      address: {
        building_no: data["floor/unit/building_no"],
        street: data["house_no/street"],
        barangay: data.barangay,
        city: data.city_municipality,
        province: data.province,
        zip: data.zip_code,
      },
      mobile_number: data.mobile_number,
      student_id_number: data.student_id_number,
      fb_link: data.fb_link,
      guardian: {
        first_name: data.student_family_info.guardian_first_name,
        middle_name: data.student_family_info.guardian_middle_name,
        last_name: data.student_family_info.guardian_last_name,
        religion: data.student_family_info.guardian_religion,
        occupation: data.student_family_info.guardian_occupation,
        monthly_income: data.student_family_info.guardian_monthly_income,
        mobile_number: data.student_family_info.guardian_mobile_number,
        relationship: data.student_family_info.guardian_relationship,
      },
      mother: {
        religion: data.student_family_info.mother_religion,
        occupation: data.student_family_info.mother_occupation,
        monthly_income: data.student_family_info.mother_monthly_income,
        mobile_number: data.student_family_info.mother_mobile_number,
      },
      father: {
        religion: data.student_family_info.father_religion,
        occupation: data.student_family_info.father_occupation,
        monthly_income: data.student_family_info.father_monthly_income,
        mobile_number: data.student_family_info.father_mobile_number,
      }
    };
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
          userRole={userRole}
          editType={editType}
        />

        <ProfileSection
          isEditing={isEditing}
          profileData={studentData}
          profileImage={profileImage}
          onChangeImage={handleChangeImage}
          canEditField={canEditField}
          onChange={handleFieldChange}
          programOptions={programOptions}
        />
      </div>


      <div className="w-full">
        <StudentInfoSection
          isEditing={isEditing}
          personalInfo={studentData}
          canEditField={canEditField}
          onChange={handleFieldChange}
          religionOptions={religionOptions}
        />

        <AddressSection addressInfo={studentData}
          canEditField={canEditField} onChange={handleFieldChange} />


        <FamilyInfoSection familyInfo={studentData.student_family_info} 
          isEditing={isEditing}
        canEditField={canEditField} onChange={handleFieldChange} />


        <SchoolInfoSection educationInfo={studentData}
          canEditField={canEditField} onChange={handleFieldChange} />


        <div className="w-full">
          <SectionHeader title="GUARDIAN INFORMATION" />


          <GuardianInfoComponent
            title="Mother's Information"
            guardianData={studentData.student_family_info}
            canEditField={canEditField}
            onChange={handleFieldChange}
            incomeOptions={incomeOptions}
            religionOptions={religionOptions}
            prefix="mother"
          />


          <GuardianInfoComponent
            title="Father's Information"
            guardianData={studentData.student_family_info}
            canEditField={canEditField}
            onChange={handleFieldChange}
            incomeOptions={incomeOptions}
            religionOptions={religionOptions}
            prefix="father"
          />


          <GuardianInfoComponent
            title="Guardian's Information"
            guardianData={studentData.student_family_info}
            canEditField={canEditField}
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