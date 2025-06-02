import api from "@/services/axios"

export const getAnalytics = async (surveyId) => {
  const response = await api.get(`/analytics-summary/${surveyId}`);
  return response.data;
};

export const getAnalyticsDashboardPsas = async () => {
  const response = await api.get('/psas-dashboard');
  return response.data;
};


export const getSchoolAdminDashboard = async () => {
  const response = await api.get('/schoolAdmin-dashboard');
  return response.data;
};

export const getRegistrarDashboard = async () => {
  const response = await api.get('/registrar-dashboard');
  return response.data;
};


