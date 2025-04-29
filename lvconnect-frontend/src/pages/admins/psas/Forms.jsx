"use client";

import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/dynamic/DataTable";
import { getColumns } from "@/components/dynamic/getColumns";
import { formActionConditions, formActions, schoolFormTemplateSchema, schoolFormSubmittedSchema, formSubmitActions, formSubmitActionConditions } from "@/tableSchemas/schoolForm";
import { CiCirclePlus, CiSearch } from "react-icons/ci";
import CreateFormModal from "@/pages/admins/psas/CreateForm";
import DynamicTabs from "@/components/dynamic/dynamicTabs";
import EditFormModal from "@/pages/admins/psas/EditForm";
import { useForms } from '@/context/FormsContext';
import UserViewFormModal from "@/pages/student/UserViewSchoolForm";

const Forms = ({ userRole }) => {
  const { schoolForms, submittedForms, error, fetchForms, fetchSubmitted } = useForms();
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
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
    actions,
    actionConditions: formActionConditions,
    context: "formstemplate",
    openFormModal,
  });
  const submitActions = formSubmitActions(openSubmittedModal);
  const submittedColumns = getColumns({
    userRole,
    schema: schoolFormSubmittedSchema,
    actions: submitActions,
    actionConditions: formSubmitActionConditions,
    context: "formssubmited",
    openSubmittedModal
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
      {error && <p>{error}</p>}
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

      <DynamicTabs tabs={tabs} />

      {/* Modals */}
      <CreateFormModal isOpen={isOpen} closeModal={() => setIsOpen(false)} fetchForms={fetchForms} fetchSubmitted={fetchSubmitted} />

      {formItem && (
        <EditFormModal
          isOpen={!!formItem}
          closeModal={() => setFormItem(false)}
          formItem={formItem}
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

export default Forms;