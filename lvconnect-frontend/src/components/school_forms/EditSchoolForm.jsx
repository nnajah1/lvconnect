import React, { useEffect, useState } from 'react';
import { getFormById, updateForm, updateFormFields } from '@/services/school-formAPI';
import FormBuilder from './FormBuilder'; 
import { Loader } from "@/components/dynamic/loader";
import { toast } from 'react-toastify';
import { useForms } from '@/context/FormsContext';

const EditForm = ({ formId, onDelete, closeModal, onSuccess }) => {
   const { fetchForms, fetchSubmitted } = useForms();
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
        console.log('Failed to load form');
      }
    };
    loadForm( formId);
  }, [formId]);

  const handleUpdate = async (updatedData, updatedFields, deletedFieldIds) => {
    if (!updatedData || !updatedFields) return;
    try {
      await updateForm(formId, updatedData); 
      await updateFormFields(formId, updatedFields, deletedFieldIds); 
      await fetchForms();
      await fetchSubmitted();
      onSuccess();
     toast.success('School Form updated successfully');
    } catch (err) {
      console.log('Error updating form');
    }
  };

  return (
    <FormBuilder
      mode="edit"
      initialData={formData}
      initialFields={formFields}
      onSubmit={handleUpdate}
      onDelete={onDelete}
      closeModal={closeModal}
    />
  );
};

export default EditForm;
