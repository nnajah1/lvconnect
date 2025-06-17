import { PiIdentificationCardFill } from "react-icons/pi";
import "@/styles/student_enrollment_form.css"
import { useEffect, useState } from "react";
import { getEnrollee, getEnrollment } from "@/services/enrollmentAPI";
import { Loader2, Loader3 } from "@/components/dynamic/loader";
import EnrollmentForm from "@/components/enrollment/userEnrollmentForm";
import { formatLabel } from "@/utils/formatDate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLocation, useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();


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

  const activeScheduleRecords = enrolleeRecords.filter(
    rec => rec.enrollment_schedule_id === enrollment.id
  );
  const previousEnrolleeRecords = enrolleeRecords.filter(
    rec => rec.enrollment_schedule_id !== enrollment.id
  );

  const hasRecordForActiveSchedule = activeScheduleRecords.length > 0;
  const hasRejectedRecordForActiveSchedule = activeScheduleRecords.some(
    rec => rec.enrollment_status === 'Rejected'
  );

  const activeYear = enrollment.academic_year?.school_year;
  const activeSemester = enrollment.semester;

  const combinedGroupedRecords = {};

  // Add active semester
  if (activeYear && activeSemester) {
    if (!combinedGroupedRecords[activeYear]) {
      combinedGroupedRecords[activeYear] = {};
    }
    if (!combinedGroupedRecords[activeYear][activeSemester]) {
      combinedGroupedRecords[activeYear][activeSemester] = [];
    }
    combinedGroupedRecords[activeYear][activeSemester].push(...activeScheduleRecords);
  }

  // Add previous records
  previousEnrolleeRecords.forEach(record => {
    const year = record.enrollment_schedule?.academic_year?.school_year;
    const semester = record.enrollment_schedule?.semester || 'Unknown';

    if (year) {
      if (!combinedGroupedRecords[year]) {
        combinedGroupedRecords[year] = {};
      }
      if (!combinedGroupedRecords[year][semester]) {
        combinedGroupedRecords[year][semester] = [];
      }
      combinedGroupedRecords[year][semester].push(record);
    }
  });

  const sortedYearsWithSemesters = Object.entries(combinedGroupedRecords).sort((a, b) => {
    const yearA = parseInt(a[0].split('-')[0]);
    const yearB = parseInt(b[0].split('-')[0]);
    return yearB - yearA;
  });

  console.log(enrolleeRecords)
  return (
    <div className="enrollment-dashboard-wrapper p-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a2b4c]">Enrollment</h1>
        <p className="text-sm text-gray-600 mt-1">
          Submit enrollment for the semester by updating your information.
        </p>
      </div>
      {/* {expanded && (
        <div className="md:col-span-2">
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
        </div>
      )} */}
      {sortedYearsWithSemesters.length > 0 && (
        <div className="mt-10 space-y-6">
          {sortedYearsWithSemesters.map(([academicYear, semesters]) => (
            <div key={academicYear} className="border border-gray-200 rounded-lg p-4 ">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 pb-2">
                Academic Year: {academicYear}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(semesters).map(([semester, records]) => {
                  const isCurrentActiveSemester =
                    academicYear === activeYear && semester === activeSemester;

                  return (
                    <Card key={semester} className="border border-gray-100 shadow-sm">
                      <div className="border-b border-gray-200 text-lg font-semibold px-4 py-2">
                        <p>{formatLabel(semester)}</p>
                      </div>
                      <CardContent className="space-y-3">
                        {records
                          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                          .map((record, idx) => (
                            <div key={record.id || idx} className="space-y-1">
                              {/* {record.program?.program_name && record.year_level && (
                                <p className="text-sm font-medium text-gray-800">
                                  Program & Year Level: {record.program.program_name} - {yearLevelMap[record.year_level] || 'N/A'}
                                </p>
                              )} */}
                              <div className="text-xs text-gray-500">
                                Submitted: {new Date(record.submission_date).toLocaleDateString()}
                              </div>
                              <div className="status-info">
                                <span className="status-label text-sm font-medium text-gray-600">Status:</span>
                                <Badge className={`ml-2 ${record.enrollment_status === 'enrolled'
                                  ? 'bg-green-100 text-green-800'
                                  : record.enrollment_status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : record.enrollment_status === 'Rejected'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}>
                                  {record.enrollment_status}
                                </Badge>
                              </div>
                              {record.admin_remarks?.trim() && record.enrollment_status !== "enrolled" && (
                                <p className="text-sm text-gray-500 italic">
                                  Admin Remarks: {record.admin_remarks}
                                </p>
                              )}
                            </div>
                          ))}
                        {isCurrentActiveSemester &&
                          (enrollment.is_active &&
                            (!hasRecordForActiveSchedule || hasRejectedRecordForActiveSchedule)) && (
                            <Button
                              onClick={() =>
                                navigate('/my/enrollment/enrollment-form', {
                                  state: {
                                    mode,
                                    editType,
                                    studentId,
                                    studentData,
                                    enrollmentData: enrollment,
                                    // loadEnrollment
                                  },
                                })
                              }
                              className="submit-enrollment-btn w-full bg-slate-700 hover:bg-slate-800 text-white"
                            >
                              Submit Enrollment
                            </Button>
                          )}

                      </CardContent>
                    </Card>
                  );
                })}

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );



};


export default UserEnrollment;
