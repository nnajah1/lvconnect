import api from "@/services/axios"

//forms creation

export const createForm = (formData) => api.post('/forms', formData);

export const saveFormFields = (formId, fields) =>
  api.post(`/forms/${formId}/fields`, { fields });

export const updateForm = async (id, formData) => {
  return api.put(`${API_URL}/${id}`, formData);
};

export const getForms = async () => {
  return api.get('/forms');
};

export const getSubmittedForms = async () => {
  return api.get('/forms/submissions');
};


export const deleteForm = async (id) => {
  return api.delete(`${API_URL}/${id}`);
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

export const submitForm = async (submissionData) => {
  return api.post(API_URL, submissionData);
};

export const getSubmissions = async (formId) => {
  return api.get(`${API_URL}?form_id=${formId}`);
};

export const getSubmission = async (id) => {
  return api.get(`${API_URL}/${id}`);
};

export const updateSubmissionStatus = async (id, statusData) => {
  return api.put(`${API_URL}/${id}/status`, statusData);
};