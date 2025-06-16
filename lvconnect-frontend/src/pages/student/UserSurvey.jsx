import React, { useState, useEffect } from 'react';
import { DataTable } from "@/components/dynamic/DataTable";
import { getColumns } from "@/components/dynamic/getColumns";
import { surveyActionConditions, surveyActions, surveyTemplateSchema } from "@/tableSchemas/userSurvey";
import { CiCirclePlus, CiSearch } from "react-icons/ci";
import UserCreateSurveyModal from './UserCreateSurvey';
import { getSurveys } from '@/services/surveyAPI';
import SearchBar from '@/components/dynamic/searchBar';
import { useUserRole } from '@/utils/userRole';
import { ConfirmationModal } from '@/components/dynamic/alertModal';

const VisibleSurveys = () => {
  const userRole = useUserRole();
  const [survey, setSurvey] = useState([]);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false)
  const [formItem, setFormItem] = useState(null);
  const [sorting, setSorting] = useState([])
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const loadSurveys = async () => {
    setLoading(true);
    try {
      const data = await getSurveys();
      setSurvey(data);
    } catch (err) {
      console.error("Failed to load surveys", err);
      toast.error("Failed to load surveys.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSurveys();
  }, []);

  const openFormModal = (item) => {
    setFormItem(item); // full item, not just id
    console.log(item)
  };

  const actions = surveyActions(openFormModal);

  const Columns = getColumns({
    userRole,
    schema: surveyTemplateSchema,
    actions: actions,
    actionConditions: surveyActionConditions,
    context: "UserFormsTemplate",
    openFormModal,
    sorting,
    setSorting
  });


  return (
    
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        {/* Title and Subtitle */}
        <div>
          <h1 className="text-2xl font-bold text-[#253965]">Survey</h1>
          <p className="text-[16px] text-gray-600 mt-1">View and answer available survey questionnaires</p>
        </div>
        {/* Search Input */}
        <div>
          <SearchBar value={globalFilter} onChange={setGlobalFilter} />
        </div>
      </div>
      <div className="student-service-school-forms-container">
        <div className="student-service-school-forms-header">Surveys</div>
        <DataTable columns={Columns} data={survey} context="Surveys" globalFilter={globalFilter} isLoading={loading} />
      </div>
      {/* Modals */}
      {formItem && (
        <UserCreateSurveyModal
          isOpen={!!formItem}
          closeModal={() => setFormItem(null)}
          formItem={formItem}
          load={loadSurveys}
          // onConfirmModal={() => setIsSuccessModalOpen(true)}
        />
      )}
    </div>
  )
}


export default VisibleSurveys;
