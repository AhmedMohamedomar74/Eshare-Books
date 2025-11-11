import api from './../../axiosInstance/axiosInstance.js';

export const bookService = {
    getBooks: async () => {
        try {
            const response = await api.get('/books/allbooks');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch books');
        }
    },
}