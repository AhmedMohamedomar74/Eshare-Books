import api from "../../axiosInstance/axiosInstance.js";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchBookId = createAsyncThunk(
  "orders/fetchBookById",
  async (bookId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/books/${bookId}`);
      return res.data.book;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching book");
    }
  }
);

export const createOperation = createAsyncThunk(
  "orders/createOperation",
  async (operationData, { rejectWithValue }) => {
    try {
      const res = await api.post(`/operations`, operationData);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error creating operation"
      );
    }
  }
);

export const completeOperation = createAsyncThunk(
  "orders/completeOperation",
  async (operationId, { rejectWithValue }) => {
    try {
      const res = await api.put(`/operations/${operationId}`, {
        status: "completed",
      });
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error completing operation"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    book: null,
    selectedOption: "purchase",
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    setSelectedOption: (state, action) => {
      state.selectedOption = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Book
      .addCase(fetchBookId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookId.fulfilled, (state, action) => {
        state.loading = false;
        state.book = action.payload;
      })
      .addCase(fetchBookId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Operation
      .addCase(createOperation.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.error = null;
      })
      .addCase(createOperation.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createOperation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Complete Operation
      .addCase(completeOperation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeOperation.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Operation completed successfully!";
      })
      .addCase(completeOperation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedOption } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
