"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { DataTable } from "@/components/dynamic/DataTable";
import { getColumns } from "@/components/dynamic/getColumns";
import { actionConditions, actions, registrarSchema } from "@/tableSchemas/enrollment";
import { CiCirclePlus, CiSearch } from "react-icons/ci";
import CreateFormModal from "@/pages/admins/psas/CreateForm";
import DynamicTabs from "@/components/dynamic/dynamicTabs";
import EditFormModal from "@/pages/admins/psas/EditForm";
import UserViewFormModal from "@/pages/student/UserViewSchoolForm";
import { getEnrollees } from "@/services/enrollmentAPI";
import { ConfirmationModal, WarningModal } from "@/components/dynamic/alertModal";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "@/components/dynamic/searchBar";


const Enrollment = ({ userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [survey, setSurvey] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState(null);
  const [acceptItem, setAcceptItem] = useState(null);
  const [rejectItem, setRejectItem] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [globalFilter, setGlobalFilter] = useState("");
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);

  useEffect(() => {
    const loadSurveys = async () => {
      const data = await getEnrollees();
      setSurvey(data);
    };
    loadSurveys();
  }, []);

  const openModal = (item) => setItem(item);
  const openAcceptModal = (item) => setAcceptItem(item);
  const openRejectModal = (item) => setRejectItem(item);

  const actionMap = actions(openModal, openAcceptModal, openRejectModal, activeTab);

  const filteredData = useMemo(() => {
    switch (activeTab) {
      case "pending":
        return survey.filter((s) => s.status === "pending");
      case "enrolled":
        return survey.filter((s) => s.status === "enrolled");
      case "not_enrolled":
        return survey.filter((s) => s.status === "not_enrolled");
      default:
        return survey;
    }
  }, [activeTab, survey]);

  const getBulkActions = (tab) => {
    switch (tab) {
      case "pending":
        return [
          { label: "Approve Selected", onClick: handleBulkApprove },
          { label: "Delete Selected", onClick: handleBulkDelete },
        ];
      case "enrolled":
        return [{ label: "Export Selected", onClick: handleBulkExport }];
      case "not_enrolled":
        return [
          { label: "Send Reminder", onClick: handleBulkRemind },
          { label: "Delete Selected", onClick: handleBulkDelete },
        ];
      default:
        return;
    }
  };

  const templateColumns = getColumns({
    userRole,
    schema: registrarSchema,
    actions: actionMap,
    actionConditions,
    context: "formstemplate",
    openModal,
    openAcceptModal,
    openRejectModal,
    showSelectionColumn: activeTab !== "all",
  });

  const handleBulkApprove = (items) => console.log("Approve", items);
  const handleBulkDelete = (items) => console.log("Delete", items);
  const handleBulkExport = (items) => console.log("Export", items);
  const handleBulkRemind = (items) => console.log("Remind", items);
  const handleAccept = () => console.log("Accepted");
  const handleReject = () => console.log("Rejected");

  const toggleEnrollment = () => {
    setIsEnrollmentOpen((prev) => !prev);

    // make API call or trigger action here
    // await updateEnrollmentStatus(!isEnrollmentOpen);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Enrollment</h1>
        <div><SearchBar value={globalFilter} onChange={setGlobalFilter} /></div>
      </div>

      <div className="flex justify-end gap-4 mb-4">
        <button
          onClick={toggleEnrollment}
          className={`px-4 py-2 rounded text-white ${isEnrollmentOpen ? "bg-[#dd2c2c]" : "bg-[#2CA4DD]"
            }`}
        >
          {isEnrollmentOpen ? "Close Enrollment" : "Open Enrollment"}
        </button>
      </div>

      <DynamicTabs
        tabs={[
          { label: "All", value: "all" },
          { label: "Pending", value: "pending" },
          { label: "Enrolled", value: "enrolled" },
          { label: "Not Enrolled", value: "not_enrolled" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-2"
      />

      <DataTable
        columns={templateColumns}
        data={filteredData}
        {...(activeTab !== "all" && { bulkActions: getBulkActions(activeTab) })}
        globalFilter={globalFilter} />


      {item && (
        navigate(`/psas-admin/survey-responses/${item.id}`, {
          state: { from: location.pathname }
        })
      )}
      {acceptItem && (
        <ConfirmationModal
          isOpen={!!acceptItem}
          closeModal={() => setAcceptItem(null)}
          title="Accept Enrollment"
          description="Are you sure you want to accept this enrollment?"
        >
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mr-2"
            onClick={() => setAcceptItem(null)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={handleAccept}
          >
            Accept
          </button>
        </ConfirmationModal>
      )}
      {rejectItem && (
        <WarningModal
          isOpen={!!rejectItem}
          closeModal={() => setRejectItem(null)}
          title="Accept Enrollment"
          description="Are you sure you want to accept this enrollment?"
        >
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mr-2"
            onClick={() => setRejectItem(null)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={handleReject}
          >
            Reject
          </button>
        </WarningModal>
      )}



    </div>
  );
}

export default Enrollment;