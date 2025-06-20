
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
import SearchBar from "@/components/dynamic/searchBar";
import { useUserRole } from "@/utils/userRole";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";
import SummaryAnalytics from "@/components/dashboards/psas_dashboard/analyticsSummary";
import { getAnalytics } from "@/services/dashboardAPI";
import { Breadcrumbs } from "@/components/dynamic/breadcrumbs";

const SurveyResponses = () => {
  const userRole = useUserRole();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false)
  const [submittedItem, setSubmittedItem] = useState(null);
  const [activeTab, setActiveTab] = useState("individual");
  const [globalFilter, setGlobalFilter] = useState("");


  const { surveyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/';
  const name = location.state?.name || "Responses";
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
      setLoading(true)
      try {
        const data = await getSurveyResponses(surveyId);
        setSurvey(data);
      } catch (err) {
        console.error("Failed to load surveys", err);
        console.error("Failed to load responses.");
      } finally {
        setLoading(false);
      }
    };
    loadSurveyResponses();
  }, []);



  const tabs = [
    {
      label: "Summary",
      value: "summary",
      content: <SummaryAnalytics surveyId={surveyId} />
    },
    {
      label: "Individual",
      value: "individual",
      content: <DataTable columns={submittedColumns} data={survey} globalFilter={globalFilter} isLoading={loading} />
    },
  ];

  return (
    <div className="container mx-auto p-4">
      {/* <button onClick={handleBack} className="text-black hover:underline bg-white p-1 rounded cursor-pointer">
        <ChevronLeft />
      </button> */}

      <Breadcrumbs rootName="Surveys" rootHref="/psas-admin/surveys" name={name} />

      <div className="flex justify-between items-center">
        <div className="py-8">
          <h1 className="text-2xl font-bold text-[#253965]">Student Responses</h1>
          <p className="text-sm text-gray-600 mt-1">View survey responses of students</p>
        </div>
        {/* Search Input */}
        {activeTab === "individual" && (
          <div><SearchBar value={globalFilter} onChange={setGlobalFilter} /></div>
        )}
      </div>


      <DynamicTabs tabs={tabs} activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-2" />

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