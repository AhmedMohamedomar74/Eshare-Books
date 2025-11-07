import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reportService from '../services/report.service.js';

// Create new report
export const createNewReport = createAsyncThunk(
  'reports/createNewReport',
  async (data, { rejectWithValue }) => {
    try {
      const response = await reportService.createReport(data);
      return response.message || 'Report created successfully.';
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create report.');
    }
  }
);

// Get reports by user
export const getUserReports = createAsyncThunk(
  'reports/getUserReports',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await reportService.getReportsByUser(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reports.');
    }
  }
);

// Cancel report
export const cancelUserReport = createAsyncThunk(
  'reports/cancelUserReport',
  async (reportId, { rejectWithValue }) => {
    try {
      const response = await reportService.cancelReport(reportId);
      return response.message || 'Report cancelled successfully.';
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel report.');
    }
  }
);

const reportSlice = createSlice({
  name: 'reports',
  initialState: {
    reports: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearReportMessage: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create report
      .addCase(createNewReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewReport.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(createNewReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get user reports
      .addCase(getUserReports.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(getUserReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel report
      .addCase(cancelUserReport.fulfilled, (state, action) => {
        state.successMessage = action.payload;
        state.reports = state.reports.map((r) =>
          r._id === action.meta.arg ? { ...r, status: 'Cancelled' } : r
        );
      })
      .addCase(cancelUserReport.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearReportMessage } = reportSlice.actions;
export default reportSlice.reducer;
