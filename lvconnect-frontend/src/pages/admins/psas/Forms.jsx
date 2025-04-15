"use client"; 

import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/dynamic/DataTable";
import { getColumns } from "@/components/dynamic/getColumns";
import { getForms, getSubmittedForms } from "@/services/school-formAPI";
import { formActionConditions, formActions, schoolFormTemplateSchema, schoolFormSubmittedSchema } from "@/tableSchemas/schoolForm";
import { CiCirclePlus, CiSearch } from "react-icons/ci";
import CreateFormModal from "@/pages/admins/psas/CreateForm";
import DynamicTabs from "@/components/dynamic/dynamicTabs";

const Forms = ({ userRole }) => {
  const [schoolForms, setSchoolForms] = useState([]);
  const [submittedForms, setSubmittedForms] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false)


  const templateColumns = getColumns({
    userRole,
    schema: schoolFormTemplateSchema,
    actions: formActions,
    actionConditions: formActionConditions,
    context: "formsTemplate"
  });

  const submittedColumns = getColumns({
    userRole,
    schema: schoolFormSubmittedSchema,
    actions: formActions,
    actionConditions: formActionConditions,
    context: "formsSubmited"
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
    const fetchSubmitted = async () => {
      try {
        const res = await getSubmittedForms();
        setSubmittedForms(res.data);
      } catch (err) {
        setError("Error fetching submitted forms");
      }
    };

    fetchForms();
    fetchSubmitted();
  }, []);
  // if (loading) {
  //   return <p>Loading...</p>;
  // }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }


  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">School Forms</h1>
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

      {/* Create Form Button */}
      <div className="relative flex justify-end">

        <button
          onClick={() => {
            setIsOpen(true)
          }}
          className="flex items-center space-x-2 bg-[#2CA4DD] text-white px-3 py-2 rounded-md cursor-pointer"
        >
          <CiCirclePlus size={25} />
          <span>Create School Forms</span>
        </button>
      </div>

      <DynamicTabs
        tabs={[
          {
            label: "Form Templates",
            value: "form Template",
            content:  <DataTable columns={templateColumns} data={schoolForms} />
          },
          {
            label: "Submitted Forms",
            value: "submitted form",
            content: <DataTable columns={submittedColumns} data={submittedForms} />
          },
        ]}
      />

      {/* Modals */}
      <CreateFormModal isOpen={isOpen} closeModal={() => setIsOpen(false)} />
    </div>
  );
}

export default Forms;