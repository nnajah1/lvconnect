
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
import { createEnrollee, editStudentData, getEnrollee } from "@/services/enrollmentAPI";
import {mapToApiPayload, programOptions, religionOptions, incomeOptions, fields } from "@/utils/enrollmentHelper.js"
import { useUserRole } from "@/utils/userRole";
import { Loader2 } from "@/components/dynamic/loader";
import { toast } from "react-toastify";
import { Breadcrumbs } from "@/components/dynamic/breadcrumbs";

const Enrollees = ({ mode, editType }) => {
  const userRole = useUserRole();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/';
  const isLoadingFromNav = location.state?.isLoading || false;

  const { studentId } = useParams();
  const handleBack = () => navigate(from);

  const [profileImage, setProfileImage] = useState("")
  const [isEditing, setIsEditing] = useState(mode === "edit")

  const [studentData, setStudentData] = useState({
    program_id: 1,
    year_level: 1,
    email: "",
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
      guardian_relationship: "",

    }
  });

  const [isLoading, setIsLoading] = useState(isLoadingFromNav);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!studentId) return;

    const loadStudentInfo = async () => {
      setIsLoading(true);
      try {
        const data = await getEnrollee(studentId);
        setStudentData(data);
        setProfileImage(data.avatar)
      } finally {
        setIsLoading(false);
      }
    };

    loadStudentInfo();
  }, [studentId]);

  if (isLoading) {
    return <Loader2 />;
  }

  // change image
  // const fileInputRef = useRef(null);

  const handleChangeImage = () => {
    // fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    // const file = e.target.files[0];
    // if (file) {
    //   // Preview image by reading as data URL
    //   const reader = new FileReader();
    //   reader.onload = () => {
    //     setProfileImage(reader.result);
    //   };
    //   reader.readAsDataURL(file);

    // }
  };


  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

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
      return editType === "full" || (editType === "partial" && fields.includes(fieldName));
    }

    return false;
  };
  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    // Basic validation: check for empty required fields
    const payload = mapToApiPayload(studentData, studentId, editType);
    const missingFields = Object.entries(payload).filter(
      ([key, value]) => value === undefined || value === null || value.toString().trim() === ""
    );

    // Phone number validation (basic: must be 10 or 11 digits, numbers only)
    const phoneFields = [
      "mobile_number",
      "student_family_info.mother_mobile_number",
      "student_family_info.father_mobile_number",
      "student_family_info.guardian_mobile_number"
    ];

    const invalidPhones = phoneFields.filter(field => {
      // Support nested fields
      const value = field.includes(".")
        ? field.split(".").reduce((obj, k) => (obj ? obj[k] : undefined), studentData)
        : studentData[field];
      // Accept format 09123456789 only (must start with 09 and be 11 digits)
      return value && !/^09\d{9}$/.test(value);
    });

    if (invalidPhones.length > 0) {
      toast.error("Please enter valid phone numbers (11 digits).");
      return;
    }

    if (missingFields.length > 0) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      let response;
      if (editType === "partial") {
        response = await createEnrollee(studentId, payload);
      } else if (editType === "full") {
        response = await editStudentData(studentId, payload);
      } else {
        throw new Error("Unknown edit type.");
      }

      setSuccess("Enrollment submitted successfully!");
      setIsEditing(false);
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Enrollment submission error:", error);

      if (error.response) {
        if (error.response.status === 422) {
          toast.error("Validation failed. Please check your inputs.");
        } else if (error.response.status === 409) {
          toast.error("Student is already enrolled.");
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } else {
        toast.error("Network error. Please try again later.");
      }
    }
  };

  return (
    <div className="flex flex-col items-start w-full min-h-screen">
       <Breadcrumbs name="Student Information"/>
      <div className="w-full">
   
        <ProfileSection
          isEditing={isEditing}
          profileData={studentData}
          profileImage={profileImage}
          onChangeImage={handleChangeImage}
          canEditField={canEditField}
          onChange={handleFieldChange}
          programOptions={programOptions}
          handleFileChange={handleFileChange}
          userRole={userRole}
        />
      </div>


      <div className="w-full">
       <div className="w-full border-b border-gray-300">
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

       </div>

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
        </div>
      </div>
    </div>
  );
}

export default Enrollees;