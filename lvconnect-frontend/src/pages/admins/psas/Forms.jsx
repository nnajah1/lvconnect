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
import { toast } from "react-toastify";
import { changeVisibility } from "@/services/school-formAPI";
import { useNavigate } from "react-router-dom";


const Forms = () => {
  const userRole = useUserRole();
  const { schoolForms, submittedForms, fetchForms, fetchSubmitted } = useForms();
  const [isOpen, setIsOpen] = useState(false)

  const [formItem, setFormItem] = useState(null);
  const [submittedItem, setSubmittedItem] = useState(null);

  const [activeTab, setActiveTab] = useState("form Template");
  const [globalFilter, setGlobalFilter] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchAll();
  }, []);

  const openFormModal = (item) => {
    setFormItem(item);
  };

  const openSubmittedModal = (item) => {
    setSubmittedItem(item);
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

  const handleToggleVisibility = async () => {
    if (!formItem) return;

    try {
      setLoading(true);
      await changeVisibility(formItem.id);
      toast.success("Form visibility updated successfully");
      setFormItem(null);
      fetchForms();
    } catch (err) {
      console.error("Failed to update form visibility", err);
      toast.error("Failed to update form visibility.");
    } finally {
      setLoading(false);
    }
  }

  const tabs = [
    {
      label: "Form Templates",
      value: "form Template",
      content: <DataTable columns={templateColumns} data={schoolForms} globalFilter={globalFilter} isLoading={loading} />
    },
    {
      label: "Submitted Forms",
      value: "submitted form",
      content: <DataTable columns={submittedColumns} data={submittedForms} globalFilter={globalFilter} isLoading={loading} />
    },
  ];
  console.log(submittedForms)
  const navigate = useNavigate();
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        {/* Title and Subtitle */}
        <div>
          <h1 className="text-2xl font-bold text-[#253965]">School Form Management</h1>
          <p className="text-[16px] text-gray-600 mt-1">Create, edit and manage school forms and templates for student use and submission</p>
        </div>
        {/* Search Input */}
        <div>
          <SearchBar value={globalFilter} onChange={setGlobalFilter} />
        </div>
      </div>

      <div className="absolute right-10 ml-2">
        <button
          // onClick={() => {
          //   setIsOpen(true)
          // }}
          onClick={() => navigate('/psas-admin/forms/create-form')}
          className="flex items-center space-x-2 bg-blue-900 text-white px-3 py-1 rounded-md cursor-pointer"
        >
          <CiCirclePlus size={25} />
          <span>Create School Forms</span>
        </button>
      </div>

      <DynamicTabs tabs={tabs} activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-2" />

      {/* Modals */}
      <CreateFormModal
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        fetchForms={fetchForms}
        fetchSubmitted={fetchSubmitted}
      />

      {submittedItem && (
        <UserViewFormModal
          isOpen={!!submittedItem}
          closeModal={() => setSubmittedItem(null)}
          submittedItem={submittedItem}
          fetchSubmitted={fetchSubmitted}
        />
      )}

      {/* Form visibility toggle modal */}
      {formItem && (
        <ConfirmationModal
          isOpen={!!formItem}
          closeModal={() => setFormItem(null)}
          title="Toggle Visibility"
          description="Are you sure you want to change the visibility of this form?"
        >
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mr-2"
            onClick={() => setFormItem(null)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={handleToggleVisibility}
          >
            {loading ? "Loading..." : "Confirm"}
          </button>
        </ConfirmationModal>
      )}

      {/* Delete success modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
        title="The School Form is deleted"
        description="The School Form has been successfully deleted."
      >
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          Manage School Forms
        </button>
      </ConfirmationModal>
    </div>
  );
};
export default Forms;