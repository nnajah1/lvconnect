
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DataTable } from "@/components/dynamic/DataTable";
import { getColumns } from "@/components/dynamic/getColumns";
import { smActionsConditions, smActions, registrarSchema } from "@/tableSchemas/studentManagement";
import { bulkArchiveEnrollment, getEnrollees } from "@/services/enrollmentAPI";
import { ConfirmationModal, WarningModal } from "@/components/dynamic/alertModal";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "@/components/dynamic/searchBar";
import { toast } from "react-toastify";
import { useUserRole } from "@/utils/userRole";

const StudentInformation = () => {
  const userRole = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [enrollment, setEnrollment] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState(null);
  const [archiveItem, setArchiveItem] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  
  useEffect(() => {
    const loadEnrollees = async () => {
      const allEnrollees = await getEnrollees();
      const enrolledOnly = allEnrollees.filter(
        enrollee => enrollee.enrollee_record?.[0]?.enrollment_status === "enrolled"
      );

      setEnrollment(enrolledOnly);
    };

    loadEnrollees();
  }, []);


  const getBulkActions = () => {
    return [
      {
        label: "Archive Selected",
        onClick: handleBulkArchive,
      },
    ];
  };

 const handleBulkArchive = async (items) => {
  const ids = items.map((item) => item.id);
  await bulkArchiveEnrollment(ids);
};


  const openModal = (item) => setItem(item);
  const openArchiveModal = (item) => setArchiveItem(item);


  const templateColumns = getColumns({
    userRole,
    schema: registrarSchema,
    actions: smActions(openModal, openArchiveModal),
    actionConditions: smActionsConditions,
    context: "formstemplate",
    openModal,
    openArchiveModal,
    showSelectionColumn: true,
  });

  useEffect(() => {
    if (item) {
      navigate(`/registrar/student-information-management/${item.id}/edit`, {
        state: { from: location.pathname },
      });
    }
  }, [item, navigate, location.pathname]);

  if (item) return null;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Enrollment</h1>
        <div><SearchBar value={globalFilter} onChange={setGlobalFilter} /></div>
      </div>

      <DataTable
        columns={templateColumns}
        data={enrollment}
        {... { bulkActions: getBulkActions() }}
        globalFilter={globalFilter} />

      {archiveItem && (
        <WarningModal
          isOpen={!!archiveItem}
          closeModal={() => { setArchiveItem(null); }}
          title="Archive Data"
          description="Are you sure you want to archive this student data?"
        >
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mr-2"
            onClick={() => { setArchiveItem(null); }}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={handleBulkArchive}
          >
            Archive
          </button>
        </WarningModal>
      )}



    </div>
  );
}


export default StudentInformation;