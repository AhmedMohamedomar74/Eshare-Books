import { Table, TableBody, TableContainer, Paper } from '@mui/material';
import MyReportsTableHead from './MyReportsTableHead';
import MyReportsTableRow from './MyReportsTableRow';
import MyReportsEmptyState from './MyReportsEmptyState';

export default function MyReportsTable({
  reportsData,
  getStatusColor,
  getStatusTextColor,
  onCancel,
}) {
  const hasReports = reportsData.length > 0;

  return (
    <TableContainer
      component={Paper}
      sx={{ backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
    >
      {hasReports ? (
        <Table>
          <MyReportsTableHead />
          <TableBody>
            {reportsData.map((row) => (
              <MyReportsTableRow
                key={row._id}
                row={row}
                getStatusColor={getStatusColor}
                getStatusTextColor={getStatusTextColor}
                onCancel={onCancel}
              />
            ))}
          </TableBody>
        </Table>
      ) : (
        <MyReportsEmptyState />
      )}
    </TableContainer>
  );
}
