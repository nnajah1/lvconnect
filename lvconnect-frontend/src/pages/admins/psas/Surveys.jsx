
import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/dynamic/DataTable";
import { getColumns } from "@/components/dynamic/getColumns";
import { changeVisibility, getSurveys } from "@/services/surveyAPI";
import { actionConditions, actions, surveySchema } from "@/tableSchemas/survey";
import { CiCirclePlus, CiSearch } from "react-icons/ci";
import CreateSurveyModal from "./CreateSurvey";
import EditSurveyModal from "./EditSurvey";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();

  const openModal = (item) => {
    setFormItem(item);
  };

  const openResponseModal = (item) => {
    setresponseItem(item);
  };

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
        state: { from: location.pathname, loading: true, name: responseItem.title },
      });
    }
  }, [responseItem, navigate, location.pathname]);

  const handleToggleVisibility = async () => {
    if (!formItem) return;

    try {
      setLoading(true);
      await changeVisibility(formItem.id);
      toast.success("Survey visibility updated successfully");
      setFormItem(null);
      loadSurveys();
    } catch (error) {
      console.error("Failed to toggle visibility", error);
      toast.error("Failed to update survey visibility");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
                    {/* Title and Subtitle */}
                    <div>
                      <h1 className="text-2xl font-bold text-[#253965]">Survey Management</h1>
                      <p className="text-[16px] text-gray-600 mt-1">Create survey questionnaires and track responses</p>
                    </div>
                    {/* Search Input */}
                    <div>
                      <SearchBar value={globalFilter} onChange={setGlobalFilter} />
                    </div>
                  </div>


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

    
      </div>

      <DataTable columns={columns} data={survey} context="Surveys" globalFilter={globalFilter} isLoading={loading} />

      {/* Modals */}
      <CreateSurveyModal isOpen={isOpen} closeModal={() => setIsOpen(false)} loadSurveys={loadSurveys} />

      {/* edit survey */}
      {/* {formItem && (
        <EditSurveyModal
          isOpen={!!formItem}
          closeModal={() => setFormItem(null)}
          formItem={formItem}
          onDeleteModal={() => setIsSuccessModalOpen(true)}
          onSuccessModal={() => setIsSuccessModalOpen(false)}
        />
      )} */}
      {formItem && (
        <ConfirmationModal
          isOpen={!!formItem}
          closeModal={() => setFormItem(null)}
          title="Toggle Visibility"
          description="Are you sure you want to change the visibility of this survey?"
        >
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mr-2"
            onClick={() => setFormItem(null)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={handleToggleVisibility}
          >
            {loading ? "Loading..." : "Confirm"}
          </button>
        </ConfirmationModal>
      )};
    </div>
  );
}

export default Surveys;