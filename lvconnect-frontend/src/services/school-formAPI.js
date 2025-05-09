import api from "@/services/axios"

//forms creation

export const createForm = (formData) => api.post('/forms', formData);

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
 return await api.post(`forms/submissions/${formId}`, payload);
};

export const updateDraftForm = (submissionId, payload) => {
  return api.put(`/submissions/${submissionId}`, payload);
};