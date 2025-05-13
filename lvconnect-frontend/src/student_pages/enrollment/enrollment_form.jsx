"use client"

import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import "../student_styling/student_enrollment_form.css"
import StudentInfoSection from "../Registrar_screens/student_information/student_info"
import AddressSection from "../Registrar_screens/student_information/address"
import FamilyInfoSection from "../Registrar_screens/student_information/family_info"
import SchoolInfoSection from "../Registrar_screens/student_information/schoolinfo"
import GuardianInfoComponent from "../Registrar_screens/student_information/guardianinfo"
import SectionHeader from "../Registrar_screens/student_information/header_section"

export default function StudentInformationForm() {
  const [studentData, setStudentData] = useState
  const [isEditing, setIsEditing] = useState(true)
  const [step, setStep] = useState(1)
  const [isAgreed, setIsAgreed] = useState(false)

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

  const handleSubmit = () => {
   
  }

  return (
    <div className="student-form-wrapper">
      <h1 className="student-form-title">Enrollment</h1>

      <div className="student-form-container">
        <div className="student-form-header">School Year: {schoolyear}</div>

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
                <label className="privacy-checkbox-label">
                  <input
                    type="checkbox"
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="privacy-checkbox"
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
            <button className="next-button" onClick={goToNextStep}>
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
      </div>
    </div>
  )
}
