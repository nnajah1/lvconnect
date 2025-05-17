import React from 'react';
import { FiEdit3 } from 'react-icons/fi';
import '@/styles/studentservice.css';

const TemplatesTab = ({ forms = [] }) => {
  return (
    <div className="template-container">
      {forms.length === 0 ? (
        <div className="template-empty">No forms available</div>
      ) : (
        forms.map((form, index) => (
          <div key={index} className="template-item">
            <span className="template-title">{form}</span>
            <button className="template-edit-button">
              <FiEdit3 size={16} />
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default TemplatesTab;
