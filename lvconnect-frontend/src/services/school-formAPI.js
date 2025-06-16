import api from "@/services/axios"

//forms creation

export const createForm = (formData) => api.post('/forms', formData);
export const changeVisibility = (formId) => {
  return api.patch(`/forms/${formId}`);
};

export const saveFormFields = (formId, fields) =>
  api.post(`/forms/${formId}/fields`, { fields });

export const reviewSubmission = (submissionId, data) =>
  api.post(`/forms/submissions/${submissionId}/review`, data);

export const updateForm = (id, payload) => 
  api.put(`/forms/${id}`, payload);

export const updateFormFields = (formId, fields, deletedFieldIds) => {
  return api.put(`/forms/${formId}/fields`, { fields, deleted_ids: deletedFieldIds });
};

export const getForms = async () => {
  return api.get('/forms');
};
export const getFormById = (formId) => {
  return api.get(`/forms/${formId}`);
};

export const getSubmittedForms = async () => {
  return api.get('/submissions');
};

export const getSubmittedFormById = (formId) => {
  return api.get(`/forms/submissions/${formId}`);
};

export const downloadSubmission = async (formId) => {
  const response = await api.get(`submissions/${formId}/download`, {
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `submission_${formId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const deleteForm = async (formId) => {
 await api.delete(`/forms/${formId}`);

};

export const extractPdfFields = async (pdfFile) => {
  const formData = new FormData();
  formData.append('pdf', pdfFile);
  return api.post(`${API_URL}/extract-pdf`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// forms submission

export const submitForm = async (formId, payload) => {
  try {
    console.log('Submitting form:', { formId, payload });
    
    const response = await api.post(`/student-submit/${formId}`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    console.log('Submit form response:', response.data);
    return response;
  } catch (error) {
    console.error('Submit form error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    throw error;
  }
};

export const updateDraftForm = async (draftId, payload) => {
  try {
    console.log('Updating draft:', { draftId, payload });
    
    const response = await api.put(`/student-draft/${draftId}`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    console.log('Update draft response:', response.data);
    return response;
  } catch (error) {
    console.error('Update draft error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    throw error;
  }
};