import api from "@/services/axios"

//forms creation
// export const createForm = async (formData) => {
//     return api.post(API_URL, formData);
//   };

export const createForm = async (formData) => {

  try {
    const response = await api.post('/api/forms', formData);
    return response.data;

  } catch (error) {
    throw error.response?.data || "Failed to create form.";
  };
};

export const addFields = async (formTypeId, fieldsPayload) => {

  try {
    const response = await api.post(`/api/forms/${formTypeId}/fields`, {
      fields: fieldsPayload,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to add fields.";
  }
};



export const updateForm = async (id, formData) => {
  return api.put(`${API_URL}/${id}`, formData);
};

export const getForm = async (id) => {
  return api.get(`${API_URL}/${id}`);
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