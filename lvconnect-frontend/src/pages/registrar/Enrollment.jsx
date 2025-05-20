
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DataTable } from "@/components/dynamic/DataTable";
import { getColumns } from "@/components/dynamic/getColumns";
import { actionConditions, actions, registrarSchema } from "@/tableSchemas/enrollment";
import { CiCirclePlus, CiSearch } from "react-icons/ci";
import CreateFormModal from "@/pages/admins/psas/CreateForm";
import DynamicTabs from "@/components/dynamic/dynamicTabs";
import EditFormModal from "@/pages/admins/psas/EditForm";
import UserViewFormModal from "@/pages/student/UserViewSchoolForm";
import { approveEnrollment, bulkApproveEnrollment, bulkDeleteEnrollment, bulkExportEnrollment, bulkRemindEnrollment, getEnrollees, rejectEnrollment } from "@/services/enrollmentAPI";
import { ConfirmationModal, WarningModal } from "@/components/dynamic/alertModal";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "@/components/dynamic/searchBar";
import AcademicYear from "@/components/enrollment/academicYear";
import { toast } from "react-toastify";
import { useUserRole } from "@/utils/userRole";


const Enrollment = () => {
  const userRole = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [enrollment, setEnrollment] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState(null);
  const [directItem, setDirectItem] = useState(null);
  const [acceptItem, setAcceptItem] = useState(null);
  const [rejectItem, setRejectItem] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [globalFilter, setGlobalFilter] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {

    const loadSurveys = async () => {
      const data = await getEnrollees();
      setEnrollment(data);
    }
    loadSurveys();
  }, []);

  const openModal = (item) => setItem(item);
  const openAcceptModal = (item) => setAcceptItem(item);
  const openRejectModal = (item) => setRejectItem(item);
  const openDirectModal = (item) => setDirectItem(item);

  const actionMap = actions(openModal, openAcceptModal, openRejectModal, openDirectModal, activeTab);
  const filteredData = useMemo(() => {

    switch (activeTab) {
      case "pending":
        return enrollment.filter((s) => s.enrollee_record[0].enrollment_status === "pending");
      case "enrolled":
        return enrollment.filter((s) => s.enrollee_record[0].enrollment_status === "enrolled");
      case "not_enrolled":
        return enrollment.filter((s) => s.enrollee_record[0].enrollment_status === "not_enrolled");
      case "rejected":
        return enrollment.filter((s) => s.enrollee_record[0].enrollment_status === "rejected");
      default:
        return enrollment;
    }
  }, [activeTab, enrollment]);

  const getBulkActions = (tab) => {
    switch (tab) {
      case "pending":
        return [
          { label: "Approve Selected", onClick: handleBulkApprove },
          // { label: "Delete Selected", onClick: handleBulkDelete },
        ];
      case "enrolled":
        return [{ label: "Export Selected", onClick: handleBulkExport }];
      case "not_enrolled":
        return [
          { label: "Send Reminder", onClick: handleBulkRemind },
          { label: "Delete Selected", onClick: handleBulkDelete },
        ];
      case "rejected":
        return [
          { label: "Send Reminder", onClick: handleBulkRemind },
          // { label: "Delete Selected", onClick: handleBulkDelete },
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
    openDirectModal,
    showSelectionColumn: activeTab !== "all",
  });

  const handleBulkApprove = async (items) => {
    const ids = items.map((item) => item.id);
    await bulkApproveEnrollment(ids);
  };

  const handleBulkDelete = async (items) => {
    const ids = items.map((item) => item.id);
    await bulkDeleteEnrollment(ids);
  };

  const handleBulkExport = async (items) => {
    const ids = items.map((item) => item.id);
    const response = await bulkExportEnrollment(ids);
    // Trigger file download if needed
    console.log("Exported Data:", response.data);
  };

  const handleBulkRemind = async (items) => {
    const ids = items.map((item) => item.id);
    await bulkRemindEnrollment(ids);
  };

  const handleApprove = async () => {
    const id = acceptItem?.enrollee_record?.[0]?.id;
    console.log(id)
    if (!id) {
      toast.info("No valid enrollment ID found.");
      console.log("acceptItem:", acceptItem);
      return;
    }

    try {
      await approveEnrollment(id);
      toast.success("Enrollment approved!");
      setAcceptItem(null);
      await loadSurveys();

    } catch (error) {
      console.error(error);
      toast.error("Failed to approve enrollment.");
    }
  };


  const handleReject = async () => {
    const id = rejectItem?.enrollee_record?.[0]?.id;

    if (!id) {
      toast.info("No valid enrollment ID found.");
      console.log("rejectItem:", rejectItem);
      return;
    }
    if (!remarks) {
      toast.error("Put admin remarks");
      console.log("rejectItem:", rejectItem);
      return;
    }


    try {
      await rejectEnrollment(id, { admin_remarks: remarks });
      toast.success("Enrollment rejected!");
      setRejectItem(null)
      setRemarks("");
      await loadSurveys();

    } catch (error) {
      console.error(error);
      toast.error("Failed to reject enrollment.");
    }
  };


  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Enrollment</h1>
        <div><SearchBar value={globalFilter} onChange={setGlobalFilter} /></div>
      </div>

      <div className="pb-6"><AcademicYear /></div>

      <DynamicTabs
        tabs={[
          { label: "All", value: "all" },
          { label: "Pending", value: "pending" },
          { label: "Enrolled", value: "enrolled" },
          { label: "Not Enrolled", value: "not_enrolled" },
          { label: "Rejected", value: "rejected" },
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
        navigate(`student-information/${item.id}`, {
          state: { from: location.pathname }
        })
      )}

      {directItem && (
        navigate(`student-information/${directItem.id}/edit`, {
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
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={handleApprove}
          >
            Accept
          </button>
        </ConfirmationModal>
      )}
      {rejectItem && (
        <WarningModal
          isOpen={!!rejectItem}
          closeModal={() => { setRejectItem(null); setRemarks(""); }}
          title="Reject Enrollment"
          description="Are you sure you want to reject this enrollment?"
        >
          <div className="flex w-full flex-col">
            <div className="w-full">
              <input
                type="text"
                placeholder="Enter admin remarks"
                className="w-full px-3 py-2 border rounded mb-4"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end">

              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mr-2"
                onClick={() => { setRejectItem(null); setRemarks(""); }}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={handleReject}
              >
                Reject
              </button>
            </div>
          </div>


        </WarningModal>
      )}



    </div>
  );
}

export default Enrollment;