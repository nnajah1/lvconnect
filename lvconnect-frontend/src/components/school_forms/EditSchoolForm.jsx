import React, { useEffect, useState } from 'react';
import { getFormById, updateForm, updateFormFields } from '@/services/school-formAPI';
import FormBuilder from './FormBuilder'; 
import Loader from '../dynamic/loader';

const EditForm = ({ formId, closeModal, onSuccess}) => {
  const [formData, setFormData] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // if (!formId) return;
    const loadForm = async () => {
      try {
        const response = await getFormById(formId);
        setFormData(response.data.form);
        setFormFields(response.data.fields);
      } catch (err) {
        setError('Failed to load form');
      }
    };
    loadForm( formId);
  }, [formId]);

  const handleUpdate = async (updatedData, updatedFields, deletedFieldIds) => {
    if (formData && formFields) return;
    try {
      await updateForm(formId, updatedData); 
      await updateFormFields(formId, updatedFields, deletedFieldIds); 
      if (onSuccess) onSuccess(formId);
    } catch (err) {
      setError('Error updating form');
    }
  };

  // if (!formData) return <Loader/>;

  return (
    <FormBuilder
      mode="edit"
      initialData={formData}
      initialFields={formFields}
      onSubmit={handleUpdate}
      error={error}
    />
  );
};

export default EditForm;
