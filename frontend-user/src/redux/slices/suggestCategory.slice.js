import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import suggestCategoryService from '../../services/suggestCategory.service.js';

// Create suggest category
export const createSuggestCategory = createAsyncThunk(
  'suggestCategory/createSuggestCategory',
  async (data, { rejectWithValue }) => {
    try {
      const response = await suggestCategoryService.createSuggestCategory(data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create category suggestion.'
      );
    }
  }
);

const suggestCategorySlice = createSlice({
  name: 'suggestCategory',
  initialState: {
    loading: false,
    error: null,
    successMessage: null,
    suggestedCategory: null,
  },
  reducers: {
    clearSuggestCategoryMessage: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create suggest category
      .addCase(createSuggestCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSuggestCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.suggestedCategory = action.payload.data;
      })
      .addCase(createSuggestCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSuggestCategoryMessage } = suggestCategorySlice.actions;
export default suggestCategorySlice.reducer;
