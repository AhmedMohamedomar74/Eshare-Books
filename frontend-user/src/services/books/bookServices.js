import api from "./../../axiosInstance/axiosInstance.js";

export const bookService = {
  getBooks: async () => {
    try {
      const response = await api.get("/books/allbooks");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch books");
    }
  },

  getUserBooks: async (userId) => {
    try {
      const response = await api.get(`/books/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user books"
      );
    }
  },

  updateBook: async (bookId, FormData) => {
    try {
      const response = await api.patch(`books/${bookId}`, FormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update book");
    }
  },

  deleteBook: async (bookId) => {
    try {
      const response = await api.delete(`/books/${bookId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete book");
    }
  },
};
