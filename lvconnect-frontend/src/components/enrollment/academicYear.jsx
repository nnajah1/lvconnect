import { createAcademicYear, getAcademicYears, getEnrollmentSchedule, toggleEnrollmentSchedule } from "@/services/enrollmentAPI";
import { formatDate, formatDateTime } from "@/utils/formatDate";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { InfoModal } from "../dynamic/alertModal";

const AcademicYear = ({
    selectedYear,
    setSelectedYear,
    semester,
    setSemester,
    currentSchedule,
    setCurrentSchedule,
    isEnrollmentOpen,
    setIsEnrollmentOpen,
    selectedYearObj,
    academicYears,
    setAcademicYears
}) => {
    const [newYear, setNewYear] = useState("");
    const [loadingYears, setLoadingYears] = useState(false);
    const [loadingToggle, setLoadingToggle] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isOpenAddModal, setIsOpenAddModal] = useState(false);

    // Fetch academic years on mount
    useEffect(() => {
        const fetchYears = async () => {
            // Restore from localStorage
            const savedYear = localStorage.getItem("selectedYear");
            const savedSemester = localStorage.getItem("selectedSemester");
            // *** NEW: Retrieve saved enrollment open state ***
            const savedIsEnrollmentOpen = localStorage.getItem("isEnrollmentOpen");


            if (savedYear) setSelectedYear(savedYear);
            if (savedSemester) setSemester(savedSemester);
            // *** NEW: Apply saved enrollment open state immediately ***
            if (savedIsEnrollmentOpen !== null) { // Check for null to differentiate from 'false'
                setIsEnrollmentOpen(JSON.parse(savedIsEnrollmentOpen));
            }


            // Fetch academic years
            setLoadingYears(true);
            try {
                const res = await getAcademicYears();
                setAcademicYears(res.data.data);

                // If no saved year, set to active or first available
                if (!savedYear) {
                    const activeYear = res.data.data.find((y) => y.is_active);
                    const defaultYear = activeYear?.school_year || res.data.data[0]?.school_year || "";
                    setSelectedYear(defaultYear);
                    localStorage.setItem("selectedYear", defaultYear);
                }
            } catch (e) {
                toast.error("Failed to load academic years");
            } finally {
                setLoadingYears(false);
            }
        };

        fetchYears();
    }, []);


    // Fetch enrollment schedule when year and semester change
    useEffect(() => {
        if (!selectedYearObj || !semester) {
            setCurrentSchedule(null);
            setIsEnrollmentOpen(false); // Reset if no valid selection
            // *** NEW: Also clear from localStorage if selection is invalid ***
            localStorage.removeItem("isEnrollmentOpen");
            return;
        }

        const fetchSchedule = async () => {
            try {
                const res = await getEnrollmentSchedule({
                    academic_year_id: selectedYearObj.id,
                    semester,
                });
                setCurrentSchedule(res.data.data);
                const newStatus = res.data.data?.is_active || false;
                setIsEnrollmentOpen(newStatus);
                // *** NEW: Save the actual fetched status to localStorage ***
                localStorage.setItem("isEnrollmentOpen", JSON.stringify(newStatus));
            } catch {
                setCurrentSchedule(null);
                setIsEnrollmentOpen(false); // Reset if fetching fails
                // *** NEW: Also clear from localStorage if fetching fails ***
                localStorage.removeItem("isEnrollmentOpen");
            }
        };

        fetchSchedule();
    }, [selectedYearObj, semester]);

    // This useEffect is good for saving selectedYear and semester
    useEffect(() => {
        if (selectedYear) {
            localStorage.setItem("selectedYear", selectedYear);
        }
        if (semester) {
            localStorage.setItem("selectedSemester", semester);
        }
    }, [selectedYear, semester]);


    const validateNewYear = () => {
        if (!newYear.trim()) {
            toast.error("Please enter an academic year");
            return false;
        }

        const regex = /^\d{4}-\d{4}$/;
        if (!regex.test(newYear)) {
            toast.error("Academic year format must be YYYY-YYYY");
            return false;
        }

        const [newStart, newEnd] = newYear.split("-").map(Number);
        const latestYear = academicYears?.[0]?.school_year;

        if (latestYear) {
            const [latestStart, latestEnd] = latestYear.split("-").map(Number);
            if (newStart !== latestStart + 1 || newEnd !== latestEnd + 1) {
                toast.error(`You can only add the next academic year after ${latestYear}`);
                return false;
            }
        }

        return true;
    };

    const handleAddYear = async () => {
        setLoadingYears(true);
        try {
            await createAcademicYear(newYear.trim());
            toast.success("Academic year added");
            setNewYear("");
            const res = await getAcademicYears();
            setAcademicYears(res.data.data);
            setSelectedYear(newYear.trim());
            setIsOpenAddModal(false);
        } catch (e) {
            toast.error("Failed to add academic year");
        } finally {
            setLoadingYears(false);
        }
    };


    // Toggle enrollment open/close
    const handleToggleEnrollment = async () => {
        if (!selectedYearObj || !semester) {
            toast.error("Select academic year and semester first");
            return;
        }
        setLoadingToggle(true);
        try {
            const res = await toggleEnrollmentSchedule({
                academic_year_id: selectedYearObj.id,
                semester,
                is_active: !isEnrollmentOpen,
                id: currentSchedule?.id || null,

            });
            const newStatus = res.data.data?.is_active || false;
            setCurrentSchedule(res.data.data);
            setIsEnrollmentOpen(newStatus); // Set based on the actual response
            // *** NEW: Save the updated status to localStorage immediately after toggling ***
            localStorage.setItem("isEnrollmentOpen", JSON.stringify(newStatus));
            toast.success(`Enrollment ${newStatus ? "opened" : "closed"}`);
        } catch (e) {
            toast.error("Failed to toggle enrollment");

        } finally {
            setLoadingToggle(false);
        }
    };
    const handleValidateAndOpenModal = () => {
        if (validateNewYear()) {
            setIsOpenAddModal(true);
        }
    };

    return (
        <div className="bg-white rounded shadow p-4 mb-4 flex flex-col md:flex-row md:items-center md:gap-6">
            {/* Academic Year */}
            <div className="flex flex-col mb-4 md:mb-0">
                <label className="text-gray-700 font-semibold mb-1">Academic Year</label>
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    disabled={loadingYears}
                >
                    <option value="">Select Year</option>
                    {academicYears.map((year) => (
                        <option key={year.id} value={year.school_year}>
                            {year.school_year} {year.is_active && "(Active)"}
                        </option>
                    ))}
                </select>
            </div>

            {/* Semester */}
            <div className="flex flex-col mb-4 md:mb-0">
                <label className="text-gray-700 font-semibold mb-1">Semester</label>
                <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    disabled={!selectedYear}
                >
                    <option value="">Select Semester</option>
                    <option value="first_semester">1st Semester</option>
                    <option value="second_semester">2nd Semester</option>
                </select>
            </div>

            {/* Enrollment Toggle */}
            <div className="flex flex-col items-start mb-4 md:mb-0">
                <label className="text-gray-700 font-semibold mb-1">Enrollment Toggle</label>
                <button
                    onClick={() => setIsOpenModal(true)}
                    disabled={!selectedYear || !semester || loadingToggle || !selectedYearObj?.is_active}
                    className={`px-4 py-2 rounded font-semibold text-white transition ${isEnrollmentOpen
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                        } disabled:opacity-50`}
                >
                    {loadingToggle ? "Processing..." : isEnrollmentOpen ? "Close Enrollment" : "Open Enrollment"}
                </button>
            </div>

            {currentSchedule && (
                <div className="flex flex-col mb-4 md:mb-0">
                    <div>
                        <strong>Enrollment Status:</strong>{" "}
                        <span className={currentSchedule.is_active ? "text-green-600" : "text-red-600"}>
                            {currentSchedule.is_active ? "Open" : "Closed"}
                        </span>
                    </div>
                    {currentSchedule.start_date && (
                        <div>Start: {formatDateTime(currentSchedule.start_date)}</div>
                    )}
                    {currentSchedule.end_date && (
                        <div>End: {formatDateTime(currentSchedule.end_date)}</div>
                    )}
                </div>
            )}

            {/* Add New Academic Year */}
            <div className="flex flex-col items-start ml-auto max-w-xs">
                <label className="text-gray-700 font-semibold mb-1">Add Academic Year</label>
                <div className="flex gap-2 w-full">
                    <input
                        type="text"
                        placeholder="e.g. 2023-2024"
                        value={newYear}
                        onChange={(e) => setNewYear(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={handleValidateAndOpenModal}
                        disabled={loadingYears}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 rounded disabled:opacity-50"
                    >
                        {loadingYears ? "Adding..." : "Add"}
                    </button>
                </div>
                {isOpenAddModal && (
                    <InfoModal
                        isOpen={isOpenAddModal}
                        closeModal={() => setIsOpenAddModal(false)}
                        title="Confirm Adding Academic Year"
                        description={`Are you sure you want to add new academic year ${newYear}?`}
                    >
                        <button
                            onClick={() => setIsOpenAddModal(false)}
                            className="mr-3 px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                handleAddYear();
                                setIsOpenAddModal(false);
                            }}
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Confirm
                        </button>
                    </InfoModal>
                )}
            </div>

            {/* Modal */}
            {isOpenModal && (
                <InfoModal
                    isOpen={isOpenModal}
                    closeModal={() => setIsOpenModal(false)}
                    title="Confirm Enrollment Toggle"
                    description={`Are you sure you want to ${isEnrollmentOpen ? "close" : "open"
                        } enrollment for ${selectedYear}, ${semester === "first_semester" ? "1st Semester" : "2nd Semester"
                        }?`}
                >
                    <button
                        onClick={() => setIsOpenModal(false)}
                        className="mr-3 px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            handleToggleEnrollment();
                            setIsOpenModal(false);
                        }}
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Confirm
                    </button>
                </InfoModal>
            )}
        </div>
    );
};

export default AcademicYear;