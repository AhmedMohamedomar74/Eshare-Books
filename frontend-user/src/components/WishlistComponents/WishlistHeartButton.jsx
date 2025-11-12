import { useState, useEffect } from 'react';
import { IconButton, Snackbar, Alert } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import api from '../../axiosInstance/axiosInstance';
import { useDispatch } from 'react-redux';
import { fetchWishlist } from '../../redux/slices/wishlist.slice';

export default function WishlistHeartButton({ bookId }) {
  const dispatch = useDispatch();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!accessToken) {
      setIsInWishlist(false);
      return;
    }

    const checkWishlist = async () => {
      try {
        const res = await api.get('/wishlist');
        const items = res.data.data.items || [];
        const inWishlist = items.some((item) => item.bookId._id === bookId);
        setIsInWishlist(inWishlist);
      } catch (err) {
        console.error('Failed to check wishlist:', err);
      }
    };

    checkWishlist();
  }, [bookId, accessToken]);

  const handleClick = async (e) => {
    e.stopPropagation();

    if (!accessToken) {
      setMessage('Log in first');
      setSeverity('warning');
      setOpenSnackbar(true);
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      if (isInWishlist) {
        await api.delete(`/wishlist/${bookId}`);
        setIsInWishlist(false);
      } else {
        await api.post('/wishlist', { bookId });
        setIsInWishlist(true);
      }

      dispatch(fetchWishlist());
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update wishlist';
      setMessage(msg);
      setSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        disabled={loading}
        size="small"
        sx={{
          color: isInWishlist ? '#e91e63' : '#666',
          p: 0.5,
          '& .MuiSvgIcon-root': { fontSize: 20 },
          transition: 'all 0.2s ease',
          '&:hover': {
            color: isInWishlist ? '#c2185b' : '#e91e63',
            transform: 'scale(1.1)',
          },
        }}
      >
        {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={severity}
          sx={{ width: '100%', fontWeight: 'bold' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}
