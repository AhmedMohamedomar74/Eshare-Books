// src/components/WishlistComponents/WishlistEmptyState.jsx

import { Box, Typography, Button } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const WishlistEmptyState = ({ onBrowse }) => {
  const texts = {
    title: 'Your wishlist is empty',
    subtitle: 'Add your favorite books and find them here later.',
    button: 'Browse Books',
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        px: 2,
      }}
    >
      <Box
        component="img"
        src="/src/assets/emptyWishlist.ico"
        alt="Empty Wishlist"
        sx={{
          width: { xs: 100, sm: 130 },
          height: 'auto',
          mb: 3,
        }}
      />

      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          color: 'text.primary',
          mb: 1,
        }}
      >
        {texts.title}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          maxWidth: 400,
          mx: 'auto',
          mb: 4,
        }}
      >
        {texts.subtitle}
      </Typography>

      <Button
        variant="contained"
        size="large"
        startIcon={<MenuBookIcon />}
        onClick={onBrowse}
        sx={{
          borderRadius: 3,
          textTransform: 'none',
          px: 4,
          py: 1.5,
          fontWeight: 600,
          backgroundColor: '#1976d2',
          '&:hover': { backgroundColor: '#1565c0' },
        }}
      >
        {texts.button}
      </Button>
    </Box>
  );
};

export default WishlistEmptyState;
