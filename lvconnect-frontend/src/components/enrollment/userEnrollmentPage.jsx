
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import EnrollmentForm from './userEnrollmentForm';

export default function EnrollmentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    mode,
    editType,
    studentId,
    studentData: initialStudentData,
    enrollmentData,
    loadEnrollment,
  } = location.state || {};

  const [studentData, setStudentData] = useState(initialStudentData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!location.state) {
      navigate(-1); // go back if user directly accessed
    }
  }, []);

  if (!location.state) return null;

  return (
    <div className="">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a2b4c]">Enrollment Form</h1>
        <p className="text-sm text-gray-600 mt-1">
          Fill out all the required fields.
        </p>
      </div>
      <EnrollmentForm
        mode={mode}
        editType={editType}
        studentId={studentId}
        studentData={studentData}
        setStudentData={setStudentData}
        enrollmentData={enrollmentData}
        setLoading={setIsLoading}
        isExpanded={() => navigate(-1)} // Replace 'close' behavior
        loadEnroll={loadEnrollment}
      />
    </div>
  );
}
