
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

const StudentInformation = () => {
  const userRole = useUserRole();
 const navigate = useNavigate();
  const location = useLocation();
  const [enrollment, setEnrollment] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState(null);
  const [id, setId] = useState(null);
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

  const actionMap = actions(openModal, openAcceptModal, openRejectModal, activeTab);


  const templateColumns = getColumns({
    userRole,
    schema: registrarSchema,
    actions: actionMap,
    actionConditions,
    context: "formstemplate",
    openModal,
    openAcceptModal,
    openRejectModal,
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Enrollment</h1>
        <div><SearchBar value={globalFilter} onChange={setGlobalFilter} /></div>
      </div>
      
      <DataTable
        columns={templateColumns}
        data={enrollment}
        globalFilter={globalFilter} />


      {item && (
        navigate(`student-information/${item.id}`, {
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


export default StudentInformation;