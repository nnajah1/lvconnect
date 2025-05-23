

import { useEffect, useRef, useState } from "react"
import { ChevronLeft } from "lucide-react"
import "@/styles/student_enrollment_form.css"
import StudentInfoSection from "@/components/studentinfo/student_info"
import AddressSection from "@/components/studentinfo/address"
import FamilyInfoSection from "@/components/studentinfo/family_info"
import SchoolInfoSection from "@/components/studentinfo/school_info"
import GuardianInfoComponent from "@/components/studentinfo/guardian_info"
import SectionHeader from "@/components/studentinfo/header_section"
import { programOptions, religionOptions, incomeOptions, partialFieldsStudent } from "@/utils/enrollmentHelper.js"

import { getEnrollee } from "@/services/enrollmentAPI"
import { useUserRole } from "@/utils/userRole"

export default function EnrollmentForm({ mode, editType }) {
  const userRole = useUserRole();
  const [isEditing, setIsEditing] = useState(mode === "edit")
  const [step, setStep] = useState(1)
  const [isAgreed, setIsAgreed] = useState(false)

  const schoolyear = () => {
    // "2025-2026"
  }
  const semester = () => {
    // "1st semester"
  }
  const scholarshipStatus = () => {
    // "pending"
  }

  const dataPrivacyPolicy = () => {
    // "lorem"
  }


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
      has_sibling_in_lvcc: true,
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


  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const res = await getEnrollee(studentId);
        const data = res.data;

        setStudentData((prev) => ({
          ...prev,
          mobile_number: data.mobile_number,
          address: {
            building_no: data["floor/unit/building_no"],
            street: data["house_no/street"],
            barangay: data.barangay,
            city: data.city_municipality,
            province: data.province,
            zip: data.zip_code,
          },
        }));

      } catch (err) {
        console.error("Failed to fetch student info", err);
      }
    };

    fetchStudentInfo();
  }, []);

  const handleFieldChange = (section, field, value) => {
    setStudentData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }))
  }

  const goToNextStep = () => setStep((prev) => prev + 1)
  const goToPreviousStep = () => setStep((prev) => prev - 1)

  const formRef = useRef(null);
  const handleNextStep = (e) => {
    e.preventDefault();

    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }

    goToNextStep();
  };


  const handleSubmit = async () => {
    try {
      const res = await submitEnrollment(studentData);
      alert("Enrollment submitted successfully!");
    } catch (error) {
      if (error.response?.data?.errors) {
        console.log("Validation errors", error.response.data.errors);
        alert("Please fill out all fields.");
      } else {
        alert("Something went wrong. Try again later.");
      }
    }
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

  return (
        <form ref={formRef}>
          <div className="student-form-content">

            {step === 1 && (
              <>
                <div>
                  <div className="student-semester">{semester}</div>
                  <div className="student-scholarship">Scholarship Status: {scholarshipStatus}</div>
                </div>

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
              disabled={step === 1}
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
                className={`submit-button ${studentData.privacy_policy ? "submit-enabled" : "submit-disabled"}`}
                onClick={handleSubmit}
                disabled={!studentData.privacy_policy}
              >
                Enroll
              </button>
            )}

          </div>

        </form>
  )
}
