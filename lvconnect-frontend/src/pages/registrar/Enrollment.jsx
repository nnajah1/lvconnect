
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DataTable } from "@/components/dynamic/DataTable";
import { getColumns } from "@/components/dynamic/getColumns";
import { actionConditions, actions, enrollActionConditions, enrollActions, registrarNotEnrolledSchema, registrarSchema } from "@/tableSchemas/enrollment";
import { CiCirclePlus, CiSearch } from "react-icons/ci";
import CreateFormModal from "@/pages/admins/psas/CreateForm";
import DynamicTabs from "@/components/dynamic/dynamicTabs";
import EditFormModal from "@/pages/admins/psas/EditForm";
import UserViewFormModal from "@/pages/student/UserViewSchoolForm";
import { approveEnrollment, bulkApproveEnrollment, bulkDeleteEnrollment, bulkExportEnrollment, bulkRemindEnrollment, bulkRemindRejectedEnrollment, getEnrollees, getNotEnrolled, rejectEnrollment } from "@/services/enrollmentAPI";
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
  const [notEnrolled, setNotEnrolled] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState(null);
  const [directItem, setDirectItem] = useState(null);
  const [acceptItem, setAcceptItem] = useState(null);
  const [rejectItem, setRejectItem] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [globalFilter, setGlobalFilter] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [semester, setSemester] = useState("");
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);

  const selectedYearObj = academicYears.find((y) => y.school_year === selectedYear);


  const loadEnrollment = async () => {
    if (!selectedYearObj || !semester) return;
    setIsLoading(true);
    try {
      const data = await getEnrollees({ academic_year_id: selectedYearObj.id, semester });
      setEnrollment(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    loadEnrollment();
  }, [selectedYearObj, semester]);

  const loadNotEnrolled = async () => {
    if (!selectedYearObj || !semester) return;
    setIsLoading(true);
    try {
      const data = await getNotEnrolled({academic_year_id: selectedYearObj.id, semester });
      setNotEnrolled(data.students);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadNotEnrolled();
  }, [selectedYearObj, semester]);

  const openModal = (item) => setItem(item);
  const openAcceptModal = (item) => setAcceptItem(item);
  const openRejectModal = (item) => setRejectItem(item);
  const openDirectModal = (item) => setDirectItem(item);

  const actionMap = actions(openModal, openAcceptModal, openRejectModal, openDirectModal, activeTab);
  const filteredData = useMemo(() => {
    switch (activeTab) {
      case "pending":
        return enrollment.filter(s => s.enrollee_record[0].enrollment_status === "pending");
      case "enrolled":
        return enrollment.filter(s => s.enrollee_record[0].enrollment_status === "enrolled");
      case "rejected":
        return enrollment.filter(s => s.enrollee_record[0].enrollment_status === "rejected");
      case "all":
        return enrollment;
      default:
        return [];
    }
  }, [activeTab, enrollment]);

  const notEnrolledData = useMemo(() => {
    return notEnrolled.filter(students => students.enrollment_status === "not_enrolled");
  }, [notEnrolled]);

  const getBulkActions = (tab) => {
    switch (tab) {
      case "enrolled":
        return [{ label: "Export Selected", onClick: handleBulkExport }];
      case "pending":
        return [
          { label: "Approve Selected", onClick: handleBulkApprove },
          // { label: "Delete Selected", onClick: handleBulkDelete },
        ];
      case "rejected":
        return [
          { label: "Send Reminder", onClick: handleBulkRemindRejected },
          // { label: "Delete Selected", onClick: handleBulkDelete },
        ];
      case "not_enrolled":
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
  const notEnrolledColumns = getColumns({
    userRole,
    schema: registrarNotEnrolledSchema,
    actions: enrollActions(openDirectModal),
    actionConditions: enrollActionConditions,
    context: "formstemplate",
    openDirectModal,
    // showSelectionColumn: activeTab !== "all",
  });


  const handleBulkExport = async (items) => {
    const ids = items.map((item) => item.id);
    const response = await bulkExportEnrollment(ids);

    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'enrollees_export.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleBulkRemind = async (items) => {
    const ids = items.map((item) => item.id);

    // Get the enrollment_schedule_id from the first item's enrollee_record
    const enrollment_sched = items[0]?.enrollee_record?.[0]?.enrollment_schedule_id;

    if (!enrollment_sched) {
      console.error("Missing enrollment schedule ID.");
      return;
    }
    try {
      await bulkRemindEnrollment(ids, enrollment_sched);
      // await loadEnrollment();
      toast.success("Reminder was sent successfully.");
      // optionally refresh data
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reminder.");
    }
  };
  const handleBulkRemindRejected = async (items) => {
    const ids = items.map((item) => item.id);

    // Get the enrollment_schedule_id from the first item's enrollee_record
    const enrollment_sched = items[0]?.enrollee_record?.[0]?.enrollment_schedule_id;

    if (!enrollment_sched) {
      console.error("Missing enrollment schedule ID.");
      return;
    }
    try {
      await bulkRemindRejectedEnrollment(ids, enrollment_sched);
      // await loadEnrollment();
      toast.success("Reminder was sent successfully.");
      // optionally refresh data
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reminder.");
    }
  };

  const handleBulkApprove = async (items) => {
    const ids = items.map(item => item.enrollee_record?.[0]?.id).filter(Boolean);
    console.log("First selected item:", items);

    if (!ids.length) {
      toast.info("No valid enrollee records selected.");
      return;
    }
    try {
      await bulkApproveEnrollment(ids);
      await loadEnrollment();
      toast.success("Approved successfully.");
      // optionally refresh data
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async (items) => {
    const ids = items.map(item => item.enrollee_record?.[0]?.id).filter(Boolean);
    if (!ids.length) {
      toast.info("No valid enrollee records selected.");
      return;
    }

    try {
      await bulkDeleteEnrollment(ids);
      await loadEnrollment();
      toast.success("Deleted successfully.");
      // optionally refresh data
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete.");
    }
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
      await loadEnrollment();

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
      toast.success("Enrollment mark as temporary enrolled!");
      setRejectItem(null)
      setRemarks("");
      await loadEnrollment();

    } catch (error) {
      console.error(error);
      toast.error("Failed to mark enrollment as temporary enrolled.");
    }
  };


  useEffect(() => {
    if (directItem || item) {
      setIsLoading(true);
      const target = directItem ?? item;
      navigate(`student-information/${target.id}${directItem ? '/edit' : ''}`, {
        state: { from: location.pathname, isLoading: true },
      });
    }
  }, [directItem, item, navigate, location.pathname]);


  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Enrollment</h1>
        <div><SearchBar value={globalFilter} onChange={setGlobalFilter} /></div>
      </div>

      <div className="pb-6">
        <AcademicYear
          academicYears={academicYears}
          setAcademicYears={setAcademicYears}
          selectedYearObj={selectedYearObj}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          semester={semester}
          setSemester={setSemester}
          currentSchedule={currentSchedule}
          setCurrentSchedule={setCurrentSchedule}
          isEnrollmentOpen={isEnrollmentOpen}
          setIsEnrollmentOpen={setIsEnrollmentOpen}
        /></div>

      <DynamicTabs
        tabs={[
          { label: "All", value: "all" },
          { label: "Enrolled", value: "enrolled" },
          { label: "Pending", value: "pending" },
          { label: "Temporary Enrolled", value: "rejected" },
          { label: "Not Enrolled", value: "not_enrolled" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-2"
      />

      {activeTab === "not_enrolled" ? (
        <DataTable
          columns={notEnrolledColumns}
          data={notEnrolledData}
          bulkActions={getBulkActions("not_enrolled")}
          globalFilter={globalFilter}
          isLoading={isLoading}
        />
      ) : (
        <DataTable
          columns={templateColumns}
          data={filteredData}
          {...(activeTab !== "all" && { bulkActions: getBulkActions(activeTab) })}
          globalFilter={globalFilter}
          isLoading={isLoading}
        />
      )}

      {acceptItem && (
        <ConfirmationModal
          isOpen={!!acceptItem}
          closeModal={() => setAcceptItem(null)}
          title="Approve Enrollment"
          description="Are you sure you want to approve this enrollment?"
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
            Approve
          </button>
        </ConfirmationModal>
      )}
      {rejectItem && (
        <WarningModal
          isOpen={!!rejectItem}
          closeModal={() => { setRejectItem(null); setRemarks(""); }}
          title="Temporary Enrolled Enrollment"
          description="Are you sure you want to mark this enrollment temporary enrolled?"
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
                <option value="Incomplete Requirements">Incomplete Requirements</option>
              </select>
            </div>

            <div className="flex justify-end">

              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mr-2"
                onClick={() => { setRejectItem(null); setRemarks(""); }}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600" onClick={handleReject}
              >
                Mark as Temporary Enrolled
              </button>
            </div>
          </div>


        </WarningModal>
      )}



    </div>
  );
}

export default Enrollment;