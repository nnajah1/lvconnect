import { PiIdentificationCardFill } from "react-icons/pi";
import "@/styles/student_enrollment_form.css"
import { useEffect, useState } from "react";
import { getEnrollee, getEnrollment } from "@/services/enrollmentAPI";
import { Loader2, Loader3 } from "@/components/dynamic/loader";
import EnrollmentForm from "@/components/enrollment/userEnrollmentForm";
import { formatLabel } from "@/utils/formatDate";

const UserEnrollment = ({ mode, editType }) => {
  const [enrollment, setEnrollment] = useState(null);
  const [allEnrollees, setAllEnrollees] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [studentData, setStudentData] = useState({
    program_id: "",
    year_level: "",
    email: "",
    student_id_number: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    civil_status: "",
    gender: "",
    birth_date: "",
    birth_place: "",
    mobile_number: "",
    religion: "",
    lrn: "",
    fb_link: "",
    student_type: "",
    government_subsidy: "",
    scholarship_status: "",
    last_school_attended: "",
    previous_school_address: "",
    school_type: "",
    academic_awards: "",

    // Laravel expects address as nested object
    address: {
      floor_unit_building_no: "",
      house_no_street: "",
      barangay: "",
      city_municipality: "",
      province: "",
      zip_code: "",
    },

    privacy_policy: false, // boolean

    // Laravel expects guardian, mother, father as nested objects
    guardian: {
      first_name: "",
      middle_name: "",
      last_name: "",
      religion: "",
      occupation: "",
      monthly_income: "",
      mobile_number: "",
      relationship: "",
    },
    mother: {
      first_name: "",
      middle_name: "",
      last_name: "",
      religion: "",
      occupation: "",
      monthly_income: "",
      mobile_number: "",
    },
    father: {
      first_name: "",
      middle_name: "",
      last_name: "",
      religion: "",
      occupation: "",
      monthly_income: "",
      mobile_number: "",
    },

    // Laravel expects these as flat fields
    num_children_in_family: 0,
    birth_order: 0,
    has_sibling_in_lvcc: false,
  });



  const loadEnrollment = async () => {
    setIsLoading(true);
    try {
      const res = await getEnrollment();
      setEnrollment(res.data);
      setAllEnrollees(res.all_enrollees);
      setStudentId(res.student_id)
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEnrollment();
  }, []);



  useEffect(() => {
    if (!studentId) return;

    const loadStudentInfo = async () => {
      setIsLoading(true);
      try {
        const data = await getEnrollee(studentId);
        setStudentData(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudentInfo();
  }, [studentId]);


  const toggleEnroll = () => setExpanded(!expanded);

  if (isLoading) {
    return (
     <Loader3 />
    )
  };

  if (!enrollment) {
    return (
      <div className="student-form-container">
        <h1 className="bg-white px-6 py-4 rounded-xl text-center text-xl font-medium text-gray-800 shadow-md">
          Enrollment is not yet open
        </h1>
      </div>
    );
  }

  const enrolleeRecords = allEnrollees || [];
  const yearLevelMap = {
    1: '1st year',
    2: '2nd year',
    3: '3rd year',
    4: '4th year'
  };

  const latestRecord = [...enrolleeRecords]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .find(rec => rec.program?.program_name && rec.year_level);

  let latestRecordYearDisplay = '';
  if (latestRecord && latestRecord.year_level) {
    latestRecordYearDisplay = yearLevelMap[latestRecord.year_level] || 'N/A';
  } else {
    latestRecordYearDisplay = 'No year level data';
  }

  // 1. Filter for records belonging to the active enrollment schedule
  const activeScheduleRecords = enrolleeRecords.filter(
    rec => rec.enrollment_schedule_id === enrollment.id
  );

  // 2. Filter for previous enrollment records (not matching the active schedule)
  const previousEnrolleeRecords = enrolleeRecords.filter(
    rec => rec.enrollment_schedule_id !== enrollment.id
  );

  // 3. Group previous records by academic year
  const groupedPreviousRecords = previousEnrolleeRecords.reduce((acc, record) => {
    const academicYear = record.enrollment_schedule?.academic_year?.school_year;
    if (academicYear) {
      if (!acc[academicYear]) {
        acc[academicYear] = [];
      }
      acc[academicYear].push(record);
    }
    return acc;
  }, {});

  // Convert grouped object to an array of [year, records] pairs for easier mapping and sorting
  const sortedAcademicYears = Object.entries(groupedPreviousRecords).sort((a, b) => {
    // Basic numerical sort for academic years (e.g., "2023-2024" vs "2024-2025")
    const yearA = parseInt(a[0].split('-')[0]);
    const yearB = parseInt(b[0].split('-')[0]);
    return yearB - yearA; // Sort descending (latest academic year first)
  });

  // Check for submission button conditions
  const hasRecordForActiveSchedule = activeScheduleRecords.length > 0; // Simplified check
  const hasRejectedRecordForActiveSchedule = activeScheduleRecords.some(
    rec => rec.enrollment_status === 'Rejected'
  );

  return (
    <div className="student-form-wrapper">
      <h1 className="student-form-title">Enrollment</h1>

      {/* --- Current Enrollment Schedule Section --- */}
     <div className="student-form-container">
      <div className="student-form-header">
        Current Enrollment Schedule: {enrollment.academic_year?.school_year} - {formatLabel(enrollment.semester)}
      </div>
      {!expanded && (
        <div className="flex items-start justify-between m-6 border border-gray-300 rounded-md p-6">

          <div className="flex flex-col  flex-grow">
            {latestRecord && (
              <p className="subenroll-program-text">
                <span className="subenroll-label">Program & Year Level:</span>{" "}
                {latestRecord.program?.program_name} - {latestRecordYearDisplay}
              </p>
            )}

            {hasRecordForActiveSchedule ? (
              activeScheduleRecords.map((record, idx) => (
                <div
                  key={record.id || idx}
                >
                  {/* Showing submission date and status of THIS specific submission */}
                  <div className="text-xs text-gray-500 mb-1">
                    Submitted: {new Date(record.submission_date).toLocaleDateString()}
                  </div>
                  <div className="subenroll-status mb-2">
                    <span
                      className={`subenroll-status-label ${record.enrollment_status === 'Enrolled'
                        ? 'text-green-600'
                        : record.enrollment_status === 'pending'
                          ? 'text-yellow-600'
                          : record.enrollment_status === 'Rejected'
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}
                    >
                      Status: {record.enrollment_status}
                    </span>
                  </div>
                  {record.admin_remarks && record.admin_remarks.trim() !== "" && (
                    <p className="text-sm text-gray-500 italic">
                      Admin Remarks: {record.admin_remarks}
                    </p>
                  )}
                </div>
              ))
            ) : (
              // Fallback for "Not yet enrolled"
              <div className="subenroll-status">
                <p className="text-gray-600 font-semibold">
                  Not enrolled
                </p>
              </div>
            )}
          </div> {/* END left-aligned content wrapper */}

          <div>
            {(enrollment.is_active &&
              (!hasRecordForActiveSchedule || hasRejectedRecordForActiveSchedule)) && (
                <button onClick={toggleEnroll} className="subenroll-submit-btn cursor-pointer whitespace-nowrap">
                  <PiIdentificationCardFill className="mr-2 h-5 w-5" />
                  Submit Enrollment
                </button>
              )}
          </div>
        </div>
      )}
        {expanded && (
          <EnrollmentForm
            mode={mode}
            editType={editType}
            studentId={studentId}
            studentData={studentData}
            setStudentData={setStudentData}
            enrollmentData={enrollment}
            setLoading={setIsLoading}
            isExpanded={setExpanded}
            loadEnroll={loadEnrollment}
          />
        )}
      </div>

      {/* --- Previous Enrollment Records Section --- */}
      {sortedAcademicYears.length > 0 && (
        <div className="student-form-container mt-8"> {/* Added margin-top for separation */}
          <div className="student-form-header">
            Previous Enrollment Records
          </div>
          <div className="m-6 border border-gray-300 rounded-md p-6">
            {sortedAcademicYears.map(([academicYear, records]) => (
              <div key={academicYear} className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
                  Academic Year: {academicYear}
                </h3>
                {records.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((record, idx) => ( // Sort records within each year by created_at
                  <div
                    key={record.id || idx}
                    className="mb-4 p-4 border rounded-lg bg-gray-50"
                  >
                    {record.program?.program_name && record.year_level && (
                      <p className="text-sm font-medium text-gray-800 mb-1">
                        Program and year level: {record.program.program_name} - {yearLevelMap[record.year_level] || 'N/A'}
                      </p>
                    )}
                    <div className="text-xs text-gray-500 mb-1">
                      Semester: {formatLabel(record.enrollment_schedule?.semester)} | Submitted: {new Date(record.submission_date).toLocaleDateString()}
                    </div>
                    <div className="subenroll-status mb-2">
                       <span
                        className={`subenroll-status-label ${record.enrollment_status === 'enrolled'
                          ? 'text-green-600' : record.enrollment_status === 'pending' ? 'text-yellow-600'
                          : record.enrollment_status === 'Rejected'
                            ? 'text-red-600'
                            : 'text-gray-600'
                          }`}
                      >
                        Status: {record.enrollment_status}
                      </span>
                    </div>
                    {record.admin_remarks && record.admin_remarks !== "" && (
                      <p className="text-sm text-gray-500 italic">
                        Admin Remarks: {record.admin_remarks}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


export default UserEnrollment;
