import { PiIdentificationCardFill } from "react-icons/pi";
import "@/styles/student_information.css"

const UserEnrollment = () => {

  return (
      <div className="student-form-wrapper">
        <h1 className="student-form-title">Enrollment</h1>
  
        <div className="student-form-container">
          <div className="student-form-header">School Year: {schoolYear}</div>
  
          <div className="student-form-content">
            <div className="subenroll-container">
              <div className="subenroll-semester">{semester}</div>
  
              <div className="subenroll-flex">
                <div>
                  <p className="subenroll-program-text">
                    <span className="subenroll-label">Program & Year Level:</span>{" "}
                    {program} - {yearLevel}
                  </p>
                </div>
  
                <button className="subenroll-submit-btn">
                  <PiIdentificationCardFill className="mr-2 h-5 w-5" />
                  Submit Enrollment
                </button>
              </div>
  
              <div className="subenroll-status">
                <span className="subenroll-status-label">
                  {enrollmentStatus}
                </span>
              </div>
            </div>
  
          </div>
        </div>
      </div>
    );
};

export default UserEnrollment;
