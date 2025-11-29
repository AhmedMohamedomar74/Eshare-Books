import { TableCell, TableRow } from '@mui/material';
import { useSelector } from 'react-redux';

export default function MyReportsTableHead() {
  const { content } = useSelector((state) => state.lang);

  const headers = [
    content.targetType || 'Target Type',
    content.target || 'Target',
    content.reason || 'Reason',
    content.dateSubmitted || 'Date Submitted',
    content.status || 'Status',
    content.action || 'Action',
  ];

  return (
    <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
      {headers.map((header) => (
        <TableCell
          key={header}
          sx={{
            fontWeight: 'bold',
            color: '#666',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            textAlign: 'center',
            verticalAlign: 'middle',
          }}
        >
          {header}
        </TableCell>
      ))}
    </TableRow>
  );
}
