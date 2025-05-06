import React from 'react';
import '../psas_styling/psas_headbar.css';

const SummaryTab = ({ responses }) => {
  if (!responses || responses.length === 0) return <p>No responses available.</p>;

  const getTotalResponses = (question) => {
    return question.responses?.reduce((sum, resp) => sum + (resp.value || 0), 0);
  };

  return (
    <div className="summary-tab-container">
      {responses.map((question, qIndex) => (
        <div className="summary-box" key={qIndex}>
          <h2>{question.question}</h2>
          <p className="response-count">
            {getTotalResponses(question)} responses
          </p>

          {/* Multiple Choice / Bar Chart */}
          {question.type === 'multiple_choice' && (
            question.responses.map((item, index) => (
              <div className="bar-row-horizontal" key={index}>
                <span className="bar-label">{item.label}</span>
                <div className="bar">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${(item.value / getTotalResponses(question)) * 100}%`,
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Short Answer / Text Input */}
          {question.type === 'text' && (
            <div className="additional-details">
              {question.responses.map((text, idx) => (
                <div className="detail-text-filled" key={idx}>{text}</div>
              ))}
              <div className="see-all-right">
                <a className="see-all-link" href="#">See all...</a>
              </div>
            </div>
          )}

          {/* File Upload */}
          {question.type === 'file_upload' && (
            <>
              <div className="upload-header">
                <span></span>
                <span>File Name</span>
                <span>Type</span>
                <span>Size</span>
                <span>Uploaded By</span>
              </div>
              {question.responses.map((file, idx) => (
                <div className="upload-row" key={idx}>
                  <input type="checkbox" />
                  <span className="file-name">{file.name}</span>
                  <span className="file-type">{file.type}</span>
                  <span className="file-size">{file.size}</span>
                  <div className="uploader-info">
                    <img className="avatar" src={file.avatarUrl} alt="avatar" />
                    <span>{file.uploadedBy}</span>
                  </div>
                </div>
              ))}
              <div className="see-all-right">
                <a className="see-all-link" href="#">See all images...</a>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default SummaryTab;
