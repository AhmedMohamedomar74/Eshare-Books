import api from '../axiosInstance/axiosInstance.js';

const createReport = async (data) => {
  const res = await api.post('/reports', data);
  return res.data;
};

const getMyReports = async (userId) => {
  const res = await api.get(`/reports/me`);
  return res.data.data;
};

const cancelReport = async (reportId) => {
  const res = await api.patch(`/reports/${reportId}/cancel`);
  return res.data;
};

const reportService = {
  createReport,
  getMyReports,
  cancelReport,
};

export default reportService;
