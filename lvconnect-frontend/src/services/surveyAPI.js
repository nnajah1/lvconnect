import api from "@/services/axios"

export const getSurveys = async () => {
  const response = await api.get("/surveys");
  return response.data;
};

export const getSurveyById = (surveyId) => {
  return api.get(`/surveys/${surveyId}`);
};

export const changeVisibility = (surveyId) => {
  return api.patch(`/surveys/${surveyId}`);
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
