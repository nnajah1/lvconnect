import api from "@/services/axios"

export const getEnrollment = async () => {
  const response = await api.get("/enrollment");
  return response.data;
};

export const getEnrollees = async ({ academic_year_id, semester }) => {
  const response = await api.get("/enrollees", {
    params: { academic_year_id, semester }
  });
  return response.data;
};

export const getNotEnrolled = async ({academic_year_id, semester}) => {
  const response = await api.get("/not-enrolled", {
    params: { academic_year_id, semester }
  });
  return response.data;a
};

export const getEnrolled = async () => {
  const response = await api.get("/enrollees/enrolled");
  return response.data;
};
export const getEnrollee = async (id) => {
  const response = await api.get(`/enrollee/${id}`);
  return response.data;
};
export const getNotEnrollee = async (id) => {
  const response = await api.get(`/not-enrolled/${id}`);
  return response.data;
};
export const createEnrollee = async (studentId, data) => {
  const response = await api.put(`/manual-enrollment/${studentId}`, data);
  return response.data;
};
export const editStudentData = async (studentId, data) => {
  const response = await api.put(`/update-student/${studentId}`, data);
  return response.data;
};

export const submitEnrollment = async (data) => {
  return api.put("/student/enroll", data);
};

export const getAcademicYears = () => api.get("/academic-years");

export const createAcademicYear = (schoolYear) =>
  api.post("/academic-years", { school_year: schoolYear });

export const approveEnrollment = (id) =>
  api.post(`/enrollment-approve/${id}`);
export const rejectEnrollment = (id, data) =>
  api.post(`/enrollment-reject/${id}`, data);
export const archiveData = (id, data) =>
  api.post(`/archive-student-data/${id}`, data);

export const bulkApproveEnrollment = (ids) =>
  api.post('/enrollment/bulk-approve', { ids });

export const bulkDeleteEnrollment = (ids) =>
  api.post('/enrollment/bulk-delete', { ids });

export const bulkExportEnrollment = (ids) =>
  api.post('/enrollment/bulk-export', { ids });

export const bulkRemindEnrollment = (ids, enrollment_schedule_id) =>
  api.post('/enrollment/bulk-remind', { ids, enrollment_schedule_id });

export const bulkRemindRejectedEnrollment = (ids, enrollment_schedule_id) =>
  api.post('/enrollment/bulk-remind-rejected', { ids, enrollment_schedule_id });

export const bulkArchiveEnrollment = (ids) => {
  return axios.post('/enrollees/bulk-archive', { ids });
};

export const getEnrollmentSchedule = ({ academic_year_id, semester }) =>
  api.get("/enrollment-schedule", {
    params: { academic_year_id, semester },
  });

export const toggleEnrollmentSchedule = (payload) =>
  api.post("/enrollment-schedule/toggle", payload);


export const getAllSoa = () => api.get("/get-soa");


export const getSoa = (schoolYear) => api.get(`/soa/${schoolYear.id}`);

export const getActiveAcademicYear = () => api.get("/academic-years-active");

export const getFeeCategories = () => {
  return api.get('/fee-categories'); 
};

export const createSoa = (payload) => {
  return api.post("/fee-templates", payload);
};

export const updateSoa = (currentTemplateId, payload) => {
  return api.put(`/fee-templates/${currentTemplateId}`, payload);
};


