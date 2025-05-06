import React from 'react';
import { FaCircleCheck } from 'react-icons/fa6';
import '../psas_styling/downloadsuccess.css'; 

const DownloadSuccess = ({ message = "Download successful!" }) => {
  return (
    <div className="download-success-container">
      <div className="download-success-icon">
        <FaCircleCheck size={24} />
      </div>
      <span className="download-success-message">{message}</span>
    </div>
  );
};

export default DownloadSuccess;
