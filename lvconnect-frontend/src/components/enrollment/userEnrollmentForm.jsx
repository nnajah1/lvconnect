

import { useEffect, useRef, useState } from "react"
import { ChevronLeft } from "lucide-react"
import "@/styles/student_enrollment_form.css"
import StudentInfoSection from "@/components/studentinfo/student_info"
import AddressSection from "@/components/studentinfo/address"
import FamilyInfoSection from "@/components/studentinfo/family_info"
import SchoolInfoSection from "@/components/studentinfo/school_info"
import GuardianInfoComponent from "@/components/studentinfo/guardian_info"
import SectionHeader from "@/components/studentinfo/header_section"
import { programOptions, religionOptions, incomeOptions, fields } from "@/utils/enrollmentHelper.js"

import { getEnrollee, submitEnrollment } from "@/services/enrollmentAPI"
import { useUserRole } from "@/utils/userRole"
import ProfileSection from "../studentinfo/profile"
import { formatLabel } from "@/utils/formatDate"
import { toast } from "react-toastify"

export default function EnrollmentForm({ mode, editType, setStudentData, studentData, enrollmentData, setLoading, isExpanded, loadEnroll }) {
  const userRole = useUserRole();
  const [isEditing, setIsEditing] = useState(mode === "edit")
  const [step, setStep] = useState(1)
  const [isAgreed, setIsAgreed] = useState(false)


  const dataPrivacyPolicy = ["lorem"]


  const handleFieldChange = (nameOrEvent, maybeValue) => {
    let name, value;

    // If first arg is an event (has target), extract name and value
    if (nameOrEvent && nameOrEvent.target) {
      const e = nameOrEvent;
      name = e.target.name;
      value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    } else {
      // Otherwise assume (name, value) signature
      name = nameOrEvent;
      value = maybeValue;
    }

    if (typeof name !== "string") {
      console.error("Expected string for field name, got:", name);
      return;
    }

    const keys = name.split(".");

    setStudentData((prev) => {
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

  const goToNextStep = () => setStep((prev) => prev + 1)
const goToPreviousStep = (e) => {
  e.preventDefault();
  if (step === 1) {
    isExpanded(!isExpanded); 
  } else {
    setStep((prev) => prev - 1);
  }
};
  const formRef = useRef(null);
  const handleNextStep = (e) => {
    e.preventDefault();

    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }

    goToNextStep();
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);

    const { student_family_info, address: studentAddressObject, ...restOfStudentData } = studentData;

    const updatedData = {
      ...restOfStudentData, // Spreads top-level fields like program_id, email, address, etc.
      privacy_policy: isAgreed ? 1 : 0,
       address: studentAddressObject || {
        "floor/unit/building_no": "",
        "house_no/street": "",
        barangay: "",
        city_municipality: "",
        province: "",
        zip_code: "",
      },
      has_sibling_in_lvcc: student_family_info.has_sibling_in_lvcc,
      // Move fields from student_family_info to the top level
      num_children_in_family: student_family_info.num_children_in_family,
      birth_order: student_family_info.birth_order,

      // Create the 'mother' object as expected by the backend
      mother: {
        first_name: student_family_info.mother_first_name,
        middle_name: student_family_info.mother_middle_name,
        last_name: student_family_info.mother_last_name,
        religion: student_family_info.mother_religion,
        occupation: student_family_info.mother_occupation,
        monthly_income: student_family_info.mother_monthly_income,
        mobile_number: student_family_info.mother_mobile_number,
      },

      // Create the 'father' object as expected by the backend
      father: {
        first_name: student_family_info.father_first_name,
        middle_name: student_family_info.father_middle_name,
        last_name: student_family_info.father_last_name,
        religion: student_family_info.father_religion,
        occupation: student_family_info.father_occupation,
        monthly_income: student_family_info.father_monthly_income,
        mobile_number: student_family_info.father_mobile_number,
      },

      // Create the 'guardian' object as expected by the backend
      guardian: {
        first_name: student_family_info.guardian_first_name,
        middle_name: student_family_info.guardian_middle_name,
        last_name: student_family_info.guardian_last_name,
        religion: student_family_info.guardian_religion,
        occupation: student_family_info.guardian_occupation,
        monthly_income: student_family_info.guardian_monthly_income,
        mobile_number: student_family_info.guardian_mobile_number,
        relationship: student_family_info.guardian_relationship,
      },
    };

    // Optional: Log the data to be sent to verify its structure
    // console.log("Data being sent to backend:", JSON.stringify(updatedData, null, 2));

    await submitEnrollment(updatedData);
    await loadEnroll();
    isExpanded(!isExpanded); 
    toast.success("Enrollment submitted successfully!");

  } catch (error) {
    if (error.response?.data?.errors) {
      console.error("Validation errors:", error.response.data.errors);
      // Construct a more detailed error message for the alert
      let errorMessages = "Please fill out all required fields correctly:\n";
      for (const field in error.response.data.errors) {
        errorMessages += `\n- ${error.response.data.errors[field].join(', ')}`;
      }
      toast.error(errorMessages);
    } else {
      console.error("Submission error:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  } finally {
    setLoading(false);
  }
};

  const canEditField = (fieldName) => {
    if (!isEditing) return false;

    if (userRole === "student") {
      return fields.includes(fieldName);
    }

    return false;
  };

  return (
    <form ref={formRef}>
      <div className="student-form-content">

        {step === 1 && (
          <>
            <div>
              <div className="student-semester">{formatLabel(enrollmentData.semester)}</div>
              <div className="student-scholarship">Scholarship Status: {studentData.scholarship_status}</div>
            </div>
            <ProfileSection
              isEditing={isEditing}
              profileData={studentData}
              canEditField={canEditField}
              onChange={handleFieldChange}
              programOptions={programOptions}
              userRole={userRole}
            />

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

          </>
        )}

        {step === 2 && (
          <div className="guardian-section">
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
        )}

        {step === 3 && (
          <div className="privacy-section">
            <h2 className="privacy-title">Data Privacy Policy</h2>
            <div className="privacy-texts">
              {dataPrivacyPolicy.length > 0 ? (
                dataPrivacyPolicy.map((paragraph, index) => (
                  <p key={index} className="privacy-text">{paragraph}</p>
                ))
              ) : (
                <p className="privacy-text italic">No Data Privacy Policy provided.</p>
              )}
            </div>

            <div className="privacy-checkbox-wrapper">
              <label className="privacy-checkbox-label gap-2">
                <input
                  type="checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="privacy-checkbox m-auto"
                />
                <span className="privacy-agreement-text">I have read and understand the Data Privacy Policy</span>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="step-navigation">
       <button
          className="step-navigation-button"
          onClick={goToPreviousStep}
        >
          <ChevronLeft size={16} />
          Go back
        </button>

        {step < 3 ? (
          <button
            className="next-button"
            onClick={handleNextStep}
          >
            Next
          </button>
        ) : (
          <button
            className={`submit-button ${isAgreed ? "submit-enabled" : "submit-disabled"}`}
            onClick={handleSubmit}
            disabled={!isAgreed}
          >
            Enroll
          </button>
        )}

      </div>

    </form>
  )
}
