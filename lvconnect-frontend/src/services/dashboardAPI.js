import api from "@/services/axios"

export const getAnalytics = async (surveyId) => {
  const response = await api.get(`/analytics-summary/${surveyId}`);
  return response.data;
};

export const getAnalyticsDashboardPsas = async () => {
  const response = await api.get('/psas-dashboard');
  return response.data;
};
