import React, { useState, useEffect } from 'react';
import { DataTable } from "@/components/dynamic/DataTable";
import { getColumns } from "@/components/dynamic/getColumns";
import { surveyActionConditions, surveyActions, surveyTemplateSchema } from "@/tableSchemas/userSurvey";
import { CiCirclePlus, CiSearch } from "react-icons/ci";
import UserCreateSurveyModal from './UserCreateSurvey';
import { getSurveys } from '@/services/surveyAPI';
import SearchBar from '@/components/dynamic/searchBar';

const VisibleSurveys = ({ userRole }) => {

  const [survey, setSurvey] = useState([]);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false)
  const [formItem, setFormItem] = useState(null);
  const [sorting, setSorting] = useState([])
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    const loadSurveys = async () => {
      const data = await getSurveys();
      setSurvey(data);
    };
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Surveys</h1>
        {/* Search Input */}
       <div><SearchBar value={globalFilter} onChange={setGlobalFilter} /></div>
      </div>

       <DataTable columns={Columns} data={survey} context="Surveys" globalFilter={globalFilter} />
      
      {/* Modals */}
      {formItem && (
        <UserCreateSurveyModal
          isOpen={!!formItem}
          closeModal={() => setFormItem(false)}
          formItem={formItem}
        />
      )}

    </div>
  );
}


export default VisibleSurveys;
