import React, { createContext, useContext, useState, useEffect } from 'react';
import { getForms, getSubmittedForms } from '@/services/school-formAPI';

const FormsContext = createContext();

export const FormsProvider = ({ children }) => {
  const [schoolForms, setSchoolForms] = useState([]);
  const [submittedForms, setSubmittedForms] = useState([]);
  const [error, setError] = useState(null);

  const fetchForms = async () => {
    try {
      const response = await getForms();
      // console.log(response.data)
      setSchoolForms(response.data);
    } catch (err) {
      setError('Error fetching forms');
    }
  };

  const fetchSubmitted = async () => {
    try {
      const response = await getSubmittedForms();
      
      setSubmittedForms(response.data);
    } catch (err) {
      setError('Error fetching submitted forms');
    }
  };

  return (
    <FormsContext.Provider
      value={{
        schoolForms,
        submittedForms,
        error,
        fetchForms,
        fetchSubmitted,
      }}
    >
      {children}
    </FormsContext.Provider>
  );
};

export const useForms = () => {
  return useContext(FormsContext);
};
