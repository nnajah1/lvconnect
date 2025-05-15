import { useState } from "react";
import { CiClock1 } from "react-icons/ci";
import { IoMdCloudUpload } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { ImFilePicture } from "react-icons/im";
import "@/Psas_pages/psas_styling/view_weather_response.css";


export default function Psos({}) {
  

  const [otherWeatherCondition, setOtherWeatherCondition] = useState("");
  const [weatherConditions, setWeatherConditions] = useState({});
  const [evacuationStatus, setEvacuationStatus] = useState(null);
  const [textareas, setTextareas] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [enableResponses, setEnableResponses] = useState(true);
  const formData = {
    questions: [
      {
        id: "q1",
        text: "What is your name?",
        type: "text",
        required: true,
        answer: ""
      },
      {
        id: "q2",
        text: "How old are you?",
        type: "number",
        required: true,
        answer: ""
      },
      {
        id: "q3",
        text: "What is your email address?",
        type: "email",
        required: true,
        answer: ""
      }
    ]};

  const handleWeatherConditionChange = (condition) => {
    setWeatherConditions((prev) => ({
      ...prev,
      [condition]: !prev[condition],
    }));
  };

  const handleTextareaChange = (id, value) => {
    setTextareas((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileUpload = (id, file) => {
    setUploadedFiles((prev) => ({ ...prev, [id]: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Weather conditions:", weatherConditions);
  };

  return (
    <div className="form-container">

      <div className="form-card">

      <div className="response-top-bar">
      <div className="toggle-container">
  <label className="toggle-label">
    Enable responses
    <input
      type="checkbox"
      checked={enableResponses}
      onChange={() => setEnableResponses(!enableResponses)}
      className="toggle-input"
    />
    <span className="toggle-slider" />
  </label>
</div>

  <button className="view-responses-button">
    <svg xmlns="" className="view-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
    View Responses
  </button>
</div>
        
        <div className="form-header">
          <div className="form-date">{formData.date}</div>
          <h1 className="form-title">{formData.title}</h1>
         
        </div>

        <form onSubmit={handleSubmit}>
          <div className="question-container">
            <h2 className="question-title">{formData.introTitle}</h2>
            <p className="question-description">{formData.introDescription}</p>
          </div>

          {formData.questions.map((question, index) => (
            <div key={index} className="question-container">
              <div className="question-header">
                <div>{index + 1}.</div>
                <div className="question-text">
                  {question.text}
                  {question.required && <span className="required">*</span>}
                </div>
              </div>

              <div className="question-body">
                {question.type === "checkbox" &&
                  question.options.map((option, idx) => (
                    <label key={idx} className="option-row">
                      <input
                        type="checkbox"
                        id={`${question.id}_${idx}`}
                        checked={!!weatherConditions[option]}
                        onChange={() => handleWeatherConditionChange(option)}
                        className="checkbox"
                      />
                      <span>{option}</span>
                    </label>
                  ))}

                {question.type === "checkbox" && question.hasOther && (
                  <div className="option-row">
                    <input
                      type="checkbox"
                      id={`${question.id}_other`}
                      checked={!!weatherConditions["Other"]}
                      onChange={() => handleWeatherConditionChange("Other")}
                      className="checkbox"
                    />
                    <textarea
                      value={otherWeatherCondition}
                      onChange={(e) => setOtherWeatherCondition(e.target.value)}
                      placeholder="Other (please specify)"
                      className="textarea-other"
                    />
                  </div>
                )}

                {question.type === "radio" &&
                  question.options.map((option, idx) => (
                    <label key={idx} className="option-row">
                      <input
                        type="radio"
                        id={`${question.id}_${idx}`}
                        name={question.id}
                        value={option}
                        checked={evacuationStatus === option}
                        onChange={() => setEvacuationStatus(option)}
                        className="radio"
                      />
                      <span>{option}</span>
                    </label>
                  ))}

                {question.type === "textarea-with-upload" && (
                  <>
                    <textarea
                      value={textareas[question.id] || ""}
                      onChange={(e) => handleTextareaChange(question.id, e.target.value)}
                      placeholder="Enter additional details here..."
                      className="textarea-main"
                    />
                    <div className="upload-box">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={(e) =>
                          handleFileUpload(question.id, e.target.files?.[0] || null)
                        }
                      />
                      <div className="upload-content">
                        <IoMdCloudUpload className="upload-icon" />
                        <p>Browse Files to upload</p>
                        <p className="upload-note">JPEG, JPG, and PNG formats, up to 5MB</p>
                      </div>
                    </div>

                    <div className="file-display">
                      <div className="file-info">
                        <ImFilePicture className="file-icon" />
                        <span className="file-size">
                          {uploadedFiles[question.id]
                            ? `${(uploadedFiles[question.id].size / (1024 * 1024)).toFixed(2)} MB`
                            : "-"}
                        </span>
                      </div>
                      <div className="file-link-section">
                        {uploadedFiles[question.id] ? (
                          <a
                            href={URL.createObjectURL(uploadedFiles[question.id])}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="file-link"
                          >
                            {uploadedFiles[question.id].name}
                          </a>
                        ) : (
                          <span className="file-placeholder">No selected File -</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleFileUpload(question.id, null)}
                          className="delete-button"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          <div className="submit-button-container">
            <button type="submit" className="submit-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}