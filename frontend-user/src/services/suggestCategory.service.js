import api from '../axiosInstance/axiosInstance.js';

const createSuggestCategory = async (data) => {
  const res = await api.post('/suggest-categories', data);
  return res.data;
};

const suggestCategoryService = {
  createSuggestCategory,
};

export default suggestCategoryService;
