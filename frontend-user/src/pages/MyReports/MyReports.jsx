import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMyReports,
  cancelUserReport,
  clearReportMessage,
} from '../../redux/slices/report.slice';
import { Box, CircularProgress, Snackbar, Alert } from '@mui/material';

import MyReportsHeader from '../../components/MyReportsComponents/MyReportsHeader';
import MyReportsFilters from '../../components/MyReportsComponents/MyReportsFilters';
import MyReportsTable from '../../components/MyReportsComponents/MyReportsTable';
import MyReportsPagination from '../../components/MyReportsComponents/MyReportsPagination';
import MyReportsEmptyState from '../../components/MyReportsComponents/MyReportsEmptyState';

export default function MyReports() {
  const dispatch = useDispatch();
  const { reports, loading, successMessage, error } = useSelector((state) => state.reports);

  const [snackbar, setSnackbar] = useState({ open: false, msg: '', type: 'success' });
  const [statusFilter, setStatusFilter] = useState('All');
  const [targetTypeFilter, setTargetTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    console.log('Dispatching getMyReports...');
    dispatch(getMyReports());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      setSnackbar({ open: true, msg: successMessage, type: 'success' });
      setTimeout(() => dispatch(clearReportMessage()), 3000);
    } else if (error) {
      setSnackbar({ open: true, msg: error, type: 'error' });
      setTimeout(() => dispatch(clearReportMessage()), 3000);
    }
  }, [successMessage, error, dispatch]);

  const handleCancel = (report) => {
    if (report.status !== 'Pending') return;
    dispatch(cancelUserReport(report._id));
  };

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesStatus = statusFilter === 'All' || report.status === statusFilter;
      const matchesType = targetTypeFilter === 'All' || report.targetType === targetTypeFilter;
      return matchesStatus && matchesType;
    });
  }, [reports, statusFilter, targetTypeFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, targetTypeFilter]);

  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredReports.slice(startIndex, endIndex);
  }, [filteredReports, currentPage]);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const getStatusColor = (status) => {
    const colors = {
      Pending: '#FFF3CD',
      Reviewed: '#D4EDDA',
      Dismissed: '#E2E3E5',
      Cancelled: '#F8D7DA',
    };
    return colors[status] || '#F5F5F5';
  };

  const getStatusTextColor = (status) => {
    const colors = {
      Pending: '#856404',
      Reviewed: '#155724',
      Dismissed: '#383D41',
      Cancelled: '#721C24',
    };
    return colors[status] || '#333';
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', p: 4 }}>
      <MyReportsHeader />

      <MyReportsFilters
        statusFilter={statusFilter}
        targetTypeFilter={targetTypeFilter}
        onStatusChange={setStatusFilter}
        onTargetTypeChange={setTargetTypeFilter}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredReports.length === 0 ? (
        <MyReportsEmptyState />
      ) : (
        <MyReportsTable
          reportsData={paginatedReports}
          getStatusColor={getStatusColor}
          getStatusTextColor={getStatusTextColor}
          onCancel={handleCancel}
        />
      )}

      {filteredReports.length > 0 && (
        <MyReportsPagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
          totalItems={filteredReports.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.type}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{
            width: '100%',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
