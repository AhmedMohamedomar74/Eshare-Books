import api from '../axiosInstance/axiosInstance';

const WISHLIST_ENDPOINT = '/wishlist';

export const WishlistService = {
  getWishlist: async () => {
    const response = await api.get(WISHLIST_ENDPOINT);
    return response.data.data.items;
  },

  addToWishlist: async (bookId) => {
    const response = await api.post(WISHLIST_ENDPOINT, { bookId });
    return response.data.data;
  },

  removeFromWishlist: async (bookId) => {
    const response = await api.delete(`${WISHLIST_ENDPOINT}/${bookId}`);
    return response.data.data;
  },

  clearWishlist: async () => {
    const response = await api.delete(WISHLIST_ENDPOINT);
    return response.data.data;
  },
};
