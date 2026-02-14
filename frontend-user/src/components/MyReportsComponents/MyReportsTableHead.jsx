import { TableCell, TableRow } from '@mui/material';

const headers = ['Target Type', 'Target', 'Reason', 'Date Submitted', 'Status', 'Action'];

export default function MyReportsTableHead() {
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
