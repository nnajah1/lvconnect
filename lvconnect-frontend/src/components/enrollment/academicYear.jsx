import { createAcademicYear, getAcademicYears, getEnrollmentSchedule, toggleEnrollmentSchedule } from "@/services/enrollmentAPI";
import { useEffect, useState } from "react";

const AcademicYear = () => {
    const [academicYears, setAcademicYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [newYear, setNewYear] = useState("");
    const [loading, setLoading] = useState(false);

    const [semester, setSemester] = useState("1st_semester");
    const [currentSchedule, setCurrentSchedule] = useState(null);
    const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);

    const selectedYearObj = academicYears.find((y) => y.school_year === selectedYear);

    useEffect(() => {
        const fetchYears = async () => {
            try {
                const res = await getAcademicYears();
                const years = res.data.data;
                setAcademicYears(years);

                const active = years.find((y) => y.is_active);
                const defaultYear = active?.school_year || years[0]?.school_year;
                setSelectedYear(defaultYear);
            } catch (e) {
                console.error("Failed to fetch academic years", e);
            }
        };

        fetchYears();
    }, []);

    useEffect(() => {
        const fetchSchedule = async () => {
            if (!selectedYearObj) return;
            try {
                const res = await getEnrollmentSchedule({
                    academic_year_id: selectedYearObj.id,
                    semester,
                });
                const schedule = res.data.data;
                setCurrentSchedule(schedule);
                setIsEnrollmentOpen(schedule?.is_active || false);
            } catch (err) {
                console.error("Failed to fetch enrollment schedule", err);
                setCurrentSchedule(null);
                setIsEnrollmentOpen(false);
            }
        };

        fetchSchedule();
    }, [selectedYear, semester]);

    const isValidFormat = (year) => {
        if (!/^\d{4}-\d{4}$/.test(year)) return false;
        const [start, end] = year.split("-").map(Number);
        if (end !== start + 1) return false;

        const latest = academicYears[0];
        if (latest) {
            const [latestStart] = latest.school_year.split("-").map(Number);
            if (start < latestStart) return false;
        }

        return true;
    };

    const handleAddYear = async () => {
        if (!isValidFormat(newYear)) {
            alert("School year must be in format YYYY-YYYY and consecutive (e.g., 2024-2025)");
            return;
        }
        setLoading(true);
        try {
            const res = await createAcademicYear(newYear);
            const resAll = await getAcademicYears();
            setAcademicYears(resAll.data.data);
            setSelectedYear(res.data.data.school_year);
            setNewYear("");
        } catch (error) {
            console.error("Failed to create academic year", error);
            alert(error.response?.data?.message || "Failed to add academic year");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleEnrollment = async () => {
        if (!selectedYearObj) return;

        // Prevent toggling 2nd semester if 1st does not exist
        if (semester === "second_semester") {
            const hasFirstSemester = academicYears.find(
                y => y.id === selectedYearObj.id &&
                    y.enrollment_schedules?.some(s => s.semester === "1st_semester")
            );
            if (!hasFirstSemester) {
                alert("Cannot open 2nd semester before 1st semester exists.");
                return;
            }
        }
        try {
            const res = await toggleEnrollmentSchedule({
                academic_year_id: selectedYearObj.id,
                semester,
                is_active: !isEnrollmentOpen,
                id: currentSchedule?.id || null,
            });

            setCurrentSchedule(res.data.data);
            setIsEnrollmentOpen(res.data.data.is_active);
        } catch (err) {
            console.error("Failed to toggle enrollment", err);
            alert(err.response?.data?.message || "Error toggling enrollment");
        }
    };

    return (
        <div className="p-4 max-w-6xl mx-auto bg-white rounded-lg shadow-md flex flex-row items-center justify-evenly gap-6 w-full">
            <div> <h2 className="text-xl font-bold text-gray-800 w-48 shrink-0">Academic Year</h2>

                <div className="flex gap-4 ">
                    {/* Academic Year Selection */}
                    <div className="w-full">
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Current Academic Year
                            </label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {academicYears.map((year) => (
                                    <option key={year.id} value={year.school_year}>
                                        {year.school_year} {year.is_active ? "(Active)" : ""}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Add New Academic Year */}
                    <div className="w-full">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Add New Academic Year
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="e.g. 2024-2025"
                                value={newYear}
                                onChange={(e) => setNewYear(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div>
                                <button
                                    onClick={handleAddYear}
                                    disabled={loading}
                                    className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Adding..." : "Add Year"}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Enrollment Schedule Section */}
            <div className="border-l pl-6 ">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Enrollment Schedule</h3>
                <div className="flex items-center gap-4 mb-3">
                    <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="1st_semester">1st Semester</option>
                        <option value="second_semester">2nd Semester</option>
                    </select>

                    <button
                        onClick={handleToggleEnrollment}
                        className={`px-4 py-2 rounded text-white ${isEnrollmentOpen
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                            }`}
                    >
                        {isEnrollmentOpen ? "Close Enrollment" : "Open Enrollment"}
                    </button>
                </div>

                {currentSchedule && (
                    <div className="mt-2 text-sm text-gray-600">
                        Status: <strong>{currentSchedule.is_active ? "Open" : "Closed"}</strong>
                        <br />
                        {currentSchedule.start_date && `Start: ${currentSchedule.start_date}`}
                        <br />
                        {currentSchedule.end_date && `End: ${currentSchedule.end_date}`}
                    </div>
                )}
            </div>
        </div>
    );
};


export default AcademicYear;