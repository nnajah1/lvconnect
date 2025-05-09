import React, { useState, useEffect } from 'react';
import { getForms } from '@/services/school-formAPI';
import { DataTable } from "@/components/dynamic/DataTable";
import { getColumns } from "@/components/dynamic/getColumns";
import {formSubmitActionConditions, formSubmitActions, formActionConditions, formActions, schoolFormTemplateSchema, schoolFormSubmittedSchema } from "@/tableSchemas/userSchoolForm";
import { CiCirclePlus, CiSearch } from "react-icons/ci";
import DynamicTabs from "@/components/dynamic/dynamicTabs";
import UserCreateFormModal from './UserCreateSchoolForm';
import { useForms } from '@/context/FormsContext';
import UserViewFormModal from './UserViewSchoolForm';

const VisibleForms = ({ userRole }) => {
  const { schoolForms, submittedForms, fetchForms,fetchSubmitted } = useForms();
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false)
  
    
      const [formItem, setFormItem] = useState(null);
      const [submittedItem, setSubmittedItem] = useState(null);
    
      const openFormModal = (item) => {
        setFormItem(item); // full item, not just id
      };
      const openSubmittedModal = (item) => {
        setSubmittedItem(item); // full item, not just id
      };
    const actions = formActions(openFormModal);
  
    const templateColumns = getColumns({
      userRole,
      schema: schoolFormTemplateSchema,
      actions: actions,
      actionConditions: formActionConditions,
      context: "UserFormsTemplate",
      openFormModal
    });
    const submitActions = formSubmitActions(openSubmittedModal);
    const submittedColumns = getColumns({
      userRole,
      schema: schoolFormSubmittedSchema,
      actions: submitActions,
      actionConditions: formSubmitActionConditions, 
      context: "UserFormsSubmitted",
    });
  
   const tabs = [
       {
         label: "Form Templates",
         value: "form Template",
         content: <DataTable columns={templateColumns} data={schoolForms} />
       },
       {
         label: "Submitted Forms",
         value: "submitted form",
         content: <DataTable columns={submittedColumns} data={submittedForms} />
       },
      ];
  
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-4">Student Services</h1>
          {/* Search Input */}
          <div className="relative w-96">
            <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 rounded-md pl-10 pr-4 py-2 w-full outline-none focus:ring-2 focus:ring-gray-50"
            />
          </div>
        </div>
  
        <div>
        <span>School Forms</span>

        </div>

        <DynamicTabs tabs={tabs} />
        
        {/* Modals */}
        {formItem && (
          <UserCreateFormModal
            isOpen={!!formItem}
            closeModal={() => setFormItem(false)}
            formItem={formItem}
            fetchForms={fetchForms} 
          />
        )}

        {submittedItem && (
          <UserViewFormModal
            isOpen={!!submittedItem}
            closeModal={() => setSubmittedItem(false)}
            submittedItem={submittedItem}
          />
        )}

      </div>
    );
  }
  

export default VisibleForms;
