import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import '../psas_styling/psas_headbar.css';

const ResponseHeader = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('individual');

  
  const getFormattedDate = () => {
   
  };

  const currentDate = getFormattedDate();


  const responseTitle = ''; 

  return (
    <div className="response-container">
      <div className="back-button-container">
        <button className="back-btn">←</button>
      </div>

      <div className="response-header">
        <div className="header-content">
          <h1 className="response-title">Responses</h1>
          <p className="response-subtitle">
            {currentDate} {responseTitle}
          </p>

          <div className="tab-switch">
            <button
              className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
              onClick={() => setActiveTab('summary')}
            >
              Summary
            </button>
            <button
              className={`tab-btn ${activeTab === 'individual' ? 'active' : ''}`}
              onClick={() => setActiveTab('individual')}
            >
              Individual
            </button>
          </div>
        </div>

        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'summary' && <p>Summary view content goes here.</p>}
        {activeTab === 'individual' && <p>Individual responses content goes here.</p>}
      </div>
    </div>
  );
};

export default ResponseHeader;
