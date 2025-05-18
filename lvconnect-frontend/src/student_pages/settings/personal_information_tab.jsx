import React, { useState } from "react";
import FormField from "@/Registrar_screens/studentinfo/form_field";
import "../student_styling/settings.css";

export default function PersonalInformationTab() {
  const [isEditing, setIsEditing] = useState(true);
  const [formData, setFormData] = useState({
    studentNumber: "21-00174APP",
    email: "alonajoiypegarit@student.laverdad.edu.ph",
    firstName: "Alona Joy",
    middleName: "Perdizo",
    lastName: "Pegarit",
    suffix: "",
    birthdate: "2003-06-26",
    birthplace: "VALENZUELA CITY, PHILIPPINES",
    gender: "Female",
    civilStatus: "Single",
    religion: "MCGI"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="profile-wrapper">
      <h2 className="profile-title">Profile</h2>
      <p className="profile-subtitle">Update your photo and personal details.</p>

      {/* Top section with dividers */}
      <div className="profile-section-wrapper">
        <div className="profile-row">
          {/* Profile Picture and Button */}
          <div className="profile-picture-group">
            <img
              src="/path/to/image.jpg"
              alt="Profile"
              className="profile-image"
            />
          </div>

          {/* Student Number */}
          <div className="profile-info-group">
            <FormField
              label="Student Number"
              name="studentNumber"
              value={formData.studentNumber}
              isEditing={isEditing}
              onChange={handleChange}
            />
          </div>

          {/* Email Address */}
          <div className="profile-info-group">
            <FormField
              label="Email address"
              name="email"
              value={formData.email}
              isEditing={isEditing}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Names */}
      <div className="profile-form-grid">
        <FormField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          isEditing={isEditing}
          onChange={handleChange}
        />
        <FormField
          label="Middle Name"
          name="middleName"
          value={formData.middleName}
          isEditing={isEditing}
          onChange={handleChange}
        />
        <FormField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          isEditing={isEditing}
          onChange={handleChange}
        />
        <FormField
          label="Suffix"
          name="suffix"
          value={formData.suffix}
          isEditing={isEditing}
          onChange={handleChange}
        />
      </div>

      {/* Other Details */}
      <div className="profile-form-grid">
        <FormField
          label="Birthdate"
          name="birthdate"
          value={formData.birthdate}
          isEditing={isEditing}
          onChange={handleChange}
        />
        <FormField
          label="Birthplace"
          name="birthplace"
          value={formData.birthplace}
          isEditing={isEditing}
          onChange={handleChange}
        />
        <FormField
          label="Gender"
          name="gender"
          value={formData.gender}
          isEditing={isEditing}
          onChange={handleChange}
          options={["Male", "Female"]}
        />
        <FormField
          label="Civil Status"
          name="civilStatus"
          value={formData.civilStatus}
          isEditing={isEditing}
          onChange={handleChange}
          options={["Single", "Married", "Widowed", "Divorced"]}
        />
        <FormField
          label="Religion"
          name="religion"
          value={formData.religion}
          isEditing={isEditing}
          onChange={handleChange}
          options={["MCGI", "Catholic", "Iglesia ni Cristo", "Other"]}
        />
      </div>
    </div>
  );
}