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

  const [isLoading, setIsLoading] = useState(true);
  const [formItem, setFormItem] = useState(null);
  const [submittedItem, setSubmittedItem] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        await fetchForms();
        await fetchSubmitted();
      } catch (err) {
        console.error("Failed to load forms", err);
        toast.error("Failed to load forms.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

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
      content: <DataTable columns={templateColumns} data={schoolForms} globalFilter={globalFilter} isLoading={isLoading} />
    },
    {
      label: "Submitted Forms",
      value: "submitted form",
      content: <DataTable columns={submittedColumns} data={submittedForms} globalFilter={globalFilter} isLoading={isLoading} />
    },
  ], [schoolForms, submittedForms, globalFilter, templateColumns, submittedColumns]);


  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
             {/* Title and Subtitle */}
             <div>
               <h1 className="text-2xl font-bold text-[#253965]">School Forms</h1>
               <p className="text-sm text-gray-600 mt-1">Submit, track and download school forms for various student request and services</p>
             </div>
             {/* Search Input */}
             <div>
               <SearchBar value={globalFilter} onChange={setGlobalFilter} />
             </div>
           </div>



        <DynamicTabs tabs={tabs} activeTab={activeTab}
          onTabChange={setActiveTab}
          className="p-6" />


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
          className="px-4 py-2  bg-blue-900 hover:bg-blue-800 text-white "
          onClick={() => setIsSuccessModalOpen(false)}
        >
          Back to School Forms
        </button>
      </ConfirmationModal>


    </div>
  );
}


export default VisibleForms;
