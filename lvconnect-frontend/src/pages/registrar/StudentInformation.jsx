
import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/dynamic/DataTable";
import { getColumns } from "@/components/dynamic/getColumns";
import { formActionConditions, formActions, schoolFormTemplateSchema, schoolFormSubmittedSchema, formSubmitActions, formSubmitActionConditions } from "@/tableSchemas/schoolForm";
import { CiCirclePlus, CiSearch } from "react-icons/ci";
import CreateFormModal from "@/pages/admins/psas/CreateForm";
import DynamicTabs from "@/components/dynamic/dynamicTabs";
import EditFormModal from "@/pages/admins/psas/EditForm";
import UserViewFormModal from "@/pages/student/UserViewSchoolForm";
import SearchBar from "@/components/dynamic/searchBar";

const StudentInformation = ({ userRole }) => {
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false)

  const [formItem, setFormItem] = useState(null);
  const [submittedItem, setSubmittedItem] = useState(null);
  const [activeTab, setActiveTab] = useState("form Template");
  const [globalFilter, setGlobalFilter] = useState("");

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
      content: <DataTable columns={templateColumns} data={schoolForms} globalFilter={globalFilter} />
    },
    {
      label: "Submitted Forms",
      value: "submitted form",
      content: <DataTable columns={submittedColumns} data={submittedForms} globalFilter={globalFilter} />
    },
  ];

  return (
    <div className="container mx-auto p-4">
      {error && <p>{error}</p>}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">School Forms</h1>
        {/* Search Input */}
        <div><SearchBar value={globalFilter} onChange={setGlobalFilter} /></div>
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

      <DynamicTabs tabs={tabs} activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-2"/>

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

export default StudentInformation;