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

const VisibleForms = () => {
  const userRole = useUserRole();
  const { schoolForms, submittedForms, fetchForms, fetchSubmitted } = useForms();
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("form Template");
  const [globalFilter, setGlobalFilter] = useState("");

  const [formItem, setFormItem] = useState(null);
  const [submittedItem, setSubmittedItem] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

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

  const tabs = useMemo(() => [
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
  ], [schoolForms, submittedForms, globalFilter, templateColumns, submittedColumns]);


  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Student Services</h1>
        {/* Search Input */}
        <div><SearchBar value={globalFilter} onChange={setGlobalFilter} /></div>
      </div>

      <div className="student-service-school-forms-container">
        <div className="student-service-school-forms-header">
          School Forms
        </div>

        <DynamicTabs tabs={tabs} activeTab={activeTab}
          onTabChange={setActiveTab}
          className="p-6" />
      </div>

      {/* School Services Section */}
      <div className="student-service-school-services-section">
        <SchoolServices />
      </div>

      {/* Guidelines and Policies Section */}
      <div className="student-service-guidelines-policies-section">
        <GuidelinesAndPolicies />
      </div>


      {/* Modals */}
      {formItem && (
        <UserCreateFormModal
          isOpen={!!formItem}
          closeModal={() => setFormItem(null)}
          formItem={formItem}
          fetchForms={fetchForms}
          setIsSuccessModalOpen={setIsSuccessModalOpen}
        />
      )}

      {submittedItem && (
        <UserViewFormModal
          isOpen={!!submittedItem}
          closeModal={() => setSubmittedItem(null)}
          submittedItem={submittedItem}
          fetchSubmitted={fetchSubmitted}
          setIsSuccessModalOpen={setIsSuccessModalOpen}
        />
      )}

      <ConfirmationModal
        isOpen={isSuccessModalOpen}
        closeModal={() => setIsSuccessModalOpen(false)}
        title="The School Form is updated"
        description="The School Form has been successfully updated."
      >
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => setIsSuccessModalOpen(false)}
        >
          Back to School Forms
        </button>
      </ConfirmationModal>


    </div>
  );
}


export default VisibleForms;
