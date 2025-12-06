import api from "../../axiosInstance/axiosInstance.js";

export const operationService = {
  // Get user operations
  getUserOperations: async () => {
    try {
      const response = await api.get("/operations/user");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch operations"
      );
    }
  },

  // Get all operations
  getAllOperations: async () => {
    try {
      const response = await api.get("/operations/all");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch operations"
      );
    }
  },

  // Create operation
  createOperation: async (operationData) => {
    try {
      const response = await api.post("/operations", operationData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create operation"
      );
    }
  },

  // Update operation
  updateOperation: async (operationId, updateData) => {
    try {
      const response = await api.put(`/operations/${operationId}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update operation"
      );
    }
  },

  // Delete operation
  deleteOperation: async (operationId) => {
    try {
      const response = await api.delete(`/operations/${operationId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete operation"
      );
    }
  },

  // ✅ NEW: Get books where user is source (books user requested/offered)
  getMyBooksAsSource: async () => {
    try {
      const response = await api.get("/operations/my-books-as-source");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch requested books"
      );
    }
  },

  // ✅ NEW: Get books where user is destination (requests to user's books)
  getMyBooksAsDest: async () => {
    try {
      const response = await api.get("/operations/my-books-as-dest");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch received requests"
      );
    }
  },
};

export default operationService;
