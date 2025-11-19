import { useState } from 'react';
import {
  TableCell,
  TableRow,
  Stack,
  Chip,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';

export default function MyReportsTableRow({ row, getStatusColor, getStatusTextColor, onCancel }) {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleConfirmCancel = () => {
    onCancel(row);
    setOpenDialog(false);
  };

  return (
    <>
      <TableRow sx={{ borderBottom: '1px solid #f0f0f0' }}>
        <TableCell sx={{ color: '#666', textAlign: 'center', verticalAlign: 'middle' }}>
          {row.targetType}
        </TableCell>

        <TableCell align="center">
          <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center">
            {row.targetType === 'user' ? (
              <PersonIcon fontSize="small" />
            ) : (
              <MenuBookIcon fontSize="small" />
            )}
            <Typography variant="body2" component="span">
              {row.targetType === 'user'
                ? row.targetId?.fullName || 'User Not Found'
                : row.targetId?.Title || 'Book Not Found'}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell sx={{ color: '#666', textAlign: 'center', verticalAlign: 'middle' }}>
          {row.reason}
        </TableCell>

        <TableCell sx={{ color: '#666', textAlign: 'center', verticalAlign: 'middle' }}>
          {new Date(row.createdAt).toLocaleDateString()}
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
            <Button
              variant="text"
              sx={{ color: '#2563EB', textTransform: 'capitalize' }}
              onClick={handleOpenDialog}
            >
              Cancel
            </Button>
          ) : (
            <Typography sx={{ color: '#999', fontSize: '0.9rem' }}>—</Typography>
          )}
        </TableCell>
      </TableRow>

      {/* Dialog التأكيد */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{ sx: { borderRadius: 3, p: 1.5 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: '#b91c1c' }}>
          Confirm Cancel Report
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#555', mt: 1 }}>
            Are you sure you want to <strong>cancel this report</strong>? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ textTransform: 'none', fontWeight: 600 }}>
            No
          </Button>
          <Button
            onClick={handleConfirmCancel}
            color="error"
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
