import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { useDispatch } from 'react-redux';
import { clearWishlist } from '../../redux/slices/wishlist.slice';

export default function ClearWishlistButton() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleConfirmClear = () => {
    dispatch(clearWishlist());
    handleClose();
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        startIcon={<DeleteSweepIcon />}
        onClick={handleOpen}
        sx={{
          borderRadius: 3,
          textTransform: 'none',
          px: 3,
          py: 1,
          fontWeight: 600,
          mt: 2,
          mb: 2,
          alignSelf: 'flex-end',
          borderWidth: 2,
          '&:hover': {
            backgroundColor: '#fee2e2',
            borderColor: '#dc2626',
          },
        }}
      >
        Clear Wishlist
      </Button>

      {/* Confirmation Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { borderRadius: 3, p: 1.5 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: '#b91c1c' }}>
          Confirm Clear Wishlist
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#555', mt: 1 }}>
            Are you sure you want to <strong>remove all items</strong> from your wishlist? This
            action <strong>cannot be undone.</strong>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmClear}
            color="error"
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Yes, Clear
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          Wishlist cleared successfully!
        </Alert>
      </Snackbar>
    </>
  );
}
