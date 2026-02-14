import { Box, Typography } from '@mui/material';

const WishlistEmptyState = () => {
  const texts = {
    title: 'Your wishlist is empty',
    subtitle: 'Add your favorite books and find them here later.',
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
    </Box>
  );
};

export default WishlistEmptyState;
