import api from "@/services/axios"

export const getSurveyById = (surveyId) => {
  return api.get(`/surveys/${surveyId}`);
};
export const getSubmittedSurveyResponses = (surveyId) => {
  return api.get(`/survey-response/${surveyId}`);
};

export const getSurveyResponses = async (surveyId) => {
  const response = await api.get(`/survey-responses/${surveyId}`);
  return response.data;
};
export const getSurveyResponse = (surveyId) => {
  return api.get(`/my-survey-response/${surveyId}`);
};

export const checkSubmission = (surveyId) => {
  return api.get(`/survey-submissions/check/${surveyId}`);
};

export const createSurvey = async (formData) => {
  const response = await api.post('/survey', formData);
  return response.data;
};

export const updateSurvey = async (surveyId, payload) => {
  const response = await api.put(`/surveys/${surveyId}`, payload);
  return response.data;
};

export const submitSurveyResponse = (payload) =>
  api.post('/survey-responses', payload);

export async function deleteSurvey(id) {
    try {
        const response = await api.delete(`/surveys/${id}`);
        return response.data;
    } catch (error) {
        console.error('Delete survey failed:', error);
        throw new Error('Failed to delete survey');
    }
}


export const getEnrollees = async () => {
  const response = await api.get("/enrollees");
  return response.data;
};
export const getEnrollee = async (id) => {
  const response = await api.get(`/enrollee/${id}`);
  return response.data;
};

export const updateEnrollee = async (id, data) => {
  const response = await api.put(`/enrollees/${id}`, data);
  return response.data;
};

export const createEnrollee = async (studentId, data) => {
  const response = await api.post(`/manual-enrollment/${studentId}`, data);
  return response.data;
};

export const submitEnrollment = async (data) => {
  return api.post("/student/enroll", data);
};

export const getAcademicYears = () => api.get("/academic-years");

export const createAcademicYear = (schoolYear) =>
  api.post("/academic-years", { school_year: schoolYear });

export const approveEnrollment = (id) =>
  api.post(`/enrollment-approve/${id}`);
export const rejectEnrollment = (id, data) =>
  api.post(`/enrollment-reject/${id}`, data);

export const bulkApproveEnrollment = (ids) =>
  api.post('/enrollment/bulk-approve', { ids });

export const bulkDeleteEnrollment = (ids) =>
  api.post('/enrollment/bulk-delete', { ids });

export const bulkExportEnrollment = (ids) =>
  api.post('/enrollment/bulk-export', { ids });

export const bulkRemindEnrollment = (ids) =>
  api.post('/enrollment/bulk-remind', { ids });

export const bulkArchiveEnrollment = (ids) => {
  return axios.post('/enrollees/bulk-archive', { ids });
};

export const getEnrollmentSchedule = ({ academic_year_id, semester }) =>
  api.get("/enrollment-schedule", {
    params: { academic_year_id, semester },
  });

export const toggleEnrollmentSchedule = (payload) =>
  api.post("/enrollment-schedule/toggle", payload);

export const getSoa = (schoolYear) => {
  return api.get(`/soa/${schoolYear}`);
};

export const createSoa = (data) => {
  return api.post("/soa", data);
};

export const updateSoa = (schoolYear, data) => {
  return api.put(`/soa/${schoolYear}`, data);
};


