// components/MyReports/MyReportsTableRow.jsx
import { TableCell, TableRow, Stack, Chip, Button, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';

export default function MyReportsTableRow({ row, getStatusColor, getStatusTextColor }) {
  return (
    <TableRow sx={{ borderBottom: '1px solid #f0f0f0' }}>
      <TableCell sx={{ color: '#666', textAlign: 'center', verticalAlign: 'middle' }}>
        {row.targetType}
      </TableCell>

      <TableCell align="center">
        <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center">
          {row.targetType === 'User' ? (
            <PersonIcon fontSize="small" />
          ) : (
            <MenuBookIcon fontSize="small" />
          )}
          <Typography variant="body2" component="span">
            {row.target}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell sx={{ color: '#666', textAlign: 'center', verticalAlign: 'middle' }}>
        {row.reason}
      </TableCell>

      <TableCell sx={{ color: '#666', textAlign: 'center', verticalAlign: 'middle' }}>
        {row.dateSubmitted}
      </TableCell>

      <TableCell sx={{ textAlign: 'center', verticalAlign: 'middle' }}>
        <Chip
          label={row.status}
          sx={{
            backgroundColor: getStatusColor(row.status),
            color: getStatusTextColor(row.status),
            fontWeight: '500',
            border: 'none',
          }}
        />
      </TableCell>

      <TableCell sx={{ textAlign: 'center', verticalAlign: 'middle' }}>
        {row.status === 'Pending' ? (
          <Button variant="text" sx={{ color: '#2563EB', textTransform: 'capitalize' }}>
            Cancel
          </Button>
        ) : (
          <Typography sx={{ color: '#999', fontSize: '0.9rem' }}>—</Typography>
        )}
      </TableCell>
    </TableRow>
  );
}
