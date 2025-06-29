import { createAcademicYear, getAcademicYears, getEnrollmentSchedule, toggleEnrollmentSchedule } from "@/services/enrollmentAPI";
import { formatDate, formatDateTime } from "@/utils/formatDate";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { InfoModal } from "../dynamic/alertModal";
import TooltipComponent from "../dynamic/tooltip";
import { BsFillInfoCircleFill } from "react-icons/bs";
import api from "@/services/axios";
import { Loader3, Loader4 } from "../dynamic/loader";

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

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [scheduleOpened, setScheduleOpened] = useState(false); // controls UI toggle

    // Fetch academic years on mount
    useEffect(() => {
        const fetchYears = async () => {
            // Restore from localStorage
            const savedYear = localStorage.getItem("selectedYear");
            const savedSemester = localStorage.getItem("selectedSemester");


            if (savedYear) setSelectedYear(savedYear);
            if (savedSemester) setSemester(savedSemester);


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
            setIsEnrollmentOpen(false);
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
            } catch {
                setCurrentSchedule(null);
            }
        };

        fetchSchedule();
    }, [selectedYearObj, semester]);

    // This useEffect is for saving selectedYear and semester
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
            toast.error("Please select an academic year");
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

            if (newStart > currentYear) {
                toast.error("You cannot add future academic years yet");
                return false;
            }
        }

        return true;
    };

    const handleAddYear = async () => {
        if (!validateNewYear()) return;

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
    // const handleToggleEnrollment = async () => {
    //     if (!selectedYearObj || !semester) {
    //         toast.error("Select academic year and semester first");
    //         return;
    //     }
    //     setLoadingToggle(true);
    //     try {
    //         const res = await toggleEnrollmentSchedule({
    //             academic_year_id: selectedYearObj.id,
    //             semester,
    //             is_active: !isEnrollmentOpen,
    //             id: currentSchedule?.id || null,

    //         });
    //         const newStatus = res.data.data?.is_active || false;
    //         setCurrentSchedule(res.data.data);
    //         setIsEnrollmentOpen(newStatus); // Set based on the actual response
    //         // localStorage.setItem("isEnrollmentOpen", JSON.stringify(newStatus));
    //         toast.success(`Enrollment ${newStatus ? "opened" : "closed"}`);
    //     } catch (e) {
    //         toast.error("Failed to toggle enrollment");

    //     } finally {
    //         setLoadingToggle(false);
    //     }
    // };

    const handleValidateAndOpenModal = () => {
        if (validateNewYear()) {
            setIsOpenAddModal(true);
        }
    };


    const currentYear = new Date().getFullYear();
    const latestYear = academicYears?.[0]?.school_year;
    let nextYearToAdd = "";
    let disableAdd = false;

    if (latestYear) {
        const [latestStart, latestEnd] = latestYear.split("-").map(Number);
        if (latestStart >= currentYear) {
            disableAdd = true; // It's still the latest year, no future year allowed
        } else {
            nextYearToAdd = `${latestStart + 1}-${latestEnd + 1}`;
        }
    } else {
        // If no academic year exists, allow first one
        nextYearToAdd = `${currentYear}-${currentYear + 1}`;
    }

    useEffect(() => {
        const fetchActiveSchedule = async () => {
            setLoading(true)
            try {
                const res = await api.get('/enrollment-schedule/active');
                if (res.data.active) {
                    const { school_year, semester, start_date, end_date } = res.data.data;
                    setSelectedYear(school_year);
                    setSemester(semester);
                    setStartDate(start_date);
                    setEndDate(end_date);
                    setScheduleOpened(true);
                } else {
                    setScheduleOpened(false);
                }
            } catch (err) {
                console.error('Failed to fetch active schedule');
            } finally {
                setLoading(false)
            }
        };

        fetchActiveSchedule();
    }, []);

    const handleOpen = async () => {
        setLoading(true);
        setMessage('');
        try {
            const res = await api.post('/enrollment-schedule/open', {
                academic_year_id: selectedYearObj.id,
                semester,
                start_date: startDate,
                end_date: endDate,
            });
            toast.success(res.data.message || 'Schedule opened.');
            setScheduleOpened(true); // Show only dates and close button
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = async () => {
        setLoading(true);
        setMessage('');
        try {
            const res = await api.post('/enrollment-schedule/close', {
                academic_year_id: selectedYearObj.id,
                semester,
            });
            setMessage(res.data.message || 'Schedule closed.');
            setScheduleOpened(false); // Show form again
            setStartDate('');
            setEndDate('');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };
    const today = new Date().toISOString().split("T")[0];


    // if(loading) {
    //     return <Loader4 />
    // }
    return (
        <div className="bg-white rounded shadow p-4 mb-4 flex justify-evenly items-center">
            {/* All elements in flex-row layout */}
            <div className="flex flex-row flex-wrap items-end gap-4 w-full">
                {/* Academic Year */}
                <div className="flex flex-col flex-1 min-w-[200px]">
                    <label className="text-gray-700 font-semibold mb-1">Academic Year</label>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 h-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                <div className="flex flex-col flex-1 min-w-[150px]">
                    <label className="text-gray-700 font-semibold mb-1">Semester</label>
                    <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 h-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        disabled={!selectedYear}
                    >
                        <option value="">Select Semester</option>
                        <option value="first_semester">1st Semester</option>
                        <option value="second_semester">2nd Semester</option>
                    </select>
                </div>

                {/* Start Date */}
                <div className="flex flex-col flex-1 min-w-[120px]">
                    <label className="text-gray-700 font-semibold mb-1">Start Date</label>
                    {!scheduleOpened ? (
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 h-10 m-auto"
                            min={today}
                        />
                    ) : (
                        <div className="border border-gray-200 rounded px-3 py-2 h-10 bg-gray-50 flex items-center text-sm">
                            📅 {formatDate(startDate) || 'N/A'}
                        </div>
                    )}
                </div>

                {/* End Date */}
                <div className="flex flex-col flex-1 min-w-[120px]">
                    <label className="text-gray-700 font-semibold mb-1">End Date</label>
                    {!scheduleOpened ? (
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 h-10 m-auto"
                            min={startDate || today}
                        />
                    ) : (
                        <div className="border border-gray-200 rounded px-3 py-2 h-10 bg-gray-50 flex items-center text-sm">
                            📅 {formatDate(endDate) || 'N/A'}
                        </div>
                    )}
                </div>

                {/* Schedule Action */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold mb-1">Schedule</label>
                    {!scheduleOpened ? (
                        <button
                            onClick={handleOpen}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded px-3 py-2 h-10 text-sm whitespace-nowrap"
                        >
                            {loading ? 'Opening...' : 'Open'}
                        </button>
                    ) : (
                        <button
                            onClick={handleClose}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-2 h-10 rounded text-sm whitespace-nowrap"
                        >
                            {loading ? 'Closing...' : 'Close'}
                        </button>
                    )}
                </div>

                {/* Add Academic Year */}
                <div className="flex flex-col flex-1 min-w-[250px]">
                    <label className="text-gray-700 font-semibold mb-1">Add Academic Year</label>
                    <div className="flex gap-2 items-center h-10">
                        <select
                            value={newYear}
                            onChange={(e) => setNewYear(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 h-10 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            disabled={disableAdd}
                        >
                            <option value="">Select year</option>
                            {nextYearToAdd && (
                                <option value={nextYearToAdd} key={nextYearToAdd}>
                                    {nextYearToAdd}
                                </option>
                            )}
                        </select>

                        <button
                            onClick={handleValidateAndOpenModal}
                            disabled={loadingYears || !newYear || disableAdd}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 h-10 rounded disabled:opacity-50 whitespace-nowrap"
                        >
                            {loadingYears ? "Adding..." : "Add"}
                        </button>

                        <TooltipComponent text="You cannot add a future academic year until the current one ends.">
                            <BsFillInfoCircleFill size={14} />
                        </TooltipComponent>
                    </div>
                </div>
            </div>


            {/* Modals */}
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

            {/* Confirm Toggle Enrollment Modal */}
            {isOpenModal && (
                <InfoModal
                    isOpen={isOpenModal}
                    closeModal={() => setIsOpenModal(false)}
                    title="Confirm Enrollment Toggle"
                    description={`Are you sure you want to ${isEnrollmentOpen ? "close" : "open"} enrollment for ${selectedYear}, ${semester === "first_semester" ? "1st Semester" : "2nd Semester"}?`}
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