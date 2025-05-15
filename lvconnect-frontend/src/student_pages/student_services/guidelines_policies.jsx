import React from 'react';
import { FaBook } from 'react-icons/fa6';
import { IoIosLock } from 'react-icons/io';

import '../student_styling/student_enrollment_form.css';
const GuidelinesAndPolicies = () => {
  return (
    <div className="guidelines-container">
      <div className="guidelines-header">Guidelines and Policies</div>
      <div className="guidelines-grid">
        <a
          href="https://lvcc.edu.ph/student-handbook"
          target="_blank"
          rel="noopener noreferrer"
          className="guidelines-card"
        >
          <FaBook className="guidelines-icon" />
          <span className="guidelines-title">Student Handbook</span>
        </a>

        <a
          href="https://lvcc.edu.ph/data-privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="guidelines-card"
        >
          <IoIosLock className="guidelines-icon" />
          <span className="guidelines-title">Data Privacy Policy</span>
        </a>
      </div>
    </div>
  );
};

export default GuidelinesAndPolicies;