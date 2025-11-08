import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import notFoundImage from '/src/assets/not_foundimage.png';

export default function BookCardList({ book, onView, onDelete }) {
  const imageSrc = book.image?.secure_url || notFoundImage;
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleConfirmDelete = () => {
    onDelete(book);
    setOpenDialog(false);
  };

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={imageSrc}
          alt={book.Title}
          sx={{ width: 120, height: 160, objectFit: 'cover' }}
          loading="lazy"
        />

        <CardContent
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: '#000',
                mb: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {book.Title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {book.TransactionType}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              onClick={onView}
              sx={{ backgroundColor: '#1976d2', textTransform: 'none', fontWeight: 'bold' }}
            >
              View Details
            </Button>

            <Button
              variant="outlined"
              onClick={handleOpenDialog}
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                borderColor: '#ddd',
                color: '#666',
                '&:hover': {
                  borderColor: '#f44336',
                  color: '#f44336',
                },
              }}
            >
              Remove
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{ sx: { borderRadius: 3, p: 1.5 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: '#b91c1c' }}>
          Confirm Book Removal
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#555', mt: 1 }}>
            Are you sure you want to <strong>remove this book</strong> from your wishlist? This
            action <strong>cannot be undone.</strong>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Yes, Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
