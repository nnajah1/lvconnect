import React, { useState } from 'react';
import SubmittedForms from './submitted';
import GuidelinesAndPolicies from './guidelines_policies';
import SchoolServices from './school_services';
import Template from './template';
import Pagination from '@/components/pagination';
import '../student_pages/student_styling/studentservice.css';

const StudentServices = () => {
  const [activeTab, setActiveTab] = useState('Templates');

  return (
    <div className="student-service-container">
      {/* Header */}
      <div className="student-service-header">
        <h1 className="student-service-header-title">Student Services</h1>
      </div>

      {/* School Forms */}
      <div className="student-service-school-forms-container">
        <div className="student-service-school-forms-header">
          School Forms
        </div>

        {/* Tabs */}
        <div className="student-service-tabs-container">
          <div className="flex space-x-4">
            <button
              className={`student-service-tab-button ${activeTab === 'Templates' ? 'student-service-tab-button-active' : 'student-service-tab-button-inactive'}`}
              onClick={() => setActiveTab('Templates')}
            >
              Templates
            </button>
            <button
              className={`student-service-tab-button ${activeTab === 'Submitted' ? 'student-service-tab-button-active' : 'student-service-tab-button-inactive'}`}
              onClick={() => setActiveTab('Submitted')}
            >
              Submitted
            </button>
          </div>
        </div>

        {/* Form List */}
        {activeTab === 'Templates' ? (
          <Template />
        ) : (
          <SubmittedForms />
        )}

        {/* Pagination */}
        <div className="student-service-pagination-container">
          <Pagination />
        </div>
      </div>

      {/* School Services Section */}
      <div className="student-service-school-services-section">
        <SchoolServices />
      </div>

      {/* Guidelines and Policies Section */}
      <div className="student-service-guidelines-policies-section">
        <GuidelinesAndPolicies />
      </div>
    </div>
  );
};

export default StudentServices;
