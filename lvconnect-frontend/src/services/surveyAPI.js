import api from "@/services/axios"

export const getSurveys = async () => {
  const response = await api.get("/surveys");
  return response.data;
};

export const getSurveyById = (surveyId) => {
  return api.get(`/surveys/${surveyId}`);
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
