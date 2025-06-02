
import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/dynamic/DataTable";
import { getColumns } from "@/components/dynamic/getColumns";
import { getSurveys } from "@/services/surveyAPI";
import { actionConditions, actions, surveySchema } from "@/tableSchemas/survey";
import { CiCirclePlus, CiSearch } from "react-icons/ci";
import CreateSurveyModal from "./CreateSurvey";
import EditSurveyModal from "./EditSurvey";
import { Navigate, useNavigate } from "react-router-dom";
import { ConfirmationModal } from "@/components/dynamic/alertModal";
import SearchBar from "@/components/dynamic/searchBar";
import { toast } from "react-toastify";
import { useUserRole } from "@/utils/userRole";

const Surveys = () => {
  const userRole = useUserRole();
  const [survey, setSurvey] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [formItem, setFormItem] = useState(null);
  const [responseItem, setresponseItem] = useState(null);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");

  const navigate = useNavigate();

  const openModal = (item) => {
    setFormItem(item);
  };

  const openResponseModal = (item) => {
    setresponseItem(item);
  };

  console.log(userRole)

  const columns = getColumns({
    userRole,
    schema: surveySchema,
    actions: actions(openModal, openResponseModal),
    actionConditions: actionConditions

  });

  const loadSurveys = async () => {
      setLoading(true)
      try {
        const data = await getSurveys();
        setSurvey(data);
      } catch (err) {
        console.error("Failed to load surveys", err);
        console.error("Failed to load surveys.");
      } finally {
        setLoading(false); 
      }
    };

 useEffect(() => {
    loadSurveys(); 
  }, []);

  useEffect(() => {
      if (responseItem) {
        setLoading(true);
        navigate(`/psas-admin/surveys/survey-responses/${responseItem.id}`, {
          state: { from: location.pathname, loading: true },
        });
      }
    }, [responseItem, navigate, location.pathname]);
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Surveys</h1>

      {/* Create & Search Section */}
      <div className="flex justify-between items-center mb-4">
        {/* Create Update Button */}
        <div className="relative">
          <button
            onClick={() => {
              setIsOpen(true)
            }}
            className="flex items-center space-x-2 bg-[#2CA4DD] text-white px-3 py-2 rounded-md cursor-pointer"
          >
            <CiCirclePlus size={25} />
            <span>Create Survey</span>
          </button>
        </div>

        {/* Search Input */}
        <div><SearchBar value={globalFilter} onChange={setGlobalFilter} /></div>
      </div>

      <DataTable columns={columns} data={survey} context="Surveys" globalFilter={globalFilter} isLoading={loading}/>

      {/* Modals */}
      <CreateSurveyModal isOpen={isOpen} closeModal={() => setIsOpen(false)} loadSurveys={loadSurveys}/>
      {formItem && (
        <EditSurveyModal
          isOpen={!!formItem}
          closeModal={() => setFormItem(null)}
          formItem={formItem}
          onDeleteModal={() => setIsSuccessModalOpen(true)}
          onSuccessModal={() => setIsSuccessModalOpen(false)}
        />
      )}

      <ConfirmationModal
        isOpen={isSuccessModalOpen}
        closeModal={() => setIsSuccessModalOpen(false)}
        title="Survey Deleted"
        description="The survey has been successfully deleted."
      >
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => setIsSuccessModalOpen(false)}
        >
          Back to Surveys
        </button>
      </ConfirmationModal>

    </div>
  );
}

export default Surveys;