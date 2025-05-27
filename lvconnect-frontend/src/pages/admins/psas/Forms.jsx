;

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
import SearchBar from "@/components/dynamic/searchBar";
import { ConfirmationModal } from "@/components/dynamic/alertModal";
import { useUserRole } from "@/utils/userRole";

const Forms = () => {
  const userRole = useUserRole();
  const { schoolForms, submittedForms , fetchForms, fetchSubmitted } = useForms();
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false)

  const [formItem, setFormItem] = useState(null);
  const [submittedItem, setSubmittedItem] = useState(null);

  const [activeTab, setActiveTab] = useState("form Template");
  const [globalFilter, setGlobalFilter] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

     useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
       try {
          await fetchForms();
          await fetchSubmitted();
        } catch (err) {
          console.error("Failed to load forms", err);
          toast.error("Failed to load forms.");
        } finally {
          setLoading(false); 
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
      content: <DataTable columns={templateColumns} data={schoolForms} globalFilter={globalFilter} isLoading={loading}/>
    },
    {
      label: "Submitted Forms",
      value: "submitted form",
      content: <DataTable columns={submittedColumns} data={submittedForms} globalFilter={globalFilter} isLoading={loading} />
    },
  ];

  return (
    <div className="container mx-auto p-4">
      {/* {error && <p>{error}</p>} */}
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
        className="mb-2" />

      {/* Modals */}
      <CreateFormModal isOpen={isOpen} closeModal={() => setIsOpen(false)} fetchForms={fetchForms} fetchSubmitted={fetchSubmitted} />

      {formItem && (
        <EditFormModal
          isOpen={!!formItem}
          closeModal={() => setFormItem(false)}
          formItem={formItem}
          onDeleteModal={() => setIsSuccessModalOpen(true)}
          onSuccessModal={() => setIsSuccessModalOpen(false)}
        />
      )}
      {submittedItem && (
        <UserViewFormModal
          isOpen={!!submittedItem}
          closeModal={() => setSubmittedItem(false)}
          submittedItem={submittedItem}
        />
      )}

        <ConfirmationModal
                isOpen={isSuccessModalOpen}
                closeModal={() => setIsSuccessModalOpen(false)}
                title="The School Form is created"
                description="The School Form has been successfully created."
            >
                <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => setIsSuccessModalOpen(false)}
                >
                    Manage School Forms
                </button>

            </ConfirmationModal>


    </div>
  );
}

export default Forms;