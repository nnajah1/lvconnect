import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { CiCirclePlus } from 'react-icons/ci';
import '../psas_styling/psas_headbar.css'; 

const SurveyHeaderBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [surveys, setSurveys] = useState([]);
  const [filteredSurveys, setFilteredSurveys] = useState([]);

  useEffect(() => {
    
  }, []);

  useEffect(() => {
    const results = surveys.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSurveys(results);
  }, [searchTerm, surveys]);

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <h1 className="title">survey</h1>

      
        <div className="top-bar">
          <button className="create-btn">
            <CiCirclePlus className="icon" />
            create new survey
          </button>

          <div className="search-container">
            <input
              type="text"
              placeholder="Search"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="search-icon" />
          </div>
        </div>

    
        <div className="results">
          <ul className="survey-list">
            {filteredSurveys.map((survey, idx) => (
              <li key={idx} className="survey-item">
                {survey.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SurveyHeaderBar;
