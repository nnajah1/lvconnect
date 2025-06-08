
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DataTable } from "@/components/dynamic/DataTable";
import { getColumns } from "@/components/dynamic/getColumns";
import { smActionsConditions, smActions, registrarSchema, newStudentSchema, archiveSchema } from "@/tableSchemas/studentManagement";
import { archiveData, bulkArchiveEnrollment, getNewStudents, getStudents, syncAccounts } from "@/services/enrollmentAPI";
import { ConfirmationModal, DataModal, InfoModal, WarningModal } from "@/components/dynamic/alertModal";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "@/components/dynamic/searchBar";
import { toast } from "react-toastify";
import { useUserRole } from "@/utils/userRole";
import CreateAccountModal from "@/components/enrollment/createAccount";
import DynamicTabs from "@/components/dynamic/dynamicTabs";

const StudentInformation = () => {
  const userRole = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [enrollment, setEnrollment] = useState([]);
  const [newStudent, setNewStudent] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [archiveItem, setArchiveItem] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [showSingleForm, setShowSingleForm] = useState(false);
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [syncAccount, setSyncAccount] = useState(false);


  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const allStudents = await getStudents();
      setEnrollment(allStudents);
    } finally {
      setIsLoading(false);
    }

  };
  useEffect(() => {
    loadStudents();
  }, []);

  const loadNewStudents = async () => {
    setIsLoading(true);
    try {
      const allNewStudents = await getNewStudents();
      setNewStudent(allNewStudents);
    } finally {
      setIsLoading(false);
    }

  };
  useEffect(() => {
    loadNewStudents();
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
    const ids = items.map((item) => item.student_information_id);
    try {
      await bulkArchiveEnrollment(ids);
      toast.success('Students archived successfully');
    } catch (error) {
      console.error('Bulk archive failed:', error);
      toast.error('Failed to archive students');
    }
  };
  const handleArchive = async () => {
    const id = archiveItem?.enrollee_record?.[0]?.id;
    if (!id) {
      toast.info("Student data not found.");
      return;
    }
    try {
      await archiveData(id, { admin_remarks: remarks });
      toast.success('Student data archived successfully');
      setArchiveItem(null);
      await loadStudents();
    } catch (error) {
      console.error('Archive failed:', error);
      toast.error('Failed to archive student data');
    }
  };

  const viewModal = (item) => setViewItem(item);
  const openModal = (item) => setEditItem(item);
  const openArchiveModal = (item) => setArchiveItem(item);

  const actionMap = smActions(viewModal, openModal, openArchiveModal)
  const filteredData = useMemo(() => {
    switch (activeTab) {
      case "active":
        return enrollment.filter(s => s.enrollee_record[0].enrollment_status !== "archived");
      case "archive":
        return enrollment.filter(s => s.enrollee_record[0].enrollment_status === "archived");
      default:
        return [];
    }
  }, [activeTab, enrollment]);

  const templateColumns = getColumns({
    userRole,
    schema: registrarSchema,
    actions: actionMap,
    actionConditions: smActionsConditions,
    context: "formstemplate",
    viewModal,
    openModal,
    openArchiveModal,
    showSelectionColumn: activeTab === "active",
  });

  const newStudentColumns = getColumns({
    userRole,
    schema: newStudentSchema,
    actions: false,
    context: "formstemplate",
    showActionColumn: false,
  });
  const archiveColumns = getColumns({
    userRole,
    schema: archiveSchema,
    actions: actionMap,
    actionConditions: smActionsConditions,
    context: "formstemplate",
  });

  useEffect(() => {
    if (editItem) {
      navigate(`/registrar/student-information-management/${editItem.id}/edit`, {
        state: { from: location.pathname },
      });
    }
    if (viewItem) {
      navigate(`/registrar/student-information-management/${viewItem.id}/view`, {
        state: { from: location.pathname },
      });
    }
  }, [editItem, viewItem, navigate, location.pathname]);

  const handleSyncAccount = async () => {
    // const id = newStudent;
    if (!newStudent) {
      toast.info("No new accounts found.");
      return;
    }

    try {
      await syncAccounts();
      toast.success("New accounts sync successfully!");
      setSyncAccount(false);
      await loadNewStudents();

    } catch (error) {
      console.error(error);
      toast.error("Failed to sync new accounts");
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Student Information Management</h1>
        <div><SearchBar value={globalFilter} onChange={setGlobalFilter} /></div>
      </div>
      <div className="flex itemd-center justify-end p-4 gap-2">
        <button
          onClick={() => setShowSingleForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          Add Student
        </button>
        <button
          onClick={() => setShowBatchForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
        >
          Create Batch Account
        </button>
        {newStudent && activeTab === "new_accounts" && (
          <button
            onClick={() => setSyncAccount(true)}
            className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 cursor-pointer"
          >
            Sync New Accounts
          </button>
        )}
      </div>

      <DynamicTabs
        tabs={[
          { label: "Active Students", value: "active" },
          { label: "Archived Students", value: "archive" },
          { label: "New Accounts", value: "new_accounts" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-2"
      />

      {activeTab === "new_accounts" ? (
        <DataTable
          columns={newStudentColumns}
          data={newStudent}
          bulkActions={getBulkActions("new_student")}
          globalFilter={globalFilter}
          isLoading={isLoading}
          pagesize={10}
        />
      ) : activeTab === "archive" ? (
        <DataTable
          columns={archiveColumns}
          data={filteredData}
          globalFilter={globalFilter}
          isLoading={isLoading}
          pagesize={10}
        />
      ) : (
        <DataTable
          columns={templateColumns}
          data={filteredData}
          bulkActions={getBulkActions()}
          globalFilter={globalFilter}
          isLoading={isLoading}
          pagesize={10}
        />
      )}

      {archiveItem && (
        <WarningModal
          isOpen={!!archiveItem}
          closeModal={() => { setArchiveItem(null); }}
          title="Archive Data"
          description="Are you sure you want to archive this student data?"
        >
          <div className="flex w-full flex-col">
            <div className="w-full">
              <select
                className="w-full px-3 py-2 border rounded mb-4"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                required
              >
                <option value="">Select admin remark</option>
                <option value="Graduated">Graduated</option>
                <option value="Did not maintain grade">Did not Maintain Grade</option>
                <option value="Drop">Drop</option>
                <option value="Transferred">Transferred</option>
              </select>
            </div>


            <div className="flex justify-end">

              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mr-2"
                onClick={() => { setArchiveItem(null); setRemarks(""); }}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600" onClick={handleArchive}
              >
                Archive
              </button>
            </div>
          </div>
        </WarningModal>
      )}

      {(showSingleForm || showBatchForm) && (
        <CreateAccountModal
          isOpen={showSingleForm || showBatchForm}
          closeModal={() => {
            setShowSingleForm(false);
            setShowBatchForm(false);
          }}
          showSingleForm={showSingleForm}
          showBatchForm={showBatchForm}
          setShowSingleForm={setShowSingleForm}
          setShowBatchForm={setShowBatchForm}
          loadNewStudents={loadNewStudents}
        />
      )}


      {syncAccount && (
        <DataModal
          isOpen={syncAccount}
          closeModal={() => setSyncAccount(false)}
          title="Sync New Accounts"
          description="Are you sure you want to sync new accounts?"
        >
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mr-2"
            onClick={() => setSyncAccount(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600" onClick={handleSyncAccount}
          >
            Sync New Accounts
          </button>
        </DataModal>
      )}

    </div>
  );
}


export default StudentInformation;