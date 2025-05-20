import React, { createContext, useContext, useState, useEffect } from 'react';
import { getForms, getSubmittedForms } from '@/services/school-formAPI';

const FormsContext = createContext();

export const FormsProvider = ({ children }) => {
  const [schoolForms, setSchoolForms] = useState([]);
  const [submittedForms, setSubmittedForms] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      
      console.log(response.data)
      setSubmittedForms(response.data);
    } catch (err) {
      setError('Error fetching submitted forms');
    }
  };

  useEffect(() => {
  const fetchAll = async () => {
    setIsLoading(true);
    await Promise.all([fetchForms(), fetchSubmitted()]);
    setIsLoading(false);
  };

  fetchAll();
}, []);
  return (
    <FormsContext.Provider
      value={{
        schoolForms,
        submittedForms,
        error,
        fetchForms,
        fetchSubmitted,
        isLoading 
      }}
    >
      {children}
    </FormsContext.Provider>
  );
};

export const useForms = () => {
  return useContext(FormsContext);
};
