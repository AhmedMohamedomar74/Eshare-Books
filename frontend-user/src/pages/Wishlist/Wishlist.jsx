import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Container, Grid } from '@mui/material';
import WishlistHeader from '../../components/WishlistComponents/WishlistHeader';
import WishlistEmptyState from '../../components/WishlistComponents/WishlistEmptyState';
import BookCardGrid from '../../components/WishlistComponents/BookCardGrid';
import BookCardList from '../../components/WishlistComponents/BookCardList';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { fetchWishlist, removeFromWishlist } from '../../redux/slices/wishlist.slice';
import { useNavigate } from 'react-router-dom';
import ClearWishlistButton from '../../components/WishlistComponents/ClearWishlistButton';

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: wishlistBooks, loading } = useSelector((state) => state.wishlist);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(removeFromWishlist(id));
  };

  const handleView = (id) => {
    navigate(`/details/${id}`);
  };

  const handleBrowse = () => {
    navigate('/');
  };

  if (loading) {
    return <p style={{ textAlign: 'center' }}>Loading wishlist...</p>;
  }

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
        <ClearWishlistButton />

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
                key={book._id}
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
              <BookCardList
                key={book._id}
                book={book}
                onDelete={handleDelete}
                onView={handleView}
              />
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
