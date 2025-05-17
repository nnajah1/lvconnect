import React from 'react';
import { MdOutlineArrowOutward } from 'react-icons/md';
import '@/styles/studentservice.css';

const statusStyles = {
  Approved: 'status-approved',
  Pending: 'status-pending',
};

const dotColor = {
  Approved: 'dot-approved',
  Pending: 'dot-pending',
};

const SubmittedForms = ({ data = [] }) => {
  return (
    <div className="submitted-container">
      {data.length === 0 ? (
        <div className="submitted-empty">No forms submitted</div>
      ) : (
        data.map((form, index) => (
          <div key={index} className="submitted-item">
            <div className="submitted-title">{form.title}</div>

            <div className="submitted-status">
              <span className={`status-dot ${dotColor[form.status] || 'dot-default'}`} />
              <span className={`status-text ${statusStyles[form.status] || 'status-default'}`}>
                {form.status}
              </span>
            </div>

            <div className="submitted-action">
              <button className="action-button">
                <MdOutlineArrowOutward className="action-icon" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SubmittedForms;
