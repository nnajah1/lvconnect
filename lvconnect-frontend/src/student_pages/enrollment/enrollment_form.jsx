"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft } from "lucide-react"
import "../student_styling/student_enrollment_form.css"
import StudentInfoSection from "@/components/studentinfo/student_info"
import AddressSection from "@/components/studentinfo/address"
import FamilyInfoSection from "@/components/studentinfo/family_info"
import SchoolInfoSection from "@/components/studentinfo/school_info"
import GuardianInfoComponent from "@/components/studentinfo/guardian_info"
import SectionHeader from "@/components/studentinfo/header_section"

export default function StudentInformationFormk() {
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
    program_id: "",
    year_level: "",
    privacy_policy: false,
    enrollment_schedule_id: "",
    contact_number: "",
    profile: {
      program: "Bachelor of Science in Information Technology",
      year: "3rd Year",
      studentNumber: "2021-00123",
      email: "student@example.edu.ph",
    },
    personal: {
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
      building_no: "",
      street: "",
      barangay: "",
      city: "",
      province: "",
      zip: "",
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
      contactNumber: "",
      occupation: "",
      monthlyIncome: "",
      religion: "",
    },
    father: {
      contactNumber: "",
      occupation: "",
      monthlyIncome: "",
      religion: "",
    },
    guardian: {
      first_name: "",
      middle_name: "",
      last_name: "",
      religion: "",
      occupation: "",
      monthly_income: "",
      mobile_number: "",
      relationship: "",
    },
  })

  const [isEditing, setIsEditing] = useState(true)
  const [step, setStep] = useState(1)
  const [isAgreed, setIsAgreed] = useState(false)

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const res = await studentInfo(); // You should have this route
        const data = res.data;

        setStudentData((prev) => ({
          ...prev,
          contact_number: data.mobile_number,
          address: {
            building_no: data["floor/unit/building_no"],
            street: data["house_no/street"],
            barangay: data.barangay,
            city: data.city_municipality,
            province: data.province,
            zip: data.zip_code,
          },
          // optionally load guardian info too
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

  const isStepValid = (step) => {
    const requiredFields = {
      1: ["program_id", "year_level", "enrollment_schedule_id"],
      2: ["contact_number", ...Object.keys(studentData.address)],
      3: [...Object.keys(studentData.guardian), "privacy_policy"],
    };

    return requiredFields[step].every((field) => {
      if (field.includes(".")) return true; // Skip nested checks for now
      const value = studentData[field];
      return value !== "" && value !== null && value !== undefined;
    });
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

  return (
    <div className="student-form-wrapper">
      <h1 className="student-form-title">Enrollment</h1>

      <div className="student-form-container">
        <div className="student-form-header">School Year: {schoolyear}</div>

        <form ref={formRef}>
          <div className="student-form-content">

            {step === 1 && (
              <>
                <div>
                  <div className="student-semester">{semester}</div>
                  <div className="student-scholarship">Scholarship Status: {scholarshipStatus}</div>
                </div>

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
              </>
            )}

            {step === 2 && (
              <div className="guardian-section">
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
                onClick={() => {
                  if (!isStepValid(step)) {
                    alert("Please complete all required fields before proceeding.");
                    return;
                  }
                  goToNextStep();
                }}
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
      </div>
    </div>
  )
}
