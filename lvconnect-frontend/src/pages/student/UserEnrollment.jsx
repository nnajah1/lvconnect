import { PiIdentificationCardFill } from "react-icons/pi";
import "@/styles/student_enrollment_form.css"
import { useEffect, useState } from "react";
import { getEnrollment } from "@/services/enrollmentAPI";
import { Loader2 } from "@/components/dynamic/loader";
import EnrollmentForm from "@/components/enrollment/userEnrollmentForm";

const UserEnrollment = ({mode, editType}) => {
  const [enrollment, setEnrollment] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadEnrollment = async () => {
    setIsLoading(true);
    try {
      const res = await getEnrollment(); // now returns one active schedule object
      setEnrollment(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEnrollment();
  }, []);

  const toggleEnroll = () => setExpanded(!expanded);

  if (isLoading) return <Loader2 />;

  if (!enrollment) {
    return (
      <div className="student-form-container">
        <h1 className="bg-white px-6 py-4 rounded-xl text-center text-xl font-medium text-gray-800 shadow-md">
          Enrollment is not yet open
        </h1>
      </div>
    );
  }

  const enrolleeRecords = enrollment.enrollees || [];

  const latestRecord = [...enrolleeRecords]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .find(rec => rec.program && rec.yearLevel);

  const hasRecordForActiveSchedule = enrolleeRecords.some(
    rec => rec.enrollment_schedule_id === enrollment.id
  );

  const hasRejectedRecordForActiveSchedule = enrolleeRecords.some(
    rec =>
      rec.enrollment_schedule_id === enrollment.id &&
      rec.enrollmentStatus === 'Rejected'
  );

  return (
    <div className="student-form-wrapper">
      <h1 className="student-form-title">Enrollment</h1>

      <div className="student-form-container">
        <div className="student-form-header">
          School Year: {enrollment.academic_year?.school_year}
        </div>

        <div className="flex items-center justify-between m-6 border border-gray-300 rounded-md p-6">
          <div className="subenroll-container">
            <div className="subenroll-semester">{enrollment.semester}</div>

            {latestRecord && (
              <p className="subenroll-program-text">
                <span className="subenroll-label">Program & Year Level:</span>{" "}
                {latestRecord.program} - {latestRecord.yearLevel}
              </p>
            )}

            {hasRecordForActiveSchedule ? (
              enrolleeRecords.map((record, idx) => (
                <div
                  key={idx}
                  className="mb-4 p-4 border rounded-lg bg-gray-50"
                >
                  <div className="subenroll-status mb-2">
                    <span
                      className={`subenroll-status-label ${record.enrollmentStatus === 'Active'
                          ? 'text-green-600'
                          : record.enrollmentStatus === 'Rejected'
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}
                    >
                      Status: {record.enrollmentStatus}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="subenroll-status">
              <p className="text-gray-600 mt-4 font-semibold">
                Not yet enrolled
              </p></div>
            )}
          </div>
          <div>
            {(enrollment.is_active &&
              (!hasRecordForActiveSchedule || hasRejectedRecordForActiveSchedule)) && (
                <button onClick={toggleEnroll} className="subenroll-submit-btn cursor-pointer">
                  <PiIdentificationCardFill className="mr-2 h-5 w-5" />
                  Submit Enrollment
                </button>
              )}
          </div>
        </div>
          {expanded && (
            <EnrollmentForm 
            mode={mode}
            editType={editType}
             />
          )}
      </div>
    </div>
  );
};


export default UserEnrollment;
