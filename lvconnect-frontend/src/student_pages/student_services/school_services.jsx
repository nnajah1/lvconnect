import React from 'react';
import { FcGraduationCap } from 'react-icons/fc';
import { GiOpenBook, GiNotebook } from 'react-icons/gi';
import '../student_styling/student_enrollment_form.css';

const SchoolServices = () => {
  return (
    <div className="school-service-container">
      <div className="school-service-header">School Services</div>
      <div className="school-service-grid">
        <a
          href="https://lms.laverdad.edu.ph/login/"
          target="_blank"
          rel="noopener noreferrer"
          className="school-service-card"
        >
          <FcGraduationCap className="school-service-icon" />
          <span className="school-service-title">
            LVCC<br />Learning Management System
          </span>
        </a>

        <a
          href="https://www.lvcclibrary.digital/"
          target="_blank"
          rel="noopener noreferrer"
          className="school-service-card"
        >
          <GiOpenBook className="school-service-icon custom-color-icon" />
          <span className="school-service-title">
            LVCC<br />Digital Library
          </span>
        </a>

        <a
          href="https://fpe.lvcc.edu.ph"
          target="_blank"
          rel="noopener noreferrer"
          className="school-service-card"
        >
          <GiNotebook className="school-service-icon custom-color-icon" />
          <span className="school-service-title">
            LVCC<br />Faculty Performance Evaluation
          </span>
        </a>

        <div></div>
      </div>
    </div>
  );
};

export default SchoolServices;
