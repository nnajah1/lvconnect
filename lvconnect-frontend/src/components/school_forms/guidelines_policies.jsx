import React from 'react';
import { FaBook } from 'react-icons/fa6';
import { IoIosLock } from 'react-icons/io';
import '@/styles/studentservice.css';

const GuidelinesAndPolicies = () => {
  return (
    <div className="guidelines-container">
      <div className="guidelines-header">Guidelines and Policies</div>
      <div className="guidelines-grid">
        <a
          href="/coming-soon"
          target="_blank"
          rel="noopener noreferrer"
          className="guidelines-card"
        >
          <FaBook className="guidelines-icon" />
          <span className="guidelines-title">Student Handbook</span>
        </a>

        <a
          href="/privacy-policy"
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