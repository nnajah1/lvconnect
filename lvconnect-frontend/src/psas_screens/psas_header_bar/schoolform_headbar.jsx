import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { CiCirclePlus } from 'react-icons/ci';
import '../psas_styling/psas_headbar.css';

const SchoolFormsHeaderBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [surveys, setSurveys] = useState([]);
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  const [activeTab, setActiveTab] = useState('templates');


  useEffect(() => {
    
  }, []);

  // Filter surveys by search input
  useEffect(() => {
    const results = surveys.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSurveys(results);
  }, [searchTerm, surveys]);

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <div className="header-row">
          <h1 className="title">School Forms</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="search-icon" />
          </div>
        </div>

  
        <div className="tabs-bar">
          <div className="tab-switcher">
            <button
              className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`}
              onClick={() => setActiveTab('templates')}
            >
              Form templates
            </button>
            <button
              className={`tab-btn ${activeTab === 'submitted' ? 'active' : ''}`}
              onClick={() => setActiveTab('submitted')}
            >
              Submitted forms
            </button>
          </div>

          <button className="create-btn lifted">
            <CiCirclePlus className="icon" />
            Create Form
          </button>
        </div>

     
        <div className="results">
          {filteredSurveys.length > 0 ? (
            <ul className="survey-list">
              {filteredSurveys.map((survey, idx) => (
                <li key={idx} className="survey-item">
                  {survey.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data-text">No forms found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolFormsHeaderBar;
