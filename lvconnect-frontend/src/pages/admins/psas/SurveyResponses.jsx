"use client";

import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/dynamic/DataTable";
import { getColumns } from "@/components/dynamic/getColumns";
import { formActionConditions, formActions, schoolFormTemplateSchema, surveySubmittedSchema, surveySubmitActions, surveySubmitActionConditions } from "@/tableSchemas/surveyResponse";
import { CiCirclePlus, CiSearch } from "react-icons/ci";
import DynamicTabs from "@/components/dynamic/dynamicTabs";
import { useForms } from '@/context/FormsContext';
import { getSurveyResponses } from "@/services/surveyAPI";
import ViewSurveyResponseModal from "./ViewSurvey";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const SurveyResponses = ({ userRole }) => {
  const { schoolForms, submittedSurvey, error, fetchForms, fetchSubmitted } = useForms();
  const [survey, setSurvey] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false)
  const [submittedItem, setSubmittedItem] = useState(null);

  const { surveyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/';

const handleBack = () => navigate(from);

  const openSubmittedModal = (item) => {
    setSubmittedItem(item); // full item, not just id
  };

  const templateColumns = getColumns({
    userRole,
    schema: schoolFormTemplateSchema,
    actions: formActions,
    actionConditions: formActionConditions,
    context: "formstemplate",
  });
  const submitActions = surveySubmitActions(openSubmittedModal);
  const submittedColumns = getColumns({
    userRole,
    schema: surveySubmittedSchema,
    actions: submitActions,
    actionConditions: surveySubmitActionConditions,
    context: "formssubmited",
    openSubmittedModal
  });

   useEffect(() => {
      const loadSurveyResponses = async () => {
        const data = await getSurveyResponses(surveyId);
        setSurvey(data);
      };
      loadSurveyResponses();
    }, []);
  

  const tabs = [
    {
      label: "Summary",
      value: "summary",
      content: <DataTable columns={templateColumns} data={schoolForms} />
    },
    {
      label: "Individual",
      value: "Individual",
      content: <DataTable columns={submittedColumns} data={survey} />
    },
  ];

  return (
    <div className="container mx-auto p-4">
      {error && <p>{error}</p>}
      <button onClick={handleBack} className="text-blue-500 hover:underline">
      ← Go Back
    </button>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Responses</h1>
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


      <DynamicTabs tabs={tabs} />

      {/* Modals */}

      {submittedItem && (
        <ViewSurveyResponseModal
          isOpen={!!submittedItem}
          closeModal={() => setSubmittedItem(false)}
          submittedItem={submittedItem}
        />
        )}

    </div>
  );
}

export default SurveyResponses;