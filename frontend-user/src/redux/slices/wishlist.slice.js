import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { WishlistService } from '../../services/wishlist.service';

// ===== Thunks =====
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const items = await WishlistService.getWishlist();
      return items;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (bookId, { rejectWithValue }) => {
    try {
      const res = await WishlistService.addToWishlist(bookId);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add book');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (wishlistItemId, { rejectWithValue }) => {
    try {
      await WishlistService.removeFromWishlist(wishlistItemId);
      return wishlistItemId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove book');
    }
  }
);

export const clearWishlist = createAsyncThunk(
  'wishlist/clearWishlist',
  async (_, { rejectWithValue }) => {
    try {
      await WishlistService.clearWishlist();
      return [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear wishlist');
    }
  }
);

// ===== Slice =====
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // Remove
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.bookId._id !== action.payload);
      })

      // Clear
      .addCase(clearWishlist.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default wishlistSlice.reducer;
