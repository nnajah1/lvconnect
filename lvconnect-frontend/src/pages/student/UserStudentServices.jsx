import React, { useState, useEffect, useMemo } from 'react';
import { getForms } from '@/services/school-formAPI';
import { DataTable } from "@/components/dynamic/DataTable";
import { getColumns } from "@/components/dynamic/getColumns";
import { formSubmitActionConditions, formSubmitActions, formActionConditions, formActions, schoolFormTemplateSchema, schoolFormSubmittedSchema } from "@/tableSchemas/userSchoolForm";
import { CiCirclePlus, CiSearch } from "react-icons/ci";
import DynamicTabs from "@/components/dynamic/dynamicTabs";
import UserCreateFormModal from './UserCreateSchoolForm';
import { useForms } from '@/context/FormsContext';
import UserViewFormModal from './UserViewSchoolForm';
import SearchBar from '@/components/dynamic/searchBar';
import { ConfirmationModal } from '@/components/dynamic/alertModal';
import SchoolServices from '@/components/school_forms/school_services';
import GuidelinesAndPolicies from '@/components/school_forms/guidelines_policies';
import '@/styles/studentservice.css';
import { useUserRole } from '@/utils/userRole';

const StudentServices = () => {

  return (
    <div className="container mx-auto px-4">
      {/* School Services Section */}
      <div className="student-service-school-services-section">
        <div className="flex justify-between items-center mb-6">
          {/* Title and Subtitle */}
          <div>
            <h1 className="text-2xl font-bold text-[#253965]">Student Services</h1>
            <p className="text-[16px] text-gray-600 mt-1">Explore and access external systems, guidelines, and policies</p>
          </div>
          {/* Search Input */}
    
        </div>
        <SchoolServices />
      </div>

      {/* Guidelines and Policies Section */}
      <div className="student-service-guidelines-policies-section">
        <GuidelinesAndPolicies />
      </div>


    </div>
  );
}


export default StudentServices;
