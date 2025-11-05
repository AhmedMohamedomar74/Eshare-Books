import { useState, useMemo } from 'react';
import { Container, Box } from '@mui/material';
import MyReportsHeader from '../../components/ReportsComponents/MyReportsHeader';
import MyReportsFilters from '../../components/ReportsComponents/MyReportsFilters';
import MyReportsTable from '../../components/ReportsComponents/MyReportsTable';
import MyReportsPagination from '../../components/ReportsComponents/MyReportsPagination';

const MyReports = () => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [targetTypeFilter, setTargetTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const reportsData = [
    {
      id: 1,
      targetType: 'User',
      target: 'InappropriateName123',
      reason: 'Inappropriate Username',
      dateSubmitted: '2023-10-26',
      status: 'Pending',
    },
    {
      id: 2,
      targetType: 'Book',
      target: 'The Midnight Library',
      reason: 'Spam',
      dateSubmitted: '2023-10-25',
      status: 'Reviewed',
    },
    {
      id: 3,
      targetType: 'User',
      target: 'MisleadingProfile',
      reason: 'Misinformation',
      dateSubmitted: '2023-10-22',
      status: 'Dismissed',
    },
    {
      id: 4,
      targetType: 'User',
      target: 'HarassingUser45',
      reason: 'Harassment',
      dateSubmitted: '2023-10-20',
      status: 'Cancelled',
    },
    {
      id: 5,
      targetType: 'Book',
      target: 'A Tale of Two Cities',
      reason: 'Hate Speech',
      dateSubmitted: '2023-10-19',
      status: 'Reviewed',
    },
    {
      id: 6,
      targetType: 'User',
      target: 'SpamBot2025',
      reason: 'Spam',
      dateSubmitted: '2023-10-18',
      status: 'Pending',
    },
    {
      id: 7,
      targetType: 'Book',
      target: '1984',
      reason: 'Offensive Content',
      dateSubmitted: '2023-10-17',
      status: 'Reviewed',
    },
    {
      id: 8,
      targetType: 'User',
      target: 'TrollKing',
      reason: 'Harassment',
      dateSubmitted: '2023-10-15',
      status: 'Dismissed',
    },
    {
      id: 9,
      targetType: 'Book',
      target: 'Brave New World',
      reason: 'Misinformation',
      dateSubmitted: '2023-10-14',
      status: 'Pending',
    },
    {
      id: 10,
      targetType: 'User',
      target: 'FakeUser99',
      reason: 'Scam',
      dateSubmitted: '2023-10-12',
      status: 'Reviewed',
    },
    {
      id: 11,
      targetType: 'Book',
      target: 'Pride and Prejudice',
      reason: 'Inappropriate Cover',
      dateSubmitted: '2023-10-10',
      status: 'Pending',
    },
    {
      id: 12,
      targetType: 'User',
      target: 'ScammerPro',
      reason: 'Fraud',
      dateSubmitted: '2023-10-08',
      status: 'Reviewed',
    },
    {
      id: 13,
      targetType: 'Book',
      target: 'To Kill a Mockingbird',
      reason: 'Offensive Language',
      dateSubmitted: '2023-10-05',
      status: 'Dismissed',
    },
  ];

  const filteredData = useMemo(() => {
    return reportsData.filter((report) => {
      const matchesStatus = statusFilter === 'All' || report.status === statusFilter;
      const matchesType = targetTypeFilter === 'All' || report.targetType === targetTypeFilter;
      return matchesStatus && matchesType;
    });
  }, [statusFilter, targetTypeFilter]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  useMemo(() => {
    setCurrentPage(1);
  }, [statusFilter, targetTypeFilter]);

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
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <MyReportsHeader />

        <MyReportsFilters
          statusFilter={statusFilter}
          targetTypeFilter={targetTypeFilter}
          onStatusChange={setStatusFilter}
          onTargetTypeChange={setTargetTypeFilter}
        />

        <MyReportsTable
          reportsData={paginatedData}
          getStatusColor={getStatusColor}
          getStatusTextColor={getStatusTextColor}
        />

        {filteredData.length > 0 && (
          <MyReportsPagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalPages={totalPages}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
          />
        )}
      </Container>
    </Box>
  );
};

export default MyReports;
