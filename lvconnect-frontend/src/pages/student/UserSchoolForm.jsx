import React, { useState, useEffect } from 'react';
import { getForms } from '@/services/school-formAPI';
import { DataTable } from "@/components/dynamic/DataTable";
import { getColumns } from "@/components/dynamic/getColumns";
import { formActionConditions, formActions, schoolFormTemplateSchema, schoolFormSubmittedSchema } from "@/tableSchemas/userSchoolForm";
import { CiCirclePlus, CiSearch } from "react-icons/ci";
import CreateFormModal from "@/pages/admins/psas/CreateForm";
import DynamicTabs from "@/components/dynamic/dynamicTabs";

const VisibleForms = ({ userRole }) => {
  const [schoolForms, setSchoolForms] = useState([]);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false)
  
    const templateColumns = getColumns({
      userRole,
      schema: schoolFormTemplateSchema,
      actions: formActions,
      actionConditions: formActionConditions,
      context: "UserFormsTemplate",
    });
  
    const submittedColumns = getColumns({
      userRole,
      schema: schoolFormSubmittedSchema,
      actions: formActions,
      actionConditions: formActionConditions, 
      context: "UserFormsSubmitted",
    });
  
    useEffect(() => {
      const fetchForms = async () => {
        try {
          const response = await getForms();
          setSchoolForms(response.data);
        } catch (err) {
          setError('Error fetching forms');
        }
      };
  
      fetchForms();
    }, []);
  
    if (error) {
      return <p className="text-red-500">Error: {error}</p>;
    }
  
  
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-4">School Services</h1>
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
  
        <DynamicTabs
          tabs={[
            {
              label: "Form Templates",
              value: "Form Template",
              content:  <DataTable columns={templateColumns} data={schoolForms} context="UserFormsTemplate" />
            },
            {
              label: "Submitted Forms",
              value: "submitted form",
              content: <DataTable columns={submittedColumns} data={schoolForms} context="UserFormsSubmitted" />
            },
          ]}
        />
        </div>
  
        {/* Modals */}
        <CreateFormModal isOpen={isOpen} closeModal={() => setIsOpen(false)} />
      </div>
    );
  }
  

export default VisibleForms;
