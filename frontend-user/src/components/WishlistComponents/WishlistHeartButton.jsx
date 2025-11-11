import { useState } from 'react';
import { IconButton, Popover, Alert } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../redux/slices/wishlist.slice';

export default function WishlistHeartButton({ bookId }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const user = useSelector((state) => state.auth?.user);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const isInWishlist = wishlistItems.some((item) => item.bookId?._id === bookId);

  const handleClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (isLoading) return;

    if (!user) {
      setAnchorEl(e.currentTarget);
      setTimeout(() => setAnchorEl(null), 1500);
      return;
    }

    setIsLoading(true);
    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(bookId)).unwrap();
      } else {
        await dispatch(addToWishlist(bookId)).unwrap();
      }
    } catch (error) {
      console.error('Wishlist error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleClick}
        disabled={isLoading}
        sx={{
          color: isInWishlist ? '#e91e63' : '#666',
          p: 0,
          width: 34,
          height: 34,
          '& .MuiSvgIcon-root': { fontSize: 24 },
          transition: 'all 0.2s ease',
          '&:hover': {
            color: isInWishlist ? '#c2185b' : '#e91e63',
          },
          '&:active': {
            transform: 'scale(0.9)',
          },
        }}
      >
        {isInWishlist ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        PaperProps={{
          sx: {
            mt: 0.5,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            borderRadius: 1,
          },
        }}
      >
        <Alert
          severity="warning"
          sx={{
            bgcolor: '#fff3e0',
            color: '#e65100',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            py: 0.5,
            px: 1.5,
            border: '1px solid #ffb74d',
          }}
        >
          Log in first
        </Alert>
      </Popover>
    </>
  );
}
