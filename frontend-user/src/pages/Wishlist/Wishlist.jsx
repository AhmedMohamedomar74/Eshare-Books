import { useState } from 'react';
import { Box, Button, Container, Grid } from '@mui/material';
import WishlistHeader from '../../components/WishlistComponents/WishlistHeader';
import WishlistEmptyState from '../../components/WishlistComponents/WishlistEmptyState';
import BookCardGrid from '../../components/WishlistComponents/BookCardGrid';
import BookCardList from '../../components/WishlistComponents/BookCardList';
import MenuBookIcon from '@mui/icons-material/MenuBook';

export default function Wishlist() {
  const [viewMode, setViewMode] = useState('grid');
  const [wishlistBooks, setWishlistBooks] = useState([
    {
      id: '1',
      Title: 'The Midnight Library',
      author: 'Matt Haig',
      image: 'https://diwanegypt.com/wp-content/uploads/2021/02/9781786892737-663x1024.jpg',
      Price: 100,
      TransactionType: 'toSale',
    },
    {
      id: '2',
      Title: 'Project Hail Mary',
      author: 'Andy Weir',
      image: 'https://m.media-amazon.com/images/I/91ENQs2KLAL._SL1500_.jpg',
      Price: 120,
      TransactionType: 'toSale',
    },
    {
      id: '3',
      Title: 'Klara and the Sun',
      author: 'Kazuo Ishiguro',
      image: 'https://m.media-amazon.com/images/I/61tqFlvlU3L._SL1500_.jpg',
      Price: 95,
      TransactionType: 'toSale',
    },
    {
      id: '4',
      Title: 'The Four Winds',
      author: 'Kristin Hannah',
      image: 'https://m.media-amazon.com/images/I/91TM7gPW0uL._SL1500_.jpg',
      Price: 110,
      TransactionType: 'toSale',
    },
  ]);

  const handleDelete = (id) => {
    setWishlistBooks((prev) => prev.filter((book) => book.id !== id));
  };

  const handleView = (id) => {
    console.log('View book:', id);
    // Navigate to book details page
  };

  const handleBrowse = () => {
    console.log('Navigating to books...');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <WishlistHeader viewMode={viewMode} onViewChange={setViewMode} />

        {wishlistBooks.length === 0 ? (
          <WishlistEmptyState onBrowse={handleBrowse} />
        ) : viewMode === 'grid' ? (
          <Grid
            container
            spacing={3}
            sx={{
              justifyContent: 'center',
            }}
          >
            {wishlistBooks.map((book) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                lg={3}
                key={book.id}
                sx={{
                  display: 'flex',
                  height: '100%',
                }}
              >
                <BookCardGrid book={book} onDelete={handleDelete} onView={handleView} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {wishlistBooks.map((book) => (
              <BookCardList key={book.id} book={book} onDelete={handleDelete} onView={handleView} />
            ))}
          </Box>
        )}
      </Container>

      <Button
        variant="contained"
        size="large"
        startIcon={<MenuBookIcon />}
        onClick={handleBrowse}
        sx={{
          width: '200px',
          borderRadius: 3,
          textTransform: 'none',
          px: 4,
          py: 1.5,
          mb: 1.5,
          fontWeight: 600,
          backgroundColor: '#1976d2',
          '&:hover': { backgroundColor: '#1565c0' },
        }}
      >
        Browse Books
      </Button>
    </Box>
  );
}
